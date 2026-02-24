import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AIService {
    constructor(private prisma: PrismaService) { }

    async chat(tenantId: string, message: string) {
        const lowerMsg = message.toLowerCase();

        // 1. Handle Demo Mode (Guest User)
        if (tenantId === 'demo') {
            if (lowerMsg.includes('revenue') || lowerMsg.includes('sales')) {
                return "📊 [Demo] Your monthly revenue is approximately $842.9k — up 14.2% from last period. Enterprise tier contributes 68% of ARR.";
            }
            if (lowerMsg.includes('stock') || lowerMsg.includes('inventory')) {
                return "📦 [Demo] Inventory check: 2 SKUs are critically low. 'Executive Suite A1' is at 12 units vs 20 minimum.";
            }
            if (lowerMsg.includes('profit') || lowerMsg.includes('burn')) {
                return "💰 [Demo] Operating profit stands at $124.5k this month — a 5.2% increase. Burn rate is controlled at -$12.4k/mo.";
            }
            if (lowerMsg.includes('churn') || lowerMsg.includes('risk')) {
                return "⚠️ [Demo] Churn risk is currently at 14.2%. The 'At Risk' cohort shows elevated cart abandonment.";
            }
            return "🤖 I'm ARCH-AI (Demo Mode). I can analyze simulated revenue trends, inventory levels, and profit. Ask me about 'revenue' or 'stock'.";
        }

        try {
            // 2. Fetch real context for authenticated users
            const orders = await this.prisma.order.findMany({ where: { tenantId } });
            const totalRevenue = orders.reduce((sum, o) => sum + o.revenue, 0);
            const totalProfit = orders.reduce((sum, o) => sum + o.profit, 0);
            const lowStockCount = await this.prisma.inventory.count({
                where: { product: { tenantId }, quantity: { lt: this.prisma.inventory.fields.minThreshold } }
            });
            const orderCount = orders.length;
            const topProducts = await this.prisma.product.findMany({
                where: { tenantId },
                include: { orders: true },
                take: 3
            });

            // 3. Process User Intent
            if (lowerMsg.includes('revenue') || lowerMsg.includes('sales')) {
                return `Your total revenue is $${totalRevenue.toLocaleString()}. You have processed ${orderCount} orders via the platform.`;
            }

            if (lowerMsg.includes('stock') || lowerMsg.includes('inventory')) {
                if (lowStockCount > 0) {
                    return `Inventory Alert: You have ${lowStockCount} items below the safety threshold. I recommend restocking immediately.`;
                }
                return `Inventory levels are healthy. All products are above the minimum threshold.`;
            }

            if (lowerMsg.includes('profit') || lowerMsg.includes('margin')) {
                return `Your total profit is currently $${totalProfit.toLocaleString()}. This represents the net value across all completed orders.`;
            }

            if (lowerMsg.includes('best') || lowerMsg.includes('product')) {
                const bestSeller = topProducts.sort((a, b) => b.orders.length - a.orders.length)[0];
                if (bestSeller) {
                    return `Your top performing product is '${bestSeller.name}' with ${bestSeller.orders.length} orders.`;
                }
                return `Not enough data to determine best selling products yet.`;
            }

            // Default
            return `I'm ARCH-AI. Your business has generated $${totalRevenue.toLocaleString()} revenue from ${orderCount} orders. Ask me about revenue, inventory, profit, or best sellers.`;

        } catch (e) {
            console.error('AI Service Error:', e);
            return "I'm having trouble accessing your live business data right now. Please try again later.";
        }
    }
}
