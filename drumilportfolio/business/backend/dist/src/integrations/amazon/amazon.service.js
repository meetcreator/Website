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
var AmazonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AmazonService = AmazonService_1 = class AmazonService {
    prisma;
    logger = new common_1.Logger(AmazonService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncOrders(tenantId, credentials) {
        this.logger.log(`Syncing Amazon orders for tenant: ${tenantId}`);
        const mockOrders = [
            {
                id: `amazon_${Date.now()}`,
                orderNumber: `AMZ-${Math.floor(Math.random() * 9000 + 1000)}`,
                customerName: 'Amazon Customer',
                totalRevenue: 200.0,
                items: [
                    { sku: 'SA-202', quantity: 1, price: 200.0, cost: 120.0 }
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
            await this.prisma.order.create({
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
exports.AmazonService = AmazonService;
exports.AmazonService = AmazonService = AmazonService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AmazonService);
//# sourceMappingURL=amazon.service.js.map