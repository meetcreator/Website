import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private inventoryService;
    constructor(inventoryService: InventoryService);
    getInventory(req: any): Promise<({
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
    restockAll(req: any): Promise<{
        success: boolean;
        count: number;
    }>;
    updateStock(productId: string, delta: number): Promise<{
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
    createProduct(req: any, body: {
        name: string;
        stock: number;
        minStock: number;
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
    deleteProductPost(productId: string): Promise<{
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
    removeProduct(productId: string): Promise<{
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
}
