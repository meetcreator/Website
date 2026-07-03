import { Controller, Get, Post, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit')
export class AuditController {
    constructor(private audit: AuditLogService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    getLogs(@Request() req, @Query('module') module?: string, @Query('limit') limit?: string) {
        return this.audit.getByTenant(req.user.tenantId, module, limit ? parseInt(limit) : 50);
    }

    @Get('roi')
    @UseGuards(JwtAuthGuard)
    getRoi(@Request() req) {
        return this.audit.getRoiSummary(req.user.tenantId);
    }

    @Post(':id/outcome')
    @UseGuards(JwtAuthGuard)
    recordOutcome(@Param('id') id: string, @Body() body: { outcome: 'RESOLVED' | 'IGNORED' | 'WRONG' }, @Request() req) {
        return this.audit.recordOutcome(id, body.outcome, req.user.email);
    }
}
