
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
    cors: {
        origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
        credentials: true,
    },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private prisma: PrismaService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('createItem')
    async handleCreateItem(client: Socket, payload: { name: string, value: number, tenantId: string }) {
        console.log('Received createItem:', payload);
        try {
            // Persist to database
            const newItem = await this.prisma.strategicClient.create({
                data: {
                    name: payload.name,
                    value: payload.value || 1000,
                    growth: '+5%', // Default growth
                    tenantId: payload.tenantId, // Must ensure tenantId is valid
                }
            });

            // Broadcast update to all clients
            this.server.emit('dataUpdated', {
                name: newItem.name,
                value: newItem.value,
                id: newItem.id
            });
        } catch (error) {
            console.error('Error creating item:', error);
            client.emit('error', { message: 'Failed to create item' });
        }
    }

    // Method to broadcast updates to all connected clients
    broadcastUpdate(event: string, data: any) {
        this.server.emit(event, data);
    }
}
