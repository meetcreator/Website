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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let ClientService = class ClientService {
    prisma;
    realtime;
    constructor(prisma, realtime) {
        this.prisma = prisma;
        this.realtime = realtime;
    }
    async getClients(tenantId) {
        if (tenantId === 'demo') {
            return [
                { name: 'Acme Corp (Demo)', value: 450000, growth: '+12%' },
                { name: 'Globex (Demo)', value: 320000, growth: '+8%' },
                { name: 'Soylent Corp (Demo)', value: 180000, growth: '-2%' },
            ];
        }
        return await this.prisma.strategicClient.findMany({
            where: { tenantId },
            orderBy: { value: 'desc' },
        });
    }
    async createClient(tenantId, data) {
        if (tenantId === 'demo')
            return { ...data, id: 'demo-id' };
        const client = await this.prisma.strategicClient.create({
            data: {
                ...data,
                tenantId,
            },
        });
        this.realtime.broadcastUpdate('client.updated', client);
        return client;
    }
    async deleteClient(tenantId, name) {
        if (tenantId === 'demo')
            return { success: true };
        const deleted = await this.prisma.strategicClient.deleteMany({
            where: { name, tenantId },
        });
        this.realtime.broadcastUpdate('client.deleted', { name });
        return deleted;
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_gateway_1.RealtimeGateway])
], ClientService);
//# sourceMappingURL=client.service.js.map