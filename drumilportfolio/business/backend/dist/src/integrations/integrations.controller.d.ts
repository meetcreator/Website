import { IntegrationsService } from './integrations.service';
import { IntegrationType } from '@prisma/client';
export declare class IntegrationsController {
    private readonly integrationsService;
    constructor(integrationsService: IntegrationsService);
    getIntegrations(req: any): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        type: import(".prisma/client").$Enums.IntegrationType;
        lastSyncAt: Date | null;
    }[]>;
    connectIntegration(req: any, body: {
        type: IntegrationType;
        credentials: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: string;
        type: import(".prisma/client").$Enums.IntegrationType;
        credentials: string;
        lastSyncAt: Date | null;
    }>;
    removeIntegration(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: string;
        type: import(".prisma/client").$Enums.IntegrationType;
        credentials: string;
        lastSyncAt: Date | null;
    }>;
    syncAll(req: any): Promise<any[]>;
}
