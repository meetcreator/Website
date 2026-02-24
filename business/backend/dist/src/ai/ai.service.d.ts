import { PrismaService } from '../prisma/prisma.service';
export declare class AIService {
    private prisma;
    constructor(prisma: PrismaService);
    chat(tenantId: string, message: string): Promise<string>;
}
