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
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../prisma/prisma.service");
let RealtimeGateway = class RealtimeGateway {
    prisma;
    server;
    constructor(prisma) {
        this.prisma = prisma;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleCreateItem(client, payload) {
        console.log('Received createItem:', payload);
        try {
            const newItem = await this.prisma.strategicClient.create({
                data: {
                    name: payload.name,
                    value: payload.value || 1000,
                    growth: '+5%',
                    tenantId: payload.tenantId,
                }
            });
            this.server.emit('dataUpdated', {
                name: newItem.name,
                value: newItem.value,
                id: newItem.id
            });
        }
        catch (error) {
            console.error('Error creating item:', error);
            client.emit('error', { message: 'Failed to create item' });
        }
    }
    broadcastUpdate(event, data) {
        this.server.emit(event, data);
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createItem'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleCreateItem", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map