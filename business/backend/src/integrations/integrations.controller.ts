import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IntegrationType } from '@prisma/client';

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
    constructor(private readonly integrationsService: IntegrationsService) { }

    @Get()
    async getIntegrations(@Request() req) {
        return this.integrationsService.getIntegrations(req.user.tenantId);
    }

    @Post('connect')
    async connectIntegration(@Request() req, @Body() body: { type: IntegrationType; credentials: any }) {
        return this.integrationsService.connectIntegration(req.user.tenantId, body.type, body.credentials);
    }

    @Delete(':id')
    async removeIntegration(@Request() req, @Param('id') id: string) {
        return this.integrationsService.removeIntegration(req.user.tenantId, id);
    }

    @Post('sync')
    async syncAll(@Request() req) {
        return this.integrationsService.syncAll(req.user.tenantId);
    }
}
