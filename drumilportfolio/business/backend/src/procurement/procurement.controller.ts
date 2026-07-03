import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('procurement')
export class ProcurementController {
    constructor(private procurement: ProcurementService) { }

    @Get('suppliers')
    @UseGuards(OptionalJwtAuthGuard)
    async getSuppliers(@Request() req) {
        return this.procurement.getSuppliers(req.user?.tenantId || 'demo');
    }

    @Post('suppliers')
    @UseGuards(JwtAuthGuard)
    async createSupplier(@Request() req, @Body() body: any) {
        return this.procurement.createSupplier(req.user.tenantId, body);
    }

    @Get('reorder-alerts')
    @UseGuards(OptionalJwtAuthGuard)
    async getReorderAlerts(@Request() req) {
        return this.procurement.getReorderAlerts(req.user?.tenantId || 'demo');
    }

    @Get('price-deviations')
    @UseGuards(OptionalJwtAuthGuard)
    async getPriceDeviations(@Request() req) {
        return this.procurement.getPriceDeviations(req.user?.tenantId || 'demo');
    }

    @Get('purchase-orders')
    @UseGuards(OptionalJwtAuthGuard)
    async getPurchaseOrders(@Request() req) {
        return this.procurement.getPurchaseOrders(req.user?.tenantId || 'demo');
    }

    @Post('purchase-orders/draft')
    @UseGuards(JwtAuthGuard)
    async draftPo(@Request() req, @Body() body: any) {
        return this.procurement.draftPurchaseOrder(req.user.tenantId, body);
    }

    @Post('purchase-orders/:id/approve')
    @UseGuards(JwtAuthGuard)
    async approvePo(@Param('id') id: string, @Request() req) {
        return this.procurement.approvePurchaseOrder(req.user.tenantId, id, req.user.email);
    }
}
