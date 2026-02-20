import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IntegrationType } from '@prisma/client';
import { ShopifyService } from './shopify/shopify.service';
import { AmazonService } from './amazon/amazon.service';

@Injectable()
export class IntegrationsService {
    constructor(
        private prisma: PrismaService,
        private shopify: ShopifyService,
        private amazon: AmazonService,
    ) { }

    async getIntegrations(tenantId: string) {
        return this.prisma.integration.findMany({
            where: { tenantId },
            select: {
                id: true,
                type: true,
                status: true,
                lastSyncAt: true,
                createdAt: true,
            },
        });
    }

    async connectIntegration(tenantId: string, type: IntegrationType, credentials: any) {
        return this.prisma.integration.upsert({
            where: {
                tenantId_type: { tenantId, type },
            },
            update: {
                credentials: JSON.stringify(credentials),
                status: 'ACTIVE',
            },
            create: {
                tenantId,
                type,
                credentials: JSON.stringify(credentials),
                status: 'ACTIVE',
            },
        });
    }

    async removeIntegration(tenantId: string, id: string) {
        const integration = await this.prisma.integration.findFirst({
            where: { id, tenantId },
        });

        if (!integration) {
            throw new NotFoundException('Integration not found');
        }

        return this.prisma.integration.delete({
            where: { id },
        });
    }

    async syncAll(tenantId: string) {
        const integrations = await this.prisma.integration.findMany({
            where: { tenantId, status: 'ACTIVE' },
        });

        const results = [];
        for (const integration of integrations) {
            const credentials = JSON.parse(integration.credentials);
            let syncResult;

            if (integration.type === IntegrationType.SHOPIFY) {
                syncResult = await this.shopify.syncOrders(tenantId, credentials);
            } else if (integration.type === IntegrationType.AMAZON) {
                syncResult = await this.amazon.syncOrders(tenantId, credentials);
            }

            await this.prisma.integration.update({
                where: { id: integration.id },
                data: { lastSyncAt: new Date() },
            });

            results.push({ type: integration.type, ...syncResult });
        }

        return results;
    }
}
