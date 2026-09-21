import { PrismaService } from '../prisma/prisma.service';
export interface ConfigImprimante {
    type: 'WINDOWS' | 'NETWORK' | 'BLUETOOTH' | 'NONE';
    ip: string;
    port: number;
    nom: string;
    partage: string;
    largeur: number;
    autoPrint: boolean;
    bluetooth?: string;
}
export interface ResultatImpression {
    ok: boolean;
    message: string;
    contenu?: string;
    bluetooth?: boolean;
}
export declare function normalizeText(texte: string): string;
export declare class ImpressionService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    static POSTES: readonly ["TICKET", "RECU", "PHARMACIE", "ORDONNANCE", "IMAGERIE"];
    static LIBELLES_POSTES: Record<string, string>;
    getConfigEnv(): ConfigImprimante;
    getConfigPoste(cliniqueId: number, poste: string): Promise<ConfigImprimante>;
    getConfigs(cliniqueId: number): Promise<{
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
    }[]>;
    updateConfig(cliniqueId: number, poste: string, updates: {
        type?: string;
        nom?: string;
        partage?: string;
        ip?: string;
        port?: number;
        largeur?: number;
        autoPrint?: boolean;
    }): Promise<{
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
    listWindowsPrinters(): Promise<string[]>;
    testPrinter(cliniqueId: number, poste: string): Promise<{
        ok: boolean;
        message: string;
        debug?: string;
    }>;
    private testWindowsPrinter;
    genererTicketPassage(passage: {
        numeroOrdre: string;
        motif: string | null;
        typePatient: string;
        createdAt: Date;
        patient: {
            nom: string;
            prenom: string;
            age: string | null;
            sexe: string | null;
            code: string;
        };
        service: {
            nom: string;
        } | null;
        clinique: {
            nom: string;
            adresse: string | null;
        };
    }, largeur: number): string;
    imprimerRecuPaiement(paiementId: number): Promise<ResultatImpression>;
    imprimerOrdonnance(consultationId: number): Promise<ResultatImpression>;
    imprimerRecuPharmacie(paiementId: number): Promise<ResultatImpression>;
    imprimerTicketPassage(passageId: number): Promise<ResultatImpression>;
    imprimer(texte: string, config: ConfigImprimante): Promise<ResultatImpression>;
    private sendRawToNetwork;
    private sendTextToWindowsPrinter;
}
