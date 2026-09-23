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
        id: number;
        cliniqueId: number;
        poste: string;
        libelle: string | null;
        nom: string | null;
        partage: string | null;
        createdAt: Date;
        statut: string;
        contenu: string;
        erreur: string | null;
        printedAt: Date | null;
    }>;
    updateConfig(body: any): Promise<{
        type: string;
        id: number;
        cliniqueId: number;
        poste: string;
        libelle: string;
        nom: string | null;
        partage: string | null;
        ip: string | null;
        port: number;
        largeur: number;
        autoPrint: boolean;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    test(body: any): Promise<{
        ok: boolean;
        message: string;
        debug?: string;
    }>;
}
