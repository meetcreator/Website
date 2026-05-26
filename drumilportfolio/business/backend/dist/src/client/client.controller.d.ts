import { ClientService } from './client.service';
export declare class ClientController {
    private clientService;
    constructor(clientService: ClientService);
    getClients(req: any): Promise<any>;
    createClient(req: any, body: {
        name: string;
        value: number;
        growth: string;
    }): Promise<any>;
    deleteClient(req: any, name: string): Promise<any>;
}
