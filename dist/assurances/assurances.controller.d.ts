import { AssurancesService } from './assurances.service';
export declare class AssurancesController {
    private assurancesService;
    constructor(assurancesService: AssurancesService);
    lister(cliniqueId?: string): any[] | Promise<({
        formules: ({
            couvertures: ({
                prestation: {
                    id: number;
                    libelle: string;
                    code: string;
                    montant: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                statut: string;
                prestationId: number;
                dateDebut: Date | null;
                dateFin: Date | null;
                tauxCouverture: number;
                plafond: import("@prisma/client/runtime/library").Decimal | null;
                formuleId: number;
            })[];
        } & {
            id: number;
            libelle: string;
            createdAt: Date;
            updatedAt: Date;
            statut: string;
            assuranceId: number;
            code: string;
            description: string | null;
            dateDebut: Date | null;
            dateFin: Date | null;
        })[];
    } & {
        id: number;
        cliniqueId: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        code: string;
        adresse: string | null;
        telephone: string | null;
        email: string | null;
        numeroAgrement: string | null;
    })[]>;
    facturation(cliniqueId?: string, debut?: string, fin?: string, assuranceId?: string, page?: string, perPage?: string): Promise<{
        periode: {
            debut: string;
            fin: string;
        };
        lignes: {
            id: number;
            createdAt: Date;
            numeroRecu: string;
            patient: {
                nom: string;
                code: string;
                prenom: string;
            };
            numeroOrdre: string;
            assurance: {
                id: number;
                libelle: string;
                code: string;
            };
            formule: {
                id: number;
                libelle: string;
                code: string;
            };
            tauxParametre: number;
            tauxApplique: number;
            montantTotal: number;
            montantAssurance: number;
            montantPatient: number;
            motifModification: string;
        }[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
        parAssurance: {
            assurance: string;
            totalAssurance: number;
            totalPatient: number;
            totalFacture: number;
            nbLignes: number;
        }[];
    }> | {
        lignes: any[];
        total: number;
        parAssurance: any[];
    };
    creer(cliniqueId: string, dto: any): Promise<{
        id: number;
        cliniqueId: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        code: string;
        adresse: string | null;
        telephone: string | null;
        email: string | null;
        numeroAgrement: string | null;
    }>;
    modifier(id: number, dto: any): Promise<{
        id: number;
        cliniqueId: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        code: string;
        adresse: string | null;
        telephone: string | null;
        email: string | null;
        numeroAgrement: string | null;
    }>;
    desactiver(id: number): Promise<{
        id: number;
        cliniqueId: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        code: string;
        adresse: string | null;
        telephone: string | null;
        email: string | null;
        numeroAgrement: string | null;
    }>;
    creerFormule(dto: any): Promise<{
        id: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        assuranceId: number;
        code: string;
        description: string | null;
        dateDebut: Date | null;
        dateFin: Date | null;
    }>;
    modifierFormule(id: number, dto: any): Promise<{
        id: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        assuranceId: number;
        code: string;
        description: string | null;
        dateDebut: Date | null;
        dateFin: Date | null;
    }>;
    desactiverFormule(id: number): Promise<{
        id: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        assuranceId: number;
        code: string;
        description: string | null;
        dateDebut: Date | null;
        dateFin: Date | null;
    }>;
    creerCouverture(dto: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        prestationId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        tauxCouverture: number;
        plafond: import("@prisma/client/runtime/library").Decimal | null;
        formuleId: number;
    }>;
    modifierCouverture(id: number, dto: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        prestationId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        tauxCouverture: number;
        plafond: import("@prisma/client/runtime/library").Decimal | null;
        formuleId: number;
    }>;
    desactiverCouverture(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        prestationId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        tauxCouverture: number;
        plafond: import("@prisma/client/runtime/library").Decimal | null;
        formuleId: number;
    }>;
    assurancesDuPatient(patientId: number): Promise<({
        assurance: {
            id: number;
            libelle: string;
            code: string;
        };
        formule: {
            id: number;
            libelle: string;
            code: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        assuranceId: number;
        patientId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        formuleId: number;
        numeroAssure: string | null;
        numeroCarte: string | null;
        nomAssurePrincipal: string | null;
        typeBeneficiaire: string | null;
    })[]>;
    ajouterPatientAssurance(patientId: number, dto: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        assuranceId: number;
        patientId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        formuleId: number;
        numeroAssure: string | null;
        numeroCarte: string | null;
        nomAssurePrincipal: string | null;
        typeBeneficiaire: string | null;
    }>;
    desactiverPatientAssurance(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        assuranceId: number;
        patientId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        formuleId: number;
        numeroAssure: string | null;
        numeroCarte: string | null;
        nomAssurePrincipal: string | null;
        typeBeneficiaire: string | null;
    }>;
}
