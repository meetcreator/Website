import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private prisma;
    server: Server;
    constructor(prisma: PrismaService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleCreateItem(client: Socket, payload: {
        name: string;
        value: number;
        tenantId: string;
    }): Promise<void>;
    broadcastUpdate(event: string, data: any): void;
}
