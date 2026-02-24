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
var ShopifyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ShopifyService = ShopifyService_1 = class ShopifyService {
    prisma;
    logger = new common_1.Logger(ShopifyService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncOrders(tenantId, credentials) {
        this.logger.log(`Syncing Shopify orders for tenant: ${tenantId}`);
        const mockOrders = [
            {
                id: `shopify_${Date.now()}`,
                orderNumber: `SHP-${Math.floor(Math.random() * 9000 + 1000)}`,
                customerName: 'Shopify Customer',
                totalRevenue: 150.0,
                items: [
                    { sku: 'IC-900', quantity: 2, price: 75.0, cost: 40.0 }
                ]
            }
        ];
        let createdCount = 0;
        for (const orderData of mockOrders) {
            let customer = await this.prisma.customer.findFirst({
                where: { name: orderData.customerName, tenantId }
            });
            if (!customer) {
                customer = await this.prisma.customer.create({
                    data: { name: orderData.customerName, tenantId }
                });
            }
            const order = await this.prisma.order.create({
                data: {
                    orderNumber: orderData.orderNumber,
                    customerId: customer.id,
                    totalAmount: orderData.totalRevenue,
                    totalCost: orderData.items.reduce((sum, i) => sum + (i.cost * i.quantity), 0),
                    revenue: orderData.totalRevenue,
                    profit: orderData.totalRevenue - orderData.items.reduce((sum, i) => sum + (i.cost * i.quantity), 0),
                    tenantId,
                    items: {
                        create: await Promise.all(orderData.items.map(async (item) => {
                            const product = await this.prisma.product.findUnique({
                                where: { sku_tenantId: { sku: item.sku, tenantId } }
                            });
                            if (product) {
                                await this.prisma.inventory.update({
                                    where: { productId: product.id },
                                    data: { quantity: { decrement: item.quantity } }
                                });
                            }
                            return {
                                productId: product?.id || 'unknown',
                                quantity: item.quantity,
                                price: item.price,
                                cost: item.cost
                            };
                        }))
                    }
                }
            });
            createdCount++;
        }
        return { success: true, count: createdCount };
    }
};
exports.ShopifyService = ShopifyService;
exports.ShopifyService = ShopifyService = ShopifyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShopifyService);
//# sourceMappingURL=shopify.service.js.map