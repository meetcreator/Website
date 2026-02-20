import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class InventoryService {
    constructor(
        private prisma: PrismaService,
        private realtime: RealtimeGateway
    ) { }

    async getInventory(tenantId: string) {
        if (tenantId === 'demo') {
            return [
                { id: '1', quantity: 15, minThreshold: 10, product: { name: 'Industrial Controller (Demo)', sku: 'IC-900' } },
                { id: '2', quantity: 4, minThreshold: 8, product: { name: 'Sensor Array (Demo)', sku: 'SA-202' } },
                { id: '3', quantity: 25, minThreshold: 15, product: { name: 'AI Module (Demo)', sku: 'AM-500' } },
            ];
        }
        return await this.prisma.inventory.findMany({
            where: { product: { tenantId } },
            include: { product: true },
        });
    }

    async updateStock(productId: string, quantityDelta: number) {
        const inventory = await this.prisma.inventory.findUnique({
            where: { productId },
            include: { product: true },
        });

        if (!inventory) throw new BadRequestException('Product inventory not found');

        const newQuantity = inventory.quantity + quantityDelta;
        if (newQuantity < 0) throw new BadRequestException('Insufficient stock');

        const updated = await this.prisma.inventory.update({
            where: { productId },
            data: { quantity: newQuantity },
            include: { product: true },
        });

        this.realtime.broadcastUpdate('inventory.updated', updated);
        return updated;
    }

    async createProduct(tenantId: string, data: { name: string; stock: number; minStock: number; sku?: string }) {
        const sku = data.sku || `PR-${Math.floor(Math.random() * 9000 + 1000)}`;
        const product = await this.prisma.product.create({
            data: {
                name: data.name,
                sku,
                price: 0,
                cost: 0,
                tenantId,
                inventory: {
                    create: {
                        quantity: data.stock,
                        minThreshold: data.minStock,
                    },
                },
            },
            include: { inventory: true },
        });
        this.realtime.broadcastUpdate('inventory.updated', product);
        return product;
    }

    async deleteProduct(productId: string) {
        const deleted = await this.prisma.product.delete({
            where: { id: productId },
        });
        this.realtime.broadcastUpdate('inventory.deleted', { id: productId });
        return deleted;
    }

    async restockAll(tenantId: string) {
        const lowStockItems = await this.prisma.inventory.findMany({
            where: {
                product: { tenantId },
                quantity: { lt: this.prisma.inventory.fields.minThreshold },
            },
        });

        for (const item of lowStockItems) {
            await this.prisma.inventory.update({
                where: { id: item.id },
                data: { quantity: item.minThreshold + 50 },
            });
        }

        this.realtime.broadcastUpdate('inventory.bulkUpdate', { tenantId });
        return { success: true, count: lowStockItems.length };
    }
}

