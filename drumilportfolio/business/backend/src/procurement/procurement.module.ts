import { Module } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [ProcurementService],
    controllers: [ProcurementController],
    exports: [ProcurementService],
})
export class ProcurementModule { }
