import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuditLogService } from './audit-log.service';
import { AuditController } from './audit.controller';
import { SchedulerService } from './scheduler.service';
import { FollowUpModule } from '../followup/followup.module';
import { ChurnModule } from '../churn/churn.module';

@Module({
    imports: [ScheduleModule.forRoot(), FollowUpModule, ChurnModule],
    providers: [AuditLogService, SchedulerService],
    controllers: [AuditController],
    exports: [AuditLogService],
})
export class CommonModule { }
