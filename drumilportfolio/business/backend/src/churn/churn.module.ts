import { Module } from '@nestjs/common';
import { ChurnService } from './churn.service';
import { ChurnController } from './churn.controller';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [ChurnService],
    controllers: [ChurnController],
    exports: [ChurnService],
})
export class ChurnModule { }
