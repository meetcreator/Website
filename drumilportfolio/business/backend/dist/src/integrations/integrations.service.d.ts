import { PrismaService } from '../prisma/prisma.service';
import { IntegrationType } from '@prisma/client';
import { ShopifyService } from './shopify/shopify.service';
import { AmazonService } from './amazon/amazon.service';
export declare class IntegrationsService {
    private prisma;
    private shopify;
    private amazon;
    constructor(prisma: PrismaService, shopify: ShopifyService, amazon: AmazonService);
    getIntegrations(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        type: import(".prisma/client").$Enums.IntegrationType;
        lastSyncAt: Date | null;
    }[]>;
    connectIntegration(tenantId: string, type: IntegrationType, credentials: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: string;
        type: import(".prisma/client").$Enums.IntegrationType;
        credentials: string;
        lastSyncAt: Date | null;
    }>;
    removeIntegration(tenantId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: string;
        type: import(".prisma/client").$Enums.IntegrationType;
        credentials: string;
        lastSyncAt: Date | null;
    }>;
    syncAll(tenantId: string): Promise<any[]>;
}
