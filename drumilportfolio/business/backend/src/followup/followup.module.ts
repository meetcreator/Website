import { Module } from '@nestjs/common';
import { FollowUpService } from './followup.service';
import { FollowUpController } from './followup.controller';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [FollowUpService],
    controllers: [FollowUpController],
    exports: [FollowUpService],
})
export class FollowUpModule { }
