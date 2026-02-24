import { Controller, Get, Post, Body, Request, Query, Delete, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('clients')
export class ClientController {
    constructor(private clientService: ClientService) { }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async getClients(@Request() req) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.clientService.getClients(tenantId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createClient(
        @Request() req,
        @Body() body: { name: string; value: number; growth: string },
    ) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.clientService.createClient(tenantId, body);
    }

    @Post('delete')
    @UseGuards(JwtAuthGuard)
    async deleteClient(
        @Request() req,
        @Body('name') name: string,
    ) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.clientService.deleteClient(tenantId, name);
    }
}
