import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/audit-log.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ProcurementService {
    constructor(
        private prisma: PrismaService,
        private audit: AuditLogService,
    ) { }

    // ── Suppliers ────────────────────────────────────────────────────────────────

    async getSuppliers(tenantId: string) {
        if (tenantId === 'demo') return this.demoSuppliers();
        return this.prisma.supplier.findMany({ where: { tenantId }, include: { purchaseOrders: { take: 3, orderBy: { createdAt: 'desc' } } } });
    }

    async createSupplier(tenantId: string, data: { name: string; contactEmail?: string; phone?: string; leadTimeDays?: number }) {
        return this.prisma.supplier.create({ data: { ...data, tenantId, leadTimeDays: data.leadTimeDays ?? 7 } });
    }

    // ── Reorder Alerts ───────────────────────────────────────────────────────────

    async getReorderAlerts(tenantId: string) {
        if (tenantId === 'demo') return this.demoReorderAlerts();

        const inventory = await this.prisma.inventory.findMany({
            where: { product: { tenantId } },
            include: { product: true, supplier: true },
        });

        const alerts: any[] = [];
        for (const inv of inventory) {
            const velocity = inv.salesVelocity || 1;
            const leadTime = inv.supplier?.leadTimeDays || 7;
            const safetyFactor = 1.5;
            const reorderPoint = Math.ceil(velocity * leadTime * safetyFactor);

            if (inv.quantity <= reorderPoint) {
                const qtyToOrder = Math.ceil(velocity * 30); // 30-day supply
                alerts.push({
                    inventoryId: inv.id,
                    productName: inv.product.name,
                    sku: inv.product.sku,
                    currentQty: inv.quantity,
                    reorderPoint,
                    suggestedQty: qtyToOrder,
                    supplierId: inv.supplierId,
                    supplierName: inv.supplier?.name,
                    reasoning: `Velocity: ${velocity.toFixed(1)} units/day × ${leadTime}d lead time × 1.5 safety = reorder at ${reorderPoint} units. Currently at ${inv.quantity}.`,
                });
            }
        }

        return alerts;
    }

    // ── Price Deviation Flagging ─────────────────────────────────────────────────

    async getPriceDeviations(tenantId: string) {
        if (tenantId === 'demo') return this.demoPriceDeviations();

        const history = await this.prisma.supplierPriceHistory.findMany({
            where: { supplier: { tenantId } },
            include: { supplier: true },
            orderBy: { recordedAt: 'desc' },
        });

        const bySku = new Map<string, typeof history>();
        for (const h of history) {
            const key = `${h.supplierId}|${h.sku}`;
            if (!bySku.has(key)) bySku.set(key, []);
            bySku.get(key)!.push(h);
        }

        const deviations: any[] = [];
        for (const [, records] of bySku) {
            if (records.length < 2) continue;
            const latest = records[0].unitCost;
            const trailing90Avg = records.slice(0, Math.min(10, records.length)).reduce((s, r) => s + r.unitCost, 0) / records.length;
            const pctChange = ((latest - trailing90Avg) / trailing90Avg) * 100;

            if (pctChange > 10) {
                deviations.push({
                    sku: records[0].sku,
                    supplierName: records[0].supplier.name,
                    latestCost: latest,
                    trailing90Avg: trailing90Avg.toFixed(2),
                    pctChange: pctChange.toFixed(1),
                    reasoning: `SKU ${records[0].sku} from ${records[0].supplier.name} is ${pctChange.toFixed(1)}% above its 90-day average cost ($${latest} vs avg $${trailing90Avg.toFixed(2)}). Flag before next PO.`,
                });

                await this.audit.log({
                    tenantId,
                    module: 'PROCUREMENT',
                    action: 'FLAGGED',
                    reasoning: deviations[deviations.length - 1].reasoning,
                });
            }
        }

        return deviations;
    }

    // ── Purchase Orders ──────────────────────────────────────────────────────────

    async getPurchaseOrders(tenantId: string) {
        if (tenantId === 'demo') return this.demoPurchaseOrders();
        return this.prisma.purchaseOrder.findMany({
            where: { tenantId },
            include: { supplier: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async draftPurchaseOrder(tenantId: string, body: { supplierId: string; items: { productId: string; qty: number; unitCost: number }[] }) {
        const supplier = await this.prisma.supplier.findUnique({ where: { id: body.supplierId } });
        if (!supplier) throw new Error('Supplier not found');

        const productIds = body.items.map(i => i.productId);
        const products = await this.prisma.product.findMany({ where: { id: { in: productIds } } });
        const productMap = new Map(products.map(p => [p.id, p]));

        // Build draft email via Gemini
        const lineItemText = body.items
            .map(i => {
                const p = productMap.get(i.productId);
                return `- ${p?.name || i.productId} (${p?.sku || ''}): ${i.qty} units @ $${i.unitCost}`;
            })
            .join('\n');

        const draftEmail = await this.generatePoEmail(supplier.name, lineItemText, supplier.contactEmail);

        const po = await this.prisma.purchaseOrder.create({
            data: {
                tenantId,
                supplierId: body.supplierId,
                status: 'DRAFT',
                draftEmail,
                items: {
                    create: body.items.map(i => ({
                        productId: i.productId,
                        quantity: i.qty,
                        unitCost: i.unitCost,
                    })),
                },
            },
            include: { supplier: true, items: { include: { product: true } } },
        });

        await this.audit.log({
            tenantId,
            module: 'PROCUREMENT',
            action: 'DRAFTED',
            entityType: 'PurchaseOrder',
            entityId: po.id,
            reasoning: `Draft PO created for ${supplier.name}. ${body.items.length} line items. Awaiting approval.`,
        });

        return po;
    }

    async approvePurchaseOrder(tenantId: string, poId: string, approvedBy: string) {
        const po = await this.prisma.purchaseOrder.update({
            where: { id: poId },
            data: { status: 'SENT', sentAt: new Date(), approvedBy },
        });

        await this.audit.log({
            tenantId,
            module: 'PROCUREMENT',
            action: 'APPROVED',
            entityType: 'PurchaseOrder',
            entityId: poId,
            reasoning: `PO approved by ${approvedBy} and marked as sent.`,
        });

        return po;
    }

    // ── Draft Email Generation ───────────────────────────────────────────────────

    private async generatePoEmail(supplierName: string, lineItems: string, contactEmail?: string | null) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return this.fallbackPoEmail(supplierName, lineItems);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(
                `Write a professional purchase order email to supplier "${supplierName}". Include these line items:\n${lineItems}\nRules: concise, professional, reference line items exactly, request confirmation of receipt and estimated delivery date. No subject line — body only. Max 5 sentences.`
            );
            return result.response.text().trim();
        } catch {
            return this.fallbackPoEmail(supplierName, lineItems);
        }
    }

    private fallbackPoEmail(supplierName: string, lineItems: string) {
        return `Dear ${supplierName} Team,\n\nPlease find below our purchase order for your review:\n\n${lineItems}\n\nKindly confirm receipt of this order and provide an estimated delivery date at your earliest convenience. Thank you for your continued partnership.`;
    }

    // ── Demo Data ────────────────────────────────────────────────────────────────

    private demoSuppliers() {
        return [
            { id: 's1', name: 'Axiom Supply Co.', contactEmail: 'orders@axiom.supply', leadTimeDays: 5, purchaseOrders: [] },
            { id: 's2', name: 'TechParts Global', contactEmail: 'po@techparts.io', leadTimeDays: 10, purchaseOrders: [] },
        ];
    }

    private demoReorderAlerts() {
        return [
            { inventoryId: 'i1', productName: 'Sensor Array SA-202', sku: 'SA-202', currentQty: 4, reorderPoint: 12, suggestedQty: 45, supplierName: 'Axiom Supply Co.', reasoning: 'Velocity: 1.5 units/day × 5d lead × 1.5 safety = reorder at 12. Currently at 4.' },
            { inventoryId: 'i2', productName: 'Executive Suite A1', sku: 'ES-A1', currentQty: 12, reorderPoint: 18, suggestedQty: 60, supplierName: 'TechParts Global', reasoning: 'Velocity: 2.0 units/day × 7d lead × 1.5 safety = reorder at 21. Currently at 12.' },
        ];
    }

    private demoPriceDeviations() {
        return [
            { sku: 'SA-202', supplierName: 'Axiom Supply Co.', latestCost: 84.50, trailing90Avg: '74.20', pctChange: '13.9', reasoning: 'SA-202 from Axiom Supply Co. is 13.9% above its 90-day average ($84.50 vs avg $74.20). Flag before next PO.' },
        ];
    }

    private demoPurchaseOrders() {
        return [
            { id: 'po1', status: 'DRAFT', supplier: { name: 'Axiom Supply Co.' }, items: [{ product: { name: 'Sensor Array SA-202', sku: 'SA-202' }, quantity: 45, unitCost: 74.20 }], draftEmail: 'Dear Axiom Supply Co. Team,\n\nPlease find our purchase order:\n- Sensor Array SA-202: 45 units @ $74.20\n\nKindly confirm receipt and estimated delivery. Thank you.', createdAt: new Date() },
        ];
    }
}
