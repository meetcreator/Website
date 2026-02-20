import { Controller, Get, Request, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('kpis')
    @UseGuards(OptionalJwtAuthGuard)
    async getKpis(@Request() req, @Query('range') range?: string) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.analyticsService.getDashboardKpis(tenantId, range);
    }

    @Get('trends')
    @UseGuards(OptionalJwtAuthGuard)
    async getTrends(@Request() req, @Query('range') range?: string) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.analyticsService.getRevenueTrend(tenantId, range);
    }
    @Get('forecasts')
    @UseGuards(OptionalJwtAuthGuard)
    async getForecasts(@Request() req) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.analyticsService.getForecasts(tenantId);
    }

    @Get('insights')
    @UseGuards(OptionalJwtAuthGuard)
    async getInsights(@Request() req) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.analyticsService.getInsights(tenantId);
    }

    @Post('campaign/deploy')
    @UseGuards(JwtAuthGuard)
    async deployCampaign(@Request() req, @Body() body: { name: string; segment: string }) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.analyticsService.deployCampaign(tenantId, body.name, body.segment);
    }
}
