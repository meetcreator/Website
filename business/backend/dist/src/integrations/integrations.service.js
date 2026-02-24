"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const shopify_service_1 = require("./shopify/shopify.service");
const amazon_service_1 = require("./amazon/amazon.service");
let IntegrationsService = class IntegrationsService {
    prisma;
    shopify;
    amazon;
    constructor(prisma, shopify, amazon) {
        this.prisma = prisma;
        this.shopify = shopify;
        this.amazon = amazon;
    }
    async getIntegrations(tenantId) {
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
    async connectIntegration(tenantId, type, credentials) {
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
    async removeIntegration(tenantId, id) {
        const integration = await this.prisma.integration.findFirst({
            where: { id, tenantId },
        });
        if (!integration) {
            throw new common_1.NotFoundException('Integration not found');
        }
        return this.prisma.integration.delete({
            where: { id },
        });
    }
    async syncAll(tenantId) {
        const integrations = await this.prisma.integration.findMany({
            where: { tenantId, status: 'ACTIVE' },
        });
        const results = [];
        for (const integration of integrations) {
            const credentials = JSON.parse(integration.credentials);
            let syncResult;
            if (integration.type === client_1.IntegrationType.SHOPIFY) {
                syncResult = await this.shopify.syncOrders(tenantId, credentials);
            }
            else if (integration.type === client_1.IntegrationType.AMAZON) {
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
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        shopify_service_1.ShopifyService,
        amazon_service_1.AmazonService])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map