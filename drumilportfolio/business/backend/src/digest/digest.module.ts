import { Module } from '@nestjs/common';
import { DigestService } from './digest.service';
import { DigestController } from './digest.controller';
import { CommonModule } from '../common/common.module';
import { CashFlowModule } from '../cashflow/cashflow.module';
import { FollowUpModule } from '../followup/followup.module';
import { ChurnModule } from '../churn/churn.module';
import { ProcurementModule } from '../procurement/procurement.module';

@Module({
    imports: [CommonModule, CashFlowModule, FollowUpModule, ChurnModule, ProcurementModule],
    providers: [DigestService],
    controllers: [DigestController],
    exports: [DigestService],
})
export class DigestModule { }
