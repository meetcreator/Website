import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { InventoryModule } from './inventory/inventory.module';
import { ExportModule } from './export/export.module';
import { AIModule } from './ai/ai.module';
import { NotificationModule } from './notifications/notifications.module';
import { ClientModule } from './client/client.module';
import { RealtimeModule } from './realtime/realtime.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    RealtimeModule,
    AnalyticsModule,
    InventoryModule,
    ExportModule,
    AIModule,
    NotificationModule,
    ClientModule,
    IntegrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
