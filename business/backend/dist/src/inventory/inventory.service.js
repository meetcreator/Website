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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let InventoryService = class InventoryService {
    prisma;
    realtime;
    constructor(prisma, realtime) {
        this.prisma = prisma;
        this.realtime = realtime;
    }
    async getInventory(tenantId) {
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
    async updateStock(productId, quantityDelta) {
        const inventory = await this.prisma.inventory.findUnique({
            where: { productId },
            include: { product: true },
        });
        if (!inventory)
            throw new common_1.BadRequestException('Product inventory not found');
        const newQuantity = inventory.quantity + quantityDelta;
        if (newQuantity < 0)
            throw new common_1.BadRequestException('Insufficient stock');
        const updated = await this.prisma.inventory.update({
            where: { productId },
            data: { quantity: newQuantity },
            include: { product: true },
        });
        this.realtime.broadcastUpdate('inventory.updated', updated);
        return updated;
    }
    async createProduct(tenantId, data) {
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
    async deleteProduct(productId) {
        const deleted = await this.prisma.product.delete({
            where: { id: productId },
        });
        this.realtime.broadcastUpdate('inventory.deleted', { id: productId });
        return deleted;
    }
    async restockAll(tenantId) {
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_gateway_1.RealtimeGateway])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map