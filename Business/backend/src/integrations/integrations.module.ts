import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { ShopifyService } from './shopify/shopify.service';
import { AmazonService } from './amazon/amazon.service';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, ShopifyService, AmazonService]
})
export class IntegrationsModule {}
