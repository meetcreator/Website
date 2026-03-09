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
const generative_ai_1 = require("@google/generative-ai");
let AIService = class AIService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async chat(tenantId, message) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (tenantId === 'demo') {
            const demoContext = `
You are ARCH-AI, an expert Business Intelligence assistant for a demo business analytics platform.
You are currently in DEMO MODE, showing simulated data.

Demo Business Snapshot:
- Monthly Revenue: $842,900 (up 14.2% from last period)
- ARR Breakdown: Enterprise 68%, SMB 22%, Starter 10%
- Operating Profit: $124,500 this month (+5.2%)
- Burn Rate: -$12,400/month
- Inventory: 2 SKUs critically low — 'Executive Suite A1' at 12 units (min: 20), 'Premium Package B3' at 8 units (min: 15)
- Churn Risk: 14.2% — 'At Risk' cohort shows elevated cart abandonment (32%)
- Top Products: Executive Suite A1, Premium Package B3, Starter Kit C2
- Total Orders: 1,247 this period
- New Clients: 38 this month
- Avg Order Value: $675

Your job is to give sharp, data-driven, realistic answers using the above context.
Be concise but insightful. Use relevant emojis sparingly. Do not say you are an AI language model — you are ARCH-AI, the business intelligence engine.
`.trim();
            if (apiKey) {
                try {
                    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                    const result = await model.generateContent([
                        { text: demoContext },
                        { text: `User question: ${message}` }
                    ]);
                    return result.response.text();
                }
                catch (e) {
                    console.error('Gemini Demo Error:', e);
                }
            }
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes('revenue') || lowerMsg.includes('sales'))
                return "📊 [Demo] Monthly revenue is $842.9k — up 14.2%. Enterprise tier contributes 68% of ARR.";
            if (lowerMsg.includes('stock') || lowerMsg.includes('inventory'))
                return "📦 [Demo] 2 SKUs critically low: 'Executive Suite A1' at 12 units (min 20).";
            if (lowerMsg.includes('profit') || lowerMsg.includes('burn'))
                return "💰 [Demo] Operating profit: $124.5k this month (+5.2%). Burn rate: -$12.4k/mo.";
            if (lowerMsg.includes('churn') || lowerMsg.includes('risk'))
                return "⚠️ [Demo] Churn risk at 14.2%. 'At Risk' cohort shows 32% cart abandonment.";
            return "🤖 I'm ARCH-AI (Demo Mode). Ask me about revenue, inventory, profit, or churn risk.";
        }
        try {
            const [orders, inventory, products, clients] = await Promise.all([
                this.prisma.order.findMany({ where: { tenantId } }),
                this.prisma.inventory.findMany({
                    where: { product: { tenantId } },
                    include: { product: true }
                }),
                this.prisma.product.findMany({
                    where: { tenantId },
                    include: { orders: true },
                    take: 10
                }),
                this.prisma.strategicClient.findMany({ where: { tenantId }, take: 20 }).catch(() => [])
            ]);
            const totalRevenue = orders.reduce((sum, o) => sum + (o.revenue || 0), 0);
            const totalProfit = orders.reduce((sum, o) => sum + (o.profit || 0), 0);
            const orderCount = orders.length;
            const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
            const lowStockItems = inventory.filter((inv) => {
                const minThreshold = inv.minThreshold ?? 0;
                return inv.quantity < minThreshold;
            });
            const topProductsText = products.slice(0, 5)
                .map((p, i) => `${i + 1}. ${p.name} — ${p.orders?.length ?? 0} orders`)
                .join('\n') || 'No product data yet';
            const lowStockText = lowStockItems.length > 0
                ? lowStockItems.map((inv) => `- ${inv.product?.name ?? 'Unknown'}: ${inv.quantity} units (min: ${inv.minThreshold})`).join('\n')
                : 'All items are sufficiently stocked';
            const systemPrompt = `
You are ARCH-AI, an expert Business Intelligence assistant embedded in a live business analytics dashboard.
You have access to the following REAL, LIVE business data for this tenant:

📊 FINANCIAL OVERVIEW:
- Total Revenue: $${totalRevenue.toLocaleString()}
- Total Profit: $${totalProfit.toLocaleString()}
- Total Orders: ${orderCount}
- Average Order Value: $${avgOrderValue.toFixed(2)}
- Profit Margin: ${totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%

📦 INVENTORY STATUS (${inventory.length} SKUs tracked):
Low Stock / Critical Items:
${lowStockText}

🏆 TOP PRODUCTS BY ORDERS:
${topProductsText}

👥 CLIENTS: ${clients.length > 0 ? `${clients.length} active clients on record` : 'No client data available'}

INSTRUCTIONS:
- Answer the user's question accurately using the real data above.
- Be concise, sharp, and professional — like a senior business analyst.
- Provide actionable insights when relevant (e.g., "consider restocking X").
- Use numbers from the data — do not make up figures.
- Use relevant emojis sparingly for clarity.
- Never say "I don't have access to" — you DO have the data above.
- If asked about something not in the data (e.g., competitor analysis), give a general best-practice answer but note it's advisory.
- Do not say you are an AI language model — you are ARCH-AI, the business intelligence engine.
`.trim();
            if (apiKey) {
                const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const result = await model.generateContent([
                    { text: systemPrompt },
                    { text: `User question: ${message}` }
                ]);
                return result.response.text();
            }
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes('revenue') || lowerMsg.includes('sales')) {
                return `📊 Your total revenue is $${totalRevenue.toLocaleString()} from ${orderCount} orders. Average order value: $${avgOrderValue.toFixed(2)}.`;
            }
            if (lowerMsg.includes('profit') || lowerMsg.includes('margin')) {
                const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';
                return `💰 Total profit: $${totalProfit.toLocaleString()} (${margin}% margin).`;
            }
            if (lowerMsg.includes('stock') || lowerMsg.includes('inventory')) {
                if (lowStockItems.length > 0) {
                    return `⚠️ ${lowStockItems.length} item(s) below safety threshold:\n${lowStockText}`;
                }
                return `✅ All ${inventory.length} inventory items are above minimum thresholds.`;
            }
            if (lowerMsg.includes('product') || lowerMsg.includes('best') || lowerMsg.includes('top')) {
                return `🏆 Top products:\n${topProductsText}`;
            }
            return `I'm ARCH-AI. Revenue: $${totalRevenue.toLocaleString()} | Orders: ${orderCount} | Low stock items: ${lowStockItems.length}. Ask me about revenue, profit, inventory, or products.`;
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