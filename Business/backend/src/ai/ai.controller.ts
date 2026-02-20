import { Controller, Post, Body, Request, Get, UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
    constructor(private aiService: AIService) { }

    @Post('chat')
    async chat(@Request() req: any, @Body() body: { message: string }) {
        // Use tenantId from JWT if available, otherwise use 'demo'
        const tenantId = req.user?.tenantId || 'demo';
        const response = await this.aiService.chat(tenantId, body.message);
        return { response };
    }
}
