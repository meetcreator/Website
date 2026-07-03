import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type OutcomeType = 'RESOLVED' | 'IGNORED' | 'WRONG';

@Injectable()
export class AuditLogService {
    constructor(private prisma: PrismaService) { }

    async log(data: {
        tenantId: string;
        module: string;
        action: string;
        entityType?: string;
        entityId?: string;
        reasoning?: string;
        userId?: string;
    }) {
        return this.prisma.auditLog.create({ data });
    }

    async recordOutcome(id: string, outcome: OutcomeType, resolvedById?: string) {
        return this.prisma.auditLog.update({
            where: { id },
            data: { outcome, resolvedAt: new Date(), resolvedById },
        });
    }

    async getByTenant(tenantId: string, module?: string, limit = 50) {
        return this.prisma.auditLog.findMany({
            where: { tenantId, ...(module ? { module } : {}) },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    // ROI summary: action counts + resolution rates per module
    async getRoiSummary(tenantId: string) {
        const logs = await this.prisma.auditLog.findMany({
            where: { tenantId },
            select: { module: true, action: true, outcome: true },
        });

        const byModule: Record<string, { total: number; resolved: number; ignored: number; wrong: number }> = {};
        for (const log of logs) {
            if (!byModule[log.module]) byModule[log.module] = { total: 0, resolved: 0, ignored: 0, wrong: 0 };
            byModule[log.module].total++;
            if (log.outcome === 'RESOLVED') byModule[log.module].resolved++;
            if (log.outcome === 'IGNORED') byModule[log.module].ignored++;
            if (log.outcome === 'WRONG') byModule[log.module].wrong++;
        }

        return Object.entries(byModule).map(([module, stats]) => ({
            module,
            ...stats,
            resolutionRate: stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : '0.0',
        }));
    }
}
