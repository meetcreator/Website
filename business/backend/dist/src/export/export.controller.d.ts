import { ExportService } from './export.service';
import type { Response } from 'express';
export declare class ExportController {
    private exportService;
    constructor(exportService: ExportService);
    exportCsv(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
