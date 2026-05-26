import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getKpis(req: any, range?: string): Promise<{
        totalRevenue: number;
        totalProfit: number;
        burnRate: number;
        ltv: number;
        deltaRevenue: string;
        deltaProfit: string;
    }>;
    getTrends(req: any, range?: string): Promise<{
        name: string;
        revenue: number;
        profit: number;
    }[] | {
        date: string;
        revenue: number;
        profit: number;
    }[]>;
    getForecasts(req: any): Promise<{
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
    getInsights(req: any): Promise<any[]>;
    deployCampaign(req: any, body: {
        name: string;
        segment: string;
    }): Promise<any>;
}
