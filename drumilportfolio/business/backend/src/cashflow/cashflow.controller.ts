import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { CashFlowService } from './cashflow.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('cashflow')
export class CashFlowController {
    constructor(private cashflow: CashFlowService) { }

    @Get('projections')
    @UseGuards(OptionalJwtAuthGuard)
    async getProjections(@Request() req) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.cashflow.getProjections(tenantId);
    }

    @Get('anomalies')
    @UseGuards(OptionalJwtAuthGuard)
    async getAnomalies(@Request() req) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.cashflow.getAnomalies(tenantId);
    }
}
