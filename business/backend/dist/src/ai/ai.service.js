"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AIService = class AIService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async chat(tenantId, message) {
        const lowerMsg = message.toLowerCase();
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
            return `I'm ARCH-AI. Your business has generated $${totalRevenue.toLocaleString()} revenue from ${orderCount} orders. Ask me about revenue, inventory, profit, or best sellers.`;
        }
        catch (e) {
            console.error('AI Service Error:', e);
            return "I'm having trouble accessing your live business data right now. Please try again later.";
        }
    }
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AIService);
//# sourceMappingURL=ai.service.js.map