import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class ClientService {
    constructor(
        private prisma: PrismaService,
        private realtime: RealtimeGateway
    ) { }

    async getClients(tenantId: string) {
        if (tenantId === 'demo') {
            return [
                { name: 'Acme Corp (Demo)', value: 450000, growth: '+12%' },
                { name: 'Globex (Demo)', value: 320000, growth: '+8%' },
                { name: 'Soylent Corp (Demo)', value: 180000, growth: '-2%' },
            ];
        }
        return await (this.prisma as any).strategicClient.findMany({
            where: { tenantId },
            orderBy: { value: 'desc' },
        });
    }

    async createClient(tenantId: string, data: { name: string; value: number; growth: string }) {
        if (tenantId === 'demo') return { ...data, id: 'demo-id' };
        const client = await (this.prisma as any).strategicClient.create({
            data: {
                ...data,
                tenantId,
            },
        });
        this.realtime.broadcastUpdate('client.updated', client);
        return client;
    }

    async deleteClient(tenantId: string, name: string) {
        if (tenantId === 'demo') return { success: true };
        const deleted = await (this.prisma as any).strategicClient.deleteMany({
            where: { name, tenantId },
        });
        this.realtime.broadcastUpdate('client.deleted', { name });
        return deleted;
    }
}
