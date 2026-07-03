import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('settings')
export class SettingsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async get(@Request() req) {
        if (!req.user) {
            return {
                currentBalance: 120000,
                autoProcurement: false,
                autoFollowUp: false,
                followUpStaleDays: 7,
                priceDeviationThreshold: 10,
                churnRiskThreshold: 40,
            };
        }
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: req.user.tenantId },
            select: { settings: true },
        });
        return tenant?.settings || {};
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async update(@Request() req, @Body() body: Record<string, any>) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: req.user.tenantId },
            select: { settings: true },
        });
        const current = (tenant?.settings as Record<string, any>) || {};
        const merged = { ...current, ...body };

        await this.prisma.tenant.update({
            where: { id: req.user.tenantId },
            data: { settings: merged },
        });
        return merged;
    }
}
