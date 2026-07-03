import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/audit-log.service';
import { CashFlowService } from '../cashflow/cashflow.service';
import { FollowUpService } from '../followup/followup.service';
import { ChurnService } from '../churn/churn.service';
import { ProcurementService } from '../procurement/procurement.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class DigestService {
    constructor(
        private prisma: PrismaService,
        private audit: AuditLogService,
        private cashflow: CashFlowService,
        private followup: FollowUpService,
        private churn: ChurnService,
        private procurement: ProcurementService,
    ) { }

    async generate(tenantId: string) {
        if (tenantId === 'demo') return this.demoDigest();

        // Gather signals from all modules in parallel
        const [anomalies, queue, scores, reorderAlerts, priceDeviations] = await Promise.all([
            this.cashflow.getAnomalies(tenantId).catch(() => []),
            this.followup.getQueue(tenantId).catch(() => []),
            this.churn.getScores(tenantId).catch(() => []),
            this.procurement.getReorderAlerts(tenantId).catch(() => []),
            this.procurement.getPriceDeviations(tenantId).catch(() => []),
        ]);

        // Build raw items ranked by estimated $ impact
        const rawItems: any[] = [
            ...(anomalies as any[]).map(a => ({
                module: 'CASHFLOW',
                impact: Math.abs(a.estimatedImpact || 0),
                severity: a.severity,
                title: a.title,
                reasoning: a.reasoning,
                action: { label: 'Review', type: 'REVIEW', entityType: 'anomaly' },
            })),
            ...(queue as any[]).slice(0, 3).map(t => ({
                module: 'FOLLOWUP',
                impact: t.order?.revenue || 0,
                severity: 'medium',
                title: `Follow up with ${t.customer?.name}`,
                reasoning: t.reasoning,
                action: { label: 'Send follow-up', type: 'SEND_FOLLOWUP', entityId: t.id },
            })),
            ...(scores as any[]).filter((s: any) => s.score < 40).map(s => ({
                module: 'CHURN',
                impact: s.customer?.lifetimeValue || 5000,
                severity: 'high',
                title: `${s.customer?.name} is at churn risk`,
                reasoning: s.suggestion || `Score: ${s.score}/100`,
                action: { label: 'View account', type: 'VIEW_ACCOUNT', entityId: s.customerId },
            })),
            ...(reorderAlerts as any[]).map(a => ({
                module: 'PROCUREMENT',
                impact: 2000,
                severity: a.currentQty === 0 ? 'high' : 'medium',
                title: `Reorder ${a.productName}`,
                reasoning: a.reasoning,
                action: { label: 'Draft PO', type: 'DRAFT_PO', entityId: a.inventoryId },
            })),
            ...(priceDeviations as any[]).map(d => ({
                module: 'PROCUREMENT',
                impact: d.estimatedAnnualImpact || 3000,
                severity: 'medium',
                title: `Price creep on ${d.sku}`,
                reasoning: d.reasoning,
                action: { label: 'Review pricing', type: 'REVIEW', entityType: 'priceDeviation' },
            })),
        ];

        rawItems.sort((a, b) => b.impact - a.impact);
        const top3 = rawItems.slice(0, 3);

        // Optionally wrap in a Gemini-written brief
        const summary = await this.generateBrief(top3);

        await this.audit.log({
            tenantId,
            module: 'DIGEST',
            action: 'FLAGGED',
            reasoning: `Digest generated with ${top3.length} items. Top: ${top3[0]?.title || 'none'}.`,
        });

        return { items: top3, summary, generatedAt: new Date() };
    }

    private async generateBrief(items: any[]): Promise<string> {
        if (!items.length) return 'No critical items today. Business is operating within normal parameters.';
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return items.map((item, i) => `${i + 1}. ${item.title}: ${item.reasoning}`).join('\n\n');

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const itemText = items.map((item, i) => `${i + 1}. [${item.module}] ${item.title} — ${item.reasoning}`).join('\n');
            const result = await model.generateContent(
                `You are a senior business analyst. Write a crisp executive brief (max 3 sentences total) covering these ${items.length} priority items for a business owner's morning review:\n\n${itemText}\n\nRules: start with the highest-impact item, be direct, no fluff, focus on what action is needed.`
            );
            return result.response.text().trim();
        } catch {
            return items.map((item, i) => `${i + 1}. ${item.title}`).join(' | ');
        }
    }

    private demoDigest() {
        return {
            generatedAt: new Date(),
            summary: 'Cash reserves are projected negative in 90 days — prioritize accelerating AR on the 3 overdue invoices totalling $18,600. Marcus Chen\'s $18,200 deal is 12 days stalled and should be your first call today. NexaTech Solutions\' churn score has dropped to 22/100; a targeted outreach with a loyalty incentive could recover an estimated $40k LTV.',
            items: [
                {
                    module: 'CASHFLOW',
                    impact: 8400,
                    severity: 'high',
                    title: 'Cash projected negative in 90 days',
                    reasoning: 'Projected cash position in 90 days is -$8,400. Accelerate AR collections or defer AP to avoid shortfall.',
                    action: { label: 'Review cash flow', type: 'REVIEW', entityType: 'cashflow' },
                },
                {
                    module: 'FOLLOWUP',
                    impact: 18200,
                    severity: 'high',
                    title: 'Follow up with Marcus Chen',
                    reasoning: 'Quote Q-2041 for $18,200 sent 12 days ago — no reply. Priority score: 9,840.',
                    action: { label: 'Send follow-up', type: 'SEND_FOLLOWUP', entityId: 'demo-1' },
                },
                {
                    module: 'CHURN',
                    impact: 40000,
                    severity: 'high',
                    title: 'NexaTech Solutions at churn risk',
                    reasoning: 'Churn score 22/100. Order frequency dropped 60%, 1 overdue invoice. Suggested: loyalty incentive + proactive call.',
                    action: { label: 'View account', type: 'VIEW_ACCOUNT', entityId: 'demo-1' },
                },
            ],
        };
    }
}
