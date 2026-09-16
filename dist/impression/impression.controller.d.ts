import { ImpressionService } from './impression.service';
export declare class ImpressionController {
    private impressionService;
    constructor(impressionService: ImpressionService);
    getConfig(): import("./impression.service").ConfigImprimante;
    imprimerTicket(id: number): Promise<import("./impression.service").ResultatImpression>;
    listPrinters(): Promise<{
        printers: string[];
    }>;
    updateConfig(updates: any): {
        message: string;
        config: import("./impression.service").ConfigImprimante;
    };
    test(): Promise<{
        ok: boolean;
        message: string;
        debug?: string;
    }>;
}
