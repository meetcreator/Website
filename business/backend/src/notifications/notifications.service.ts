import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) { }

    async getNotifications(tenantId: string) {
        const lowStock = await this.prisma.inventory.findMany({
            where: {
                product: { tenantId },
                quantity: { lt: this.prisma.inventory.fields.minThreshold },
            },
            include: { product: true },
        });

        return lowStock.map(item => ({
            id: `low-stock-${item.id}`,
            type: 'WARNING',
            message: `Low stock alert: ${item.product.name} (${item.quantity} left)`,
            timestamp: new Date(),
        }));
    }
}
