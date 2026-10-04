import { ImpressionService } from './impression.service';
export declare class ImpressionController {
    private impressionService;
    constructor(impressionService: ImpressionService);
    getConfig(cliniqueId?: string): Promise<{
        printers: {
            poste: "TICKET" | "RECU" | "PHARMACIE" | "ORDONNANCE" | "IMAGERIE";
            libelle: string;
            config: {
                type: string;
                nom: string;
                partage: string;
                ip: string;
                port: number;
                largeur: number;
                autoPrint: boolean;
            };
        }[];
    }>;
    imprimerTicket(id: number): Promise<import("./impression.service").ResultatImpression>;
    imprimerRecu(id: number): Promise<import("./impression.service").ResultatImpression>;
    imprimerOrdonnance(id: number): Promise<import("./impression.service").ResultatImpression>;
    imprimerRecuPharmacie(id: number): Promise<import("./impression.service").ResultatImpression>;
    listPrinters(): Promise<{
        printers: string[];
    }>;
    getFile(poste?: string, cliniqueId?: string): Promise<{
        id: number;
        poste: string;
        libelle: string;
        contenu: string;
        partage: string;
        nom: string;
        createdAt: Date;
    }[]>;
    updateStatut(id: number, body: {
        statut: 'IMPRIMEE' | 'ECHEC';
        erreur?: string;
    }): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        nom: string | null;
        poste: string;
        libelle: string | null;
        partage: string | null;
        contenu: string;
        format: string;
        erreur: string | null;
        printedAt: Date | null;
    }>;
    updateConfig(body: any): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string | null;
        type: string;
        poste: string;
        libelle: string;
        partage: string | null;
        ip: string | null;
        port: number;
        largeur: number;
        autoPrint: boolean;
        actif: boolean;
    }>;
    test(body: any): Promise<{
        ok: boolean;
        message: string;
        debug?: string;
    }>;
}
