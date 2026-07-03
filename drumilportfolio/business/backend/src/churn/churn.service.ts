import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/audit-log.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChurnService {
    constructor(
        private prisma: PrismaService,
        private audit: AuditLogService,
    ) { }

    async getScores(tenantId: string) {
        if (tenantId === 'demo') return this.demoScores();

        return this.prisma.accountHealthScore.findMany({
            where: { tenantId },
            include: { customer: true },
            orderBy: { score: 'asc' }, // lowest (most at-risk) first
        });
    }

    async recompute(tenantId: string) {
        if (tenantId === 'demo') return { scored: 0 };

        const customers = await this.prisma.customer.findMany({
            where: { tenantId },
            include: {
                orders: { orderBy: { createdAt: 'desc' }, take: 20 },
            },
        });

        let scored = 0;
        for (const customer of customers) {
            if (customer.orders.length === 0) continue;

            const { score, factors } = this.computeRfm(customer);
            const suggestion = await this.generateSuggestion(customer, score, factors);

            await this.prisma.accountHealthScore.upsert({
                where: { customerId: customer.id },
                create: { tenantId, customerId: customer.id, score, factors, suggestion },
                update: { score, factors, suggestion, scoredAt: new Date() },
            });

            if (score < 40) {
                await this.audit.log({
                    tenantId,
                    module: 'CHURN',
                    action: 'FLAGGED',
                    entityType: 'Customer',
                    entityId: customer.id,
                    reasoning: `${customer.name} scored ${score.toFixed(0)}/100. Top factors: ${(factors as any[]).slice(0, 2).map((f: any) => f.name).join(', ')}.`,
                });
            }
            scored++;
        }

        return { scored };
    }

    // ── RFM Scoring ─────────────────────────────────────────────────────────────
    // Weights: Recency 30% | Frequency trend 30% | Monetary trend 20% | Payment latency 20%

    private computeRfm(customer: any) {
        const orders = customer.orders as any[];
        const now = Date.now();

        // Recency (days since last order, lower = better)
        const daysSinceLast = (now - new Date(orders[0].createdAt).getTime()) / 86400_000;
        const recencyScore = Math.max(0, 100 - daysSinceLast * 2);

        // Frequency trend (compare recent 3 vs prior 3 order gap)
        const recentGaps = this.avgGapDays(orders.slice(0, 3));
        const priorGaps = this.avgGapDays(orders.slice(3, 6));
        const freqTrend = priorGaps > 0 ? Math.min(100, (priorGaps / Math.max(recentGaps, 1)) * 100) : 70;

        // Monetary trend (recent AOV vs prior AOV)
        const recentAov = orders.slice(0, 3).reduce((s: number, o: any) => s + o.revenue, 0) / 3;
        const priorAov = orders.slice(3, 6).reduce((s: number, o: any) => s + o.revenue, 0) / Math.max(orders.slice(3, 6).length, 1);
        const monetaryScore = priorAov > 0 ? Math.min(100, (recentAov / priorAov) * 100) : 80;

        // Payment latency (overdue orders as % of recent)
        const overdueCount = orders.slice(0, 5).filter((o: any) => o.invoiceStatus === 'OVERDUE').length;
        const paymentScore = Math.max(0, 100 - overdueCount * 25);

        const score =
            recencyScore * 0.30 +
            freqTrend * 0.30 +
            monetaryScore * 0.20 +
            paymentScore * 0.20;

        const factors = [
            { name: 'Recency', weight: 0.30, value: daysSinceLast.toFixed(0), contribution: recencyScore * 0.30, direction: recencyScore < 40 ? 'down' : 'up' },
            { name: 'Order frequency trend', weight: 0.30, value: `${recentGaps.toFixed(0)}d avg gap`, contribution: freqTrend * 0.30, direction: freqTrend < 60 ? 'down' : 'up' },
            { name: 'Spend trend', weight: 0.20, value: `$${recentAov.toFixed(0)} recent AOV`, contribution: monetaryScore * 0.20, direction: monetaryScore < 70 ? 'down' : 'up' },
            { name: 'Payment latency', weight: 0.20, value: `${overdueCount} overdue`, contribution: paymentScore * 0.20, direction: paymentScore < 60 ? 'down' : 'up' },
        ].sort((a, b) => a.contribution - b.contribution); // worst contributors first

        return { score: Math.round(score), factors };
    }

    private avgGapDays(orders: any[]) {
        if (orders.length < 2) return 30;
        let total = 0;
        for (let i = 0; i < orders.length - 1; i++) {
            total += (new Date(orders[i].createdAt).getTime() - new Date(orders[i + 1].createdAt).getTime()) / 86400_000;
        }
        return total / (orders.length - 1);
    }

    private async generateSuggestion(customer: any, score: number, factors: any[]) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || score >= 60) return null;

        const topFactors = (factors as any[]).slice(0, 2).map((f: any) => `${f.name}: ${f.value}`).join('; ');

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(
                `Customer "${customer.name}" has a churn risk score of ${score}/100. Main risk factors: ${topFactors}. Suggest one specific, actionable retention action in 1-2 sentences. Be concrete, not generic.`
            );
            return result.response.text().trim();
        } catch {
            return `Reach out to ${customer.name} with a personalized check-in referencing their recent order history and offer priority support or a loyalty incentive.`;
        }
    }

    // ── Demo ─────────────────────────────────────────────────────────────────────

    private demoScores() {
        return [
            {
                id: 'demo-1',
                score: 22,
                suggestion: 'Schedule a proactive check-in call and offer a 10% loyalty discount on the next order — their purchase frequency has dropped 60% over the last quarter.',
                factors: [
                    { name: 'Order frequency trend', weight: 0.30, value: '42d avg gap', contribution: 12, direction: 'down' },
                    { name: 'Recency', weight: 0.30, value: '38 days', contribution: 14, direction: 'down' },
                    { name: 'Spend trend', weight: 0.20, value: '$1,200 recent AOV', contribution: 18, direction: 'up' },
                    { name: 'Payment latency', weight: 0.20, value: '1 overdue', contribution: 15, direction: 'down' },
                ],
                customer: { name: 'NexaTech Solutions', email: 'accounts@nexatech.io' },
            },
            {
                id: 'demo-2',
                score: 35,
                suggestion: 'Send a reactivation email highlighting 2 new products relevant to their past purchases — their AOV is healthy but order gap has widened to 28 days.',
                factors: [
                    { name: 'Order frequency trend', weight: 0.30, value: '28d avg gap', contribution: 18, direction: 'down' },
                    { name: 'Payment latency', weight: 0.20, value: '0 overdue', contribution: 20, direction: 'up' },
                    { name: 'Recency', weight: 0.30, value: '21 days', contribution: 24, direction: 'up' },
                    { name: 'Spend trend', weight: 0.20, value: '$3,400 recent AOV', contribution: 16, direction: 'up' },
                ],
                customer: { name: 'Meridian Group', email: 'procurement@meridian.co' },
            },
            {
                id: 'demo-3',
                score: 71,
                suggestion: null,
                factors: [
                    { name: 'Recency', weight: 0.30, value: '6 days', contribution: 28, direction: 'up' },
                    { name: 'Order frequency trend', weight: 0.30, value: '9d avg gap', contribution: 27, direction: 'up' },
                    { name: 'Spend trend', weight: 0.20, value: '$5,100 recent AOV', contribution: 20, direction: 'up' },
                    { name: 'Payment latency', weight: 0.20, value: '0 overdue', contribution: 20, direction: 'up' },
                ],
                customer: { name: 'Apex Industries', email: 'fin@apex.com' },
            },
        ];
    }
}
