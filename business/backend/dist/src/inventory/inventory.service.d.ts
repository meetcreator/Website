import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
export declare class InventoryService {
    private prisma;
    private realtime;
    constructor(prisma: PrismaService, realtime: RealtimeGateway);
    getInventory(tenantId: string): Promise<({
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            sku: string;
            category: string | null;
            price: number;
            cost: number;
        };
    } & {
        id: string;
        updatedAt: Date;
        quantity: number;
        minThreshold: number;
        warehouseId: string | null;
        productId: string;
    })[] | {
        id: string;
        quantity: number;
        minThreshold: number;
        product: {
            name: string;
            sku: string;
        };
    }[]>;
    updateStock(productId: string, quantityDelta: number): Promise<{
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            sku: string;
            category: string | null;
            price: number;
            cost: number;
        };
    } & {
        id: string;
        updatedAt: Date;
        quantity: number;
        minThreshold: number;
        warehouseId: string | null;
        productId: string;
    }>;
    createProduct(tenantId: string, data: {
        name: string;
        stock: number;
        minStock: number;
        sku?: string;
    }): Promise<{
        inventory: {
            id: string;
            updatedAt: Date;
            quantity: number;
            minThreshold: number;
            warehouseId: string | null;
            productId: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        sku: string;
        category: string | null;
        price: number;
        cost: number;
    }>;
    deleteProduct(productId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        sku: string;
        category: string | null;
        price: number;
        cost: number;
    }>;
    restockAll(tenantId: string): Promise<{
        success: boolean;
        count: number;
    }>;
}
