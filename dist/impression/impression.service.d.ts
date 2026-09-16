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
    getConfig(): ConfigImprimante;
    updateConfigEnv(updates: Partial<ConfigImprimante>): string;
    listWindowsPrinters(): Promise<string[]>;
    testPrinter(): Promise<{
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
    }): string;
    imprimerRecuPaiement(paiementId: number): Promise<ResultatImpression>;
    imprimerOrdonnance(consultationId: number): Promise<ResultatImpression>;
    imprimerRecuPharmacie(paiementId: number): Promise<ResultatImpression>;
    imprimerTicketPassage(passageId: number): Promise<ResultatImpression>;
    imprimer(texte: string): Promise<ResultatImpression>;
    private sendRawToNetwork;
    private sendTextToWindowsPrinter;
}
