import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { DigestService } from './digest.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('digest')
export class DigestController {
    constructor(private digest: DigestService) { }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async getDigest(@Request() req) {
        return this.digest.generate(req.user?.tenantId || 'demo');
    }
}
