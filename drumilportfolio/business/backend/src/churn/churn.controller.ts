import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ChurnService } from './churn.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('churn')
export class ChurnController {
    constructor(private churn: ChurnService) { }

    @Get('scores')
    @UseGuards(OptionalJwtAuthGuard)
    async getScores(@Request() req) {
        return this.churn.getScores(req.user?.tenantId || 'demo');
    }

    @Post('recompute')
    @UseGuards(JwtAuthGuard)
    async recompute(@Request() req) {
        return this.churn.recompute(req.user.tenantId);
    }
}
