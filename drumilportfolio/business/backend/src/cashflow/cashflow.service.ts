import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/audit-log.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CashFlowService {
    constructor(
        private prisma: PrismaService,
        private audit: AuditLogService,
    ) { }

    // ── Public API ──────────────────────────────────────────────────────────────

    async getProjections(tenantId: string) {
        if (tenantId === 'demo') return this.demoProjections();

        const [orders, snapshots] = await Promise.all([
            this.prisma.order.findMany({ where: { tenantId } }),
            this.prisma.cashFlowSnapshot.findMany({
                where: { tenantId },
                orderBy: { snapshotAt: 'desc' },
                take: 3,
            }),
        ]);

        // If fresh snapshots exist (< 4h old), return them
        const fresh = snapshots.filter(s =>
            Date.now() - s.snapshotAt.getTime() < 4 * 60 * 60 * 1000
        );
        if (fresh.length === 3) return fresh;

        // Recompute
        return this.computeAndStore(tenantId, orders);
    }

    async getAnomalies(tenantId: string) {
        if (tenantId === 'demo') return this.demoAnomalies();

        const orders = await this.prisma.order.findMany({
            where: { tenantId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'asc' },
        });

        const anomalies = [
            ...this.detectExpenseSpikes(orders),
            ...this.detectMarginErosion(orders),
            ...this.detectDuplicateInvoices(orders),
        ];

        // Log each new anomaly
        for (const a of anomalies) {
            await this.audit.log({
                tenantId,
                module: 'CASHFLOW',
                action: 'FLAGGED',
                entityType: 'Order',
                reasoning: a.reasoning,
            });
        }

        return anomalies;
    }

    // ── Computation ──────────────────────────────────────────────────────────────

    private async computeAndStore(tenantId: string, orders: any[]) {
        const now = Date.now();
        const results: any[] = [];

        for (const horizon of [30, 60, 90]) {
            const { projected, confidence } = this.projectCashPosition(orders, horizon, now);
            const warnings = this.buildWarnings(projected, horizon);

            const snap = await this.prisma.cashFlowSnapshot.create({
                data: {
                    tenantId, horizon, projected, confidence,
                    warnings: warnings ?? Prisma.JsonNull,
                },
            });
            results.push(snap);

            if (warnings && (warnings as any[]).length > 0) {
                await this.audit.log({
                    tenantId,
                    module: 'CASHFLOW',
                    action: 'FLAGGED',
                    entityType: 'CashFlowSnapshot',
                    entityId: snap.id,
                    reasoning: `${horizon}-day projected cash: $${projected.toFixed(0)}. Shortfall risk detected.`,
                });
            }
        }

        return results;
    }

    private projectCashPosition(orders: any[], horizonDays: number, nowMs: number) {
        const cutoff = new Date(nowMs - 90 * 86400_000);
        const recent = orders.filter(o => new Date(o.createdAt) >= cutoff);

        const totalRevenue = recent.reduce((s, o) => s + (o.revenue || 0), 0);
        const totalCost = recent.reduce((s, o) => s + (o.totalCost || 0), 0);
        const dailyNetRate = (totalRevenue - totalCost) / 90;

        // Pending AR that hasn't been paid
        const pendingAR = orders
            .filter(o => ['PENDING', 'OVERDUE'].includes(o.invoiceStatus || ''))
            .reduce((s, o) => s + (o.revenue || 0), 0);

        const projected = dailyNetRate * horizonDays + pendingAR * 0.7; // 70% collection rate
        const confidence = Math.max(0.5, 0.95 - horizonDays * 0.003); // widens with time

        return { projected, confidence };
    }

    private buildWarnings(projected: number, horizon: number) {
        const warnings: any[] = [];
        if (projected < 0) {
            warnings.push({
                type: 'SHORTFALL',
                message: `Projected cash position in ${horizon} days is negative ($${projected.toFixed(0)}). Accelerate AR collections or defer AP.`,
                estimatedImpact: projected,
            });
        } else if (projected < 10_000) {
            warnings.push({
                type: 'LOW_RESERVES',
                message: `Cash reserves may fall below $10k within ${horizon} days. Review upcoming AP commitments.`,
                estimatedImpact: projected,
            });
        }
        return warnings.length ? warnings : null;
    }

    // ── Anomaly Detectors ────────────────────────────────────────────────────────

    private detectExpenseSpikes(orders: any[]) {
        // Group weekly costs
        const weeks: Record<string, number> = {};
        for (const o of orders) {
            const week = this.isoWeek(new Date(o.createdAt));
            weeks[week] = (weeks[week] || 0) + (o.totalCost || 0);
        }
        const values = Object.values(weeks);
        if (values.length < 4) return [];

        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const std = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
        const latest = values[values.length - 1];
        const z = std > 0 ? (latest - mean) / std : 0;

        if (z > 2.5) {
            return [{
                type: 'EXPENSE_SPIKE',
                severity: 'high',
                title: 'Unusual expense spike detected',
                reasoning: `This week's costs are ${z.toFixed(1)}σ above the rolling average ($${latest.toFixed(0)} vs avg $${mean.toFixed(0)}). Likely cause: supplier price increase or data entry error.`,
                estimatedImpact: latest - mean,
            }];
        }
        return [];
    }

    private detectMarginErosion(orders: any[]) {
        const recent4 = this.weeklyMargins(orders).slice(-4);
        const prior4 = this.weeklyMargins(orders).slice(-8, -4);
        if (recent4.length < 4 || prior4.length < 4) return [];

        const recentAvg = recent4.reduce((a, b) => a + b, 0) / 4;
        const priorAvg = prior4.reduce((a, b) => a + b, 0) / 4;
        const drop = priorAvg - recentAvg;

        if (drop > 5) {
            return [{
                type: 'MARGIN_EROSION',
                severity: 'medium',
                title: 'Profit margin declining',
                reasoning: `Trailing 4-week margin (${recentAvg.toFixed(1)}%) is ${drop.toFixed(1)}pp below the prior 4-week average (${priorAvg.toFixed(1)}%). Review cost structure or pricing.`,
                estimatedImpact: -(drop / 100) * orders.slice(-20).reduce((s, o) => s + o.revenue, 0),
            }];
        }
        return [];
    }

    private detectDuplicateInvoices(orders: any[]) {
        const seen = new Map<string, any>();
        const dupes: any[] = [];

        for (const o of orders) {
            const key = `${o.customerId}|${o.totalAmount}`;
            const existing = seen.get(key);
            if (existing) {
                const daysDiff = Math.abs(
                    new Date(o.createdAt).getTime() - new Date(existing.createdAt).getTime()
                ) / 86400_000;
                if (daysDiff <= 3) {
                    dupes.push({
                        type: 'DUPLICATE_INVOICE',
                        severity: 'high',
                        title: `Possible duplicate invoice — $${o.totalAmount}`,
                        reasoning: `Order ${o.orderNumber} and ${existing.orderNumber} have the same customer and amount ($${o.totalAmount}) within 3 days. Verify before processing.`,
                        estimatedImpact: o.totalAmount,
                    });
                }
            }
            seen.set(key, o);
        }
        return dupes;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private weeklyMargins(orders: any[]) {
        const weeks: Record<string, { rev: number; cost: number }> = {};
        for (const o of orders) {
            const week = this.isoWeek(new Date(o.createdAt));
            if (!weeks[week]) weeks[week] = { rev: 0, cost: 0 };
            weeks[week].rev += o.revenue || 0;
            weeks[week].cost += o.totalCost || 0;
        }
        return Object.values(weeks).map(w => w.rev > 0 ? ((w.rev - w.cost) / w.rev) * 100 : 0);
    }

    private isoWeek(date: Date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
        const week1 = new Date(d.getFullYear(), 0, 4);
        return `${d.getFullYear()}-W${String(1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)).padStart(2, '0')}`;
    }

    // ── Demo Data ────────────────────────────────────────────────────────────────

    private demoProjections() {
        return [
            { horizon: 30, projected: 94200, confidence: 0.92, warnings: null },
            { horizon: 60, projected: 61800, confidence: 0.84, warnings: [{ type: 'LOW_RESERVES', message: 'Reserves may fall below $10k within 60 days.', estimatedImpact: 61800 }] },
            { horizon: 90, projected: -8400, confidence: 0.73, warnings: [{ type: 'SHORTFALL', message: 'Projected cash negative in 90 days. Accelerate AR or defer AP.', estimatedImpact: -8400 }] },
        ];
    }

    private demoAnomalies() {
        return [
            { type: 'EXPENSE_SPIKE', severity: 'high', title: 'Unusual expense spike detected', reasoning: "This week's costs are 3.1σ above rolling average ($42,100 vs avg $28,400). Likely supplier price increase on 'Sensor Array SA-202'.", estimatedImpact: 13700 },
            { type: 'DUPLICATE_INVOICE', severity: 'high', title: 'Possible duplicate invoice — $4,800', reasoning: 'Orders #1042 and #1039 share same customer and amount within 2 days. Verify before processing.', estimatedImpact: 4800 },
            { type: 'MARGIN_EROSION', severity: 'medium', title: 'Profit margin declining', reasoning: 'Trailing 4-week margin (11.2%) is 6.3pp below prior 4-week avg (17.5%). Review pricing on B3 category.', estimatedImpact: -18900 },
        ];
    }
}
