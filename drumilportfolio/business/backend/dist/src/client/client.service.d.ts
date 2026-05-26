import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
export declare class ClientService {
    private prisma;
    private realtime;
    constructor(prisma: PrismaService, realtime: RealtimeGateway);
    getClients(tenantId: string): Promise<any>;
    createClient(tenantId: string, data: {
        name: string;
        value: number;
        growth: string;
    }): Promise<any>;
    deleteClient(tenantId: string, name: string): Promise<any>;
}
