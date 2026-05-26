import { AIService } from './ai.service';
export declare class AIController {
    private aiService;
    constructor(aiService: AIService);
    chat(req: any, body: {
        message: string;
    }): Promise<{
        response: string;
    }>;
}
