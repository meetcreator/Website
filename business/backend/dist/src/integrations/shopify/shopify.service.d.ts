import { PrismaService } from '../../prisma/prisma.service';
export declare class ShopifyService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    syncOrders(tenantId: string, credentials: any): Promise<{
        success: boolean;
        count: number;
    }>;
}
