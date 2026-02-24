import { PrismaService } from '../prisma/prisma.service';
export declare class ExportService {
    private prisma;
    constructor(prisma: PrismaService);
    exportTransactionsCsv(tenantId: string): Promise<string>;
}
