import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/audit-log.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class FollowUpService {
    constructor(
        private prisma: PrismaService,
        private audit: AuditLogService,
    ) { }

    // ── Public API ──────────────────────────────────────────────────────────────

    async getQueue(tenantId: string) {
        if (tenantId === 'demo') return this.demoQueue();

        return this.prisma.followUpTask.findMany({
            where: { tenantId, status: 'PENDING' },
            include: { customer: true, order: true },
            orderBy: { priority: 'desc' },
        });
    }

    async detect(tenantId: string) {
        if (tenantId === 'demo') return { created: 0 };

        const staleDays = 7;
        const cutoff = new Date(Date.now() - staleDays * 86400_000);

        // Orders pending/overdue with no recent follow-up activity
        const staleOrders = await this.prisma.order.findMany({
            where: {
                tenantId,
                status: { in: ['PENDING', 'OVERDUE'] },
                updatedAt: { lt: cutoff },
            },
            include: { customer: true },
        });

        let created = 0;
        for (const order of staleOrders) {
            const existing = await this.prisma.followUpTask.findFirst({
                where: { tenantId, orderId: order.id, status: 'PENDING' },
            });
            if (existing) continue;

            const daysSince = Math.floor((Date.now() - order.updatedAt.getTime()) / 86400_000);
            const priority = order.revenue * 0.8 * Math.log(daysSince + 1);
            const draftMessage = await this.draftMessage(order, daysSince);

            await this.prisma.followUpTask.create({
                data: {
                    tenantId,
                    customerId: order.customerId,
                    orderId: order.id,
                    priority,
                    draftMessage,
                    reasoning: `Order ${order.orderNumber} ($${order.revenue}) stalled for ${daysSince} days. Status: ${order.status}.`,
                    status: 'PENDING',
                },
            });

            await this.audit.log({
                tenantId,
                module: 'FOLLOWUP',
                action: 'FLAGGED',
                entityType: 'Order',
                entityId: order.id,
                reasoning: `Order ${order.orderNumber} stalled ${daysSince}d — priority score ${priority.toFixed(0)}`,
            });
            created++;
        }

        return { created };
    }

    async send(tenantId: string, taskId: string) {
        const task = await this.prisma.followUpTask.update({
            where: { id: taskId },
            data: { status: 'SENT', sentAt: new Date() },
        });

        await this.audit.log({
            tenantId,
            module: 'FOLLOWUP',
            action: 'SENT',
            entityType: 'FollowUpTask',
            entityId: taskId,
            reasoning: 'User approved and sent follow-up draft.',
        });

        return task;
    }

    async dismiss(tenantId: string, taskId: string) {
        const task = await this.prisma.followUpTask.update({
            where: { id: taskId },
            data: { status: 'DISMISSED' },
        });

        await this.audit.log({
            tenantId,
            module: 'FOLLOWUP',
            action: 'DISMISSED',
            entityType: 'FollowUpTask',
            entityId: taskId,
        });

        return task;
    }

    // ── Draft generation ────────────────────────────────────────────────────────

    private async draftMessage(order: any, daysSince: number): Promise<string> {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return this.fallbackDraft(order, daysSince);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Write a concise, professional follow-up email for the following situation.
Customer: ${order.customer?.name || 'Valued Customer'}
Order: ${order.orderNumber} for $${order.revenue}
Days since last update: ${daysSince}
Order status: ${order.status}

Rules:
- Reference the actual order number and amount
- Be warm but professional
- Max 4 sentences
- Do not use generic templates or placeholders
- End with a clear ask (confirm payment, schedule a call, etc.)
- Do not include a subject line, just the body`;

            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch {
            return this.fallbackDraft(order, daysSince);
        }
    }

    private fallbackDraft(order: any, daysSince: number) {
        return `Hi ${order.customer?.name || 'there'},\n\nI wanted to follow up on order ${order.orderNumber} for $${order.revenue}, which has been pending for ${daysSince} days. Could you let us know if there's anything blocking progress on your end? We're happy to jump on a quick call to resolve any questions.\n\nLooking forward to hearing from you.`;
    }

    // ── Demo Data ────────────────────────────────────────────────────────────────

    private demoQueue() {
        return [
            {
                id: 'demo-1',
                priority: 9840,
                status: 'PENDING',
                reasoning: 'Quote #Q-2041 for $18,200 sent 12 days ago — no reply. High-value deal stalling.',
                draftMessage: "Hi Marcus,\n\nI wanted to check in on quote Q-2041 for $18,200 — it's been about 12 days since we sent it over. If you have any questions on the pricing or scope, I'd love to jump on a 15-minute call this week to walk through it together.\n\nLooking forward to moving this forward.",
                customer: { name: 'Marcus Chen', email: 'marcus@techcorp.io' },
                order: { orderNumber: 'Q-2041', revenue: 18200, status: 'PENDING' },
                createdAt: new Date(Date.now() - 2 * 86400_000),
            },
            {
                id: 'demo-2',
                priority: 6120,
                status: 'PENDING',
                reasoning: 'Invoice #INV-882 for $9,400 overdue by 18 days. Payment risk.',
                draftMessage: "Hi Sarah,\n\nOur records show invoice INV-882 for $9,400 is now 18 days past due. I want to make sure this hasn't gotten lost in your queue — could you confirm the payment status or let me know if there's a preferred timing that works better?\n\nHappy to resend the invoice if helpful.",
                customer: { name: 'Sarah Whitmore', email: 'sarah@globalventures.com' },
                order: { orderNumber: 'INV-882', revenue: 9400, status: 'OVERDUE' },
                createdAt: new Date(Date.now() - 5 * 86400_000),
            },
            {
                id: 'demo-3',
                priority: 3210,
                status: 'PENDING',
                reasoning: 'Order #ORD-1190 for $4,800 pending 8 days. Low urgency but worth a nudge.',
                draftMessage: "Hi Raj,\n\nJust a quick check-in on order ORD-1190 for $4,800 — wanted to make sure everything is on track on your side. Let me know if there's anything we can do to help move things along.",
                customer: { name: 'Raj Patel', email: 'raj@deltasystems.co' },
                order: { orderNumber: 'ORD-1190', revenue: 4800, status: 'PENDING' },
                createdAt: new Date(Date.now() - 1 * 86400_000),
            },
        ];
    }
}
