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
                createdAt: Date;
                id: number;
                statut: string;
                updatedAt: Date;
                prestationId: number;
                dateDebut: Date | null;
                dateFin: Date | null;
                tauxCouverture: number;
                plafond: import("@prisma/client/runtime/library").Decimal | null;
                formuleId: number;
            })[];
        } & {
            createdAt: Date;
            id: number;
            statut: string;
            updatedAt: Date;
            libelle: string;
            assuranceId: number;
            code: string;
            description: string | null;
            dateDebut: Date | null;
            dateFin: Date | null;
        })[];
    } & {
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        telephone: string | null;
        email: string | null;
        libelle: string;
        code: string;
        adresse: string | null;
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
                prenom: string;
                code: string;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        telephone: string | null;
        email: string | null;
        libelle: string;
        code: string;
        adresse: string | null;
        numeroAgrement: string | null;
    }>;
    importer(cliniqueId: string, dto: any): Promise<{
        ajoutes: number;
        total: number;
    }>;
    modifier(id: number, dto: any): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        telephone: string | null;
        email: string | null;
        libelle: string;
        code: string;
        adresse: string | null;
        numeroAgrement: string | null;
    }>;
    desactiver(id: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        telephone: string | null;
        email: string | null;
        libelle: string;
        code: string;
        adresse: string | null;
        numeroAgrement: string | null;
    }>;
    creerFormule(dto: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        libelle: string;
        assuranceId: number;
        code: string;
        description: string | null;
        dateDebut: Date | null;
        dateFin: Date | null;
    }>;
    modifierFormule(id: number, dto: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        libelle: string;
        assuranceId: number;
        code: string;
        description: string | null;
        dateDebut: Date | null;
        dateFin: Date | null;
    }>;
    desactiverFormule(id: number): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        libelle: string;
        assuranceId: number;
        code: string;
        description: string | null;
        dateDebut: Date | null;
        dateFin: Date | null;
    }>;
    creerCouverture(dto: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        prestationId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        tauxCouverture: number;
        plafond: import("@prisma/client/runtime/library").Decimal | null;
        formuleId: number;
    }>;
    modifierCouverture(id: number, dto: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        prestationId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        tauxCouverture: number;
        plafond: import("@prisma/client/runtime/library").Decimal | null;
        formuleId: number;
    }>;
    desactiverCouverture(id: number): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
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
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
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
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
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
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
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
