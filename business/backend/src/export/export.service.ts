import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Parser } from 'json2csv';

@Injectable()
export class ExportService {
    constructor(private prisma: PrismaService) { }

    async exportTransactionsCsv(tenantId: string) {
        const orders = await this.prisma.order.findMany({
            where: { tenantId },
            include: { customer: true },
        });

        const data = orders.map(o => ({
            OrderNumber: o.orderNumber,
            Customer: o.customer.name,
            Revenue: o.revenue,
            Profit: o.profit,
            Date: o.createdAt.toLocaleDateString(),
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);
        return csv;
    }
}
