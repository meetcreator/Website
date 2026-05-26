import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AmazonService {
    private readonly logger = new Logger(AmazonService.name);

    constructor(private prisma: PrismaService) { }

    async syncOrders(tenantId: string, credentials: any) {
        this.logger.log(`Syncing Amazon orders for tenant: ${tenantId}`);

        // In a real implementation:
        // 1. Authenticate with Amazon SP-API using credentials.refreshToken, etc.
        // 2. Fetch orders using the Orders API
        // 3. Map Amazon orders to our internal Order and Product models

        // Mocking the fetch process
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
}
