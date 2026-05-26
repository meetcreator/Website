import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotifications(tenantId: string): Promise<{
        id: string;
        type: string;
        message: string;
        timestamp: Date;
    }[]>;
}
