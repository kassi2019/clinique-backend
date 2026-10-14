import { FinancesService } from './finances.service';
export declare class FinancesController {
    private finances;
    constructor(finances: FinancesService);
    monService(req: any): Promise<{
        service: any;
    }>;
    prendre(req: any): Promise<{
        service: any;
    }>;
    terminer(req: any): Promise<{
        service: any;
    }>;
    presence(req: any): Promise<{
        enService: boolean;
    }>;
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
    services(cliniqueId: number, mois: string, personnelId?: string): Promise<{
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
    modifierService(id: number, dto: any, req: any): Promise<{
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
    definirRemuneration(personnelId: number, dto: any): Promise<{
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
    genererFiches(dto: {
        cliniqueId: number;
        mois: string;
    }): Promise<{
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
    modifierFiche(id: number, dto: any): Promise<{
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
    statutFiche(id: number, dto: {
        statut: any;
    }, req: any): Promise<{
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
}
