import { PrismaService } from '../prisma/prisma.service';
export declare class FinancesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private utilisateur;
    monService(utilisateurId: number): Promise<{
        service: any;
    }>;
    prendreService(utilisateurId: number): Promise<{
        service: any;
    }>;
    terminerService(utilisateurId: number): Promise<{
        service: any;
    }>;
    presence(utilisateurId: number): Promise<{
        enService: boolean;
    }>;
    fermerServicesOublies(): Promise<number>;
    private formaterService;
    enService(cliniqueId: number): Promise<{
        lignes: {
            id: number;
            debut: Date;
            derniereActivite: Date;
            heures: number;
            minutesPresence: number;
            present: boolean;
            agent: {
                utilisateurId: number;
                matricule: string;
                nom: string;
                prenom: string;
                fonction: string;
                role: string;
            };
        }[];
        total: number;
        presents: number;
        maintenant: Date;
    }>;
    private bornesMois;
    private dureeVacation;
    private calculerService;
    services(cliniqueId: number, mois: string, personnelId?: number): Promise<{
        personnelId: number;
        agent: {
            nom: string;
            prenom: string;
            fonction: string;
        };
        heuresBrutes: number;
        heures: number;
        vacations: number;
        id: number;
        debut: Date;
        fin: Date;
        statut: string;
        fermetureAuto: boolean;
        minutesPresence: number;
        motifCorrection: string;
        valideLe: Date;
        validePar: string;
        corrige: boolean;
    }[]>;
    modifierService(id: number, dto: {
        debut?: string;
        fin?: string;
        heuresRetenues?: any;
        vacationsRetenues?: any;
        motif?: string;
        statut?: string;
    }, utilisateurId: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        utilisateurId: number;
        personnelId: number;
        statut: string;
        updatedAt: Date;
        derniereActivite: Date | null;
        debut: Date;
        fin: Date | null;
        valideParId: number | null;
        valideLe: Date | null;
        fermetureAuto: boolean;
        minutesPresence: number;
        heuresRetenues: import("@prisma/client/runtime/library").Decimal | null;
        vacationsRetenues: import("@prisma/client/runtime/library").Decimal | null;
        motifCorrection: string | null;
    }>;
    private moisDe;
    remunerations(cliniqueId: number): Promise<{
        personnelId: number;
        matricule: string;
        nom: string;
        prenom: string;
        fonction: string;
        aUnCompte: boolean;
        remuneration: {
            tarif: number;
            createdAt: Date;
            id: number;
            cliniqueId: number;
            personnelId: number;
            statut: string;
            updatedAt: Date;
            actif: boolean;
            mode: string;
            dureeVacationHeures: number;
        };
    }[]>;
    definirRemuneration(personnelId: number, dto: {
        statut?: string;
        mode?: string;
        tarif?: any;
        dureeVacationHeures?: any;
        actif?: boolean;
    }): Promise<{
        tarif: number;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        personnelId: number;
        statut: string;
        updatedAt: Date;
        actif: boolean;
        mode: string;
        dureeVacationHeures: number;
    }>;
    genererFiches(cliniqueId: number, mois: string): Promise<{
        creees: number;
        misesAJour: number;
        figees: number;
    }>;
    fiches(cliniqueId: number, mois: string): Promise<{
        lignes: {
            heures: number;
            vacations: number;
            tarif: number;
            montantBase: number;
            primes: number;
            retenues: number;
            montantTotal: number;
            validePar: string;
            personnel: {
                fonction: string;
                matricule: string;
                nom: string;
                prenom: string;
            };
            createdAt: Date;
            id: number;
            cliniqueId: number;
            personnelId: number;
            statut: string;
            updatedAt: Date;
            commentaire: string | null;
            valideParId: number | null;
            valideLe: Date | null;
            mode: string;
            dureeVacationHeures: number;
            mois: string;
            nbServices: number;
            nbAVerifier: number;
            payeLe: Date | null;
        }[];
        total: number;
    }>;
    modifierFiche(id: number, dto: {
        primes?: any;
        retenues?: any;
        commentaire?: string;
    }): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        personnelId: number;
        statut: string;
        updatedAt: Date;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        commentaire: string | null;
        valideParId: number | null;
        valideLe: Date | null;
        mode: string;
        heures: import("@prisma/client/runtime/library").Decimal;
        tarif: import("@prisma/client/runtime/library").Decimal;
        dureeVacationHeures: number;
        mois: string;
        nbServices: number;
        nbAVerifier: number;
        vacations: import("@prisma/client/runtime/library").Decimal;
        montantBase: import("@prisma/client/runtime/library").Decimal;
        primes: import("@prisma/client/runtime/library").Decimal;
        retenues: import("@prisma/client/runtime/library").Decimal;
        payeLe: Date | null;
    }>;
    changerStatutFiche(id: number, statut: 'VALIDEE' | 'PAYEE' | 'BROUILLON', utilisateurId: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        personnelId: number;
        statut: string;
        updatedAt: Date;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        commentaire: string | null;
        valideParId: number | null;
        valideLe: Date | null;
        mode: string;
        heures: import("@prisma/client/runtime/library").Decimal;
        tarif: import("@prisma/client/runtime/library").Decimal;
        dureeVacationHeures: number;
        mois: string;
        nbServices: number;
        nbAVerifier: number;
        vacations: import("@prisma/client/runtime/library").Decimal;
        montantBase: import("@prisma/client/runtime/library").Decimal;
        primes: import("@prisma/client/runtime/library").Decimal;
        retenues: import("@prisma/client/runtime/library").Decimal;
        payeLe: Date | null;
    }>;
    detailFiche(id: number): Promise<{
        services: {
            personnelId: number;
            agent: {
                nom: string;
                prenom: string;
                fonction: string;
            };
            heuresBrutes: number;
            heures: number;
            vacations: number;
            id: number;
            debut: Date;
            fin: Date;
            statut: string;
            fermetureAuto: boolean;
            minutesPresence: number;
            motifCorrection: string;
            valideLe: Date;
            validePar: string;
            corrige: boolean;
        }[];
    }>;
}
