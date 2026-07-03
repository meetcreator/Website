import { Controller, Get, Post, Param, Request, UseGuards } from '@nestjs/common';
import { FollowUpService } from './followup.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('followup')
export class FollowUpController {
    constructor(private followup: FollowUpService) { }

    @Get('queue')
    @UseGuards(OptionalJwtAuthGuard)
    async getQueue(@Request() req) {
        const tenantId = req.user?.tenantId || 'demo';
        return this.followup.getQueue(tenantId);
    }

    @Post('detect')
    @UseGuards(JwtAuthGuard)
    async detect(@Request() req) {
        return this.followup.detect(req.user.tenantId);
    }

    @Post(':id/send')
    @UseGuards(JwtAuthGuard)
    async send(@Param('id') id: string, @Request() req) {
        return this.followup.send(req.user.tenantId, id);
    }

    @Post(':id/dismiss')
    @UseGuards(JwtAuthGuard)
    async dismiss(@Param('id') id: string, @Request() req) {
        return this.followup.dismiss(req.user.tenantId, id);
    }
}
