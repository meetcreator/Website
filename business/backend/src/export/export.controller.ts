import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
    constructor(private exportService: ExportService) { }

    @Get('csv')
    async exportCsv(@Request() req, @Res() res: Response) {
        const csv = await this.exportService.exportTransactionsCsv(req.user.tenantId);
        res.header('Content-Type', 'text/csv');
        res.attachment('export.csv');
        return res.send(csv);
    }
}
