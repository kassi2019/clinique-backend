import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class AssurancesService {
    private prisma;
    constructor(prisma: PrismaService);
    listerAssurances(cliniqueId: number): Promise<({
        formules: ({
            couvertures: ({
                prestation: {
                    id: number;
                    libelle: string;
                    code: string;
                    montant: Prisma.Decimal;
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
                plafond: Prisma.Decimal | null;
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
    creerAssurance(cliniqueId: number, dto: any): Promise<{
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
    importerAssurances(cliniqueId: number, lignes: {
        code: string;
        libelle: string;
        telephone?: string;
        email?: string;
        adresse?: string;
        numeroAgrement?: string;
    }[]): Promise<{
        ajoutes: number;
        total: number;
    }>;
    modifierAssurance(id: number, dto: any): Promise<{
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
    desactiverAssurance(id: number): Promise<{
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
    creerFormule(assuranceId: number, dto: any): Promise<{
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
    creerCouverture(formuleId: number, dto: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        prestationId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        tauxCouverture: number;
        plafond: Prisma.Decimal | null;
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
        plafond: Prisma.Decimal | null;
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
        plafond: Prisma.Decimal | null;
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
    couvertureActiveDuPatient(patientId: number): Promise<{
        assurance: {
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
        };
        formule: {
            couvertures: ({
                prestation: {
                    type: string;
                    id: number;
                    cliniqueId: number;
                    libelle: string;
                    actif: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    serviceId: number;
                    montant: Prisma.Decimal;
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
                plafond: Prisma.Decimal | null;
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
    }>;
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
    facturation(cliniqueId: number, opts: {
        debut?: string;
        fin?: string;
        assuranceId?: number;
        page?: number;
        perPage?: number;
    }): Promise<{
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
    }>;
    tauxApplicable(patientId: number, prestationId: number): Promise<{
        assurance: {
            id: number;
            code: string;
            libelle: string;
        };
        formule: {
            id: number;
            code: string;
            libelle: string;
        };
        numeroAssure: string;
        taux: number;
        plafond: number;
    }>;
}
