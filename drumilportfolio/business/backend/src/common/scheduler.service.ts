import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FollowUpService } from '../followup/followup.service';
import { ChurnService } from '../churn/churn.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        private prisma: PrismaService,
        private followup: FollowUpService,
        private churn: ChurnService,
    ) { }

    // Every 6 hours — detect stalled orders and generate follow-up tasks
    @Cron(CronExpression.EVERY_6_HOURS)
    async runFollowUpDetection() {
        this.logger.log('Running follow-up detection...');
        const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
        let total = 0;
        for (const { id } of tenants) {
            const { created } = await this.followup.detect(id).catch(() => ({ created: 0 }));
            total += created;
        }
        this.logger.log(`Follow-up detection done. Created ${total} tasks across ${tenants.length} tenants.`);
    }

    // Nightly at 2am — recompute RFM health scores
    @Cron('0 2 * * *')
    async runChurnRecompute() {
        this.logger.log('Running nightly churn score recompute...');
        const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
        let total = 0;
        for (const { id } of tenants) {
            const { scored } = await this.churn.recompute(id).catch(() => ({ scored: 0 }));
            total += scored;
        }
        this.logger.log(`Churn recompute done. Scored ${total} customers across ${tenants.length} tenants.`);
    }
}
