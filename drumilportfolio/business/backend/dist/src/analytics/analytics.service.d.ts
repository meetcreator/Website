import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardKpis(tenantId: string, range?: string): Promise<{
        totalRevenue: number;
        totalProfit: number;
        burnRate: number;
        ltv: number;
        deltaRevenue: string;
        deltaProfit: string;
    }>;
    getRevenueTrend(tenantId: string, range?: string): Promise<{
        name: string;
        revenue: number;
        profit: number;
    }[] | {
        date: string;
        revenue: number;
        profit: number;
    }[]>;
    getForecasts(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        value: number;
        period: string;
        confidence: number;
    }[] | {
        name: string;
        value: number;
        confidence: number;
    }[]>;
    getInsights(tenantId: string): Promise<any[]>;
    deployCampaign(tenantId: string, name: string, segment: string): Promise<any>;
}
