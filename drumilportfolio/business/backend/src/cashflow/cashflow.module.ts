import { Module } from '@nestjs/common';
import { CashFlowService } from './cashflow.service';
import { CashFlowController } from './cashflow.controller';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [CashFlowService],
    controllers: [CashFlowController],
    exports: [CashFlowService],
})
export class CashFlowModule { }
