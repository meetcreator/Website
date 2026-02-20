import { Controller, Get, Post, Body, Request, Param, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('inventory')
export class InventoryController {
    constructor(private inventoryService: InventoryService) { }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async getInventory(@Request() req) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.inventoryService.getInventory(tenantId);
    }

    @Post('restock')
    @UseGuards(JwtAuthGuard)
    async restockAll(@Request() req) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.inventoryService.restockAll(tenantId);
    }

    @Post(':productId/update')
    @UseGuards(JwtAuthGuard)
    async updateStock(
        @Param('productId') productId: string,
        @Body('delta') delta: number,
    ) {
        return this.inventoryService.updateStock(productId, delta);
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    async createProduct(
        @Request() req,
        @Body() body: { name: string; stock: number; minStock: number },
    ) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.inventoryService.createProduct(tenantId, body);
    }

    @Post(':productId/delete')
    @UseGuards(JwtAuthGuard)
    async deleteProductPost(@Param('productId') productId: string) {
        return this.inventoryService.deleteProduct(productId);
    }

    @Post(':productId/remove')
    @UseGuards(JwtAuthGuard)
    async removeProduct(@Param('productId') productId: string) {
        return this.inventoryService.deleteProduct(productId);
    }
}
