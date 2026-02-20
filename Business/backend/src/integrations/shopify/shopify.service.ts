import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShopifyService {
    private readonly logger = new Logger(ShopifyService.name);

    constructor(private prisma: PrismaService) { }

    async syncOrders(tenantId: string, credentials: any) {
        this.logger.log(`Syncing Shopify orders for tenant: ${tenantId}`);

        // In a real implementation:
        // 1. Authenticate with Shopify using credentials.shop and credentials.accessToken
        // 2. Fetch orders since lastSyncAt from Shopify Admin API
        // 3. Map Shopify orders to our internal Order and Product models

        // Mocking the fetch process for demonstration
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
            // Find or create customer
            let customer = await this.prisma.customer.findFirst({
                where: { name: orderData.customerName, tenantId }
            });

            if (!customer) {
                customer = await this.prisma.customer.create({
                    data: { name: orderData.customerName, tenantId }
                });
            }

            // Create Order
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

                            // Update inventory if product exists
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
