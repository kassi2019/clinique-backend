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
                createdAt: Date;
                id: number;
                statut: string;
                updatedAt: Date;
                prestationId: number;
                formuleId: number;
                dateDebut: Date | null;
                dateFin: Date | null;
                tauxCouverture: number;
                plafond: Prisma.Decimal | null;
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
            tauxPharmacie: number | null;
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
    creerAssurance(cliniqueId: number, dto: any): Promise<{
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
    desactiverAssurance(id: number): Promise<{
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
    creerFormule(assuranceId: number, dto: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        libelle: string;
        assuranceId: number;
        code: string;
        description: string | null;
        tauxPharmacie: number | null;
        dateDebut: Date | null;
        dateFin: Date | null;
    }>;
    private tauxValide;
    definirTauxPharmacie(id: number, taux: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        libelle: string;
        assuranceId: number;
        code: string;
        description: string | null;
        tauxPharmacie: number | null;
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
        tauxPharmacie: number | null;
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
        tauxPharmacie: number | null;
        dateDebut: Date | null;
        dateFin: Date | null;
    }>;
    creerCouverture(formuleId: number, dto: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        prestationId: number;
        formuleId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        tauxCouverture: number;
        plafond: Prisma.Decimal | null;
    }>;
    modifierCouverture(id: number, dto: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        prestationId: number;
        formuleId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        tauxCouverture: number;
        plafond: Prisma.Decimal | null;
    }>;
    desactiverCouverture(id: number): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        prestationId: number;
        formuleId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        tauxCouverture: number;
        plafond: Prisma.Decimal | null;
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
        formuleId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        numeroAssure: string | null;
        numeroCarte: string | null;
        nomAssurePrincipal: string | null;
        typeBeneficiaire: string | null;
    })[]>;
    couvertureActiveDuPatient(patientId: number): Promise<{
        assurance: {
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
        };
        formule: {
            couvertures: ({
                prestation: {
                    createdAt: Date;
                    id: number;
                    cliniqueId: number;
                    updatedAt: Date;
                    serviceId: number;
                    type: string;
                    libelle: string;
                    actif: boolean;
                    code: string;
                    montant: Prisma.Decimal;
                };
            } & {
                createdAt: Date;
                id: number;
                statut: string;
                updatedAt: Date;
                prestationId: number;
                formuleId: number;
                dateDebut: Date | null;
                dateFin: Date | null;
                tauxCouverture: number;
                plafond: Prisma.Decimal | null;
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
            tauxPharmacie: number | null;
            dateDebut: Date | null;
            dateFin: Date | null;
        };
    } & {
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        assuranceId: number;
        patientId: number;
        formuleId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        numeroAssure: string | null;
        numeroCarte: string | null;
        nomAssurePrincipal: string | null;
        typeBeneficiaire: string | null;
    }>;
    ajouterPatientAssurance(patientId: number, dto: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        assuranceId: number;
        patientId: number;
        formuleId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
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
        formuleId: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        numeroAssure: string | null;
        numeroCarte: string | null;
        nomAssurePrincipal: string | null;
        typeBeneficiaire: string | null;
    }>;
    private lignesAssurance;
    facturation(cliniqueId: number, opts: {
        debut?: string;
        fin?: string;
        assuranceId?: number;
        patientId?: number;
        page?: number;
        perPage?: number;
    }): Promise<{
        periode: {
            debut: string;
            fin: string;
        };
        lignes: {
            id: string;
            source: string;
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
    }>;
    recouvrement(cliniqueId: number): Promise<{
        parAssurance: {
            assuranceId: number;
            assurance: string;
            code: string;
            nbFactures: number;
            facture: number;
            recu: number;
            reste: number;
        }[];
        totaux: {
            facture: number;
            recu: number;
            reste: number;
        };
        reglements: {
            montant: number;
            assurance: {
                id: number;
                libelle: string;
                code: string;
            };
            createdAt: Date;
            id: number;
            cliniqueId: number;
            utilisateurId: number | null;
            assuranceId: number;
            dateReglement: Date;
            modeReglement: string | null;
            reference: string | null;
            commentaire: string | null;
        }[];
    }>;
    creerReglement(dto: any, utilisateurId: number): Promise<{
        montant: number;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        utilisateurId: number | null;
        assuranceId: number;
        dateReglement: Date;
        modeReglement: string | null;
        reference: string | null;
        commentaire: string | null;
    }>;
    supprimerReglement(id: number): Promise<{
        ok: boolean;
    }>;
    assures(cliniqueId: number, opts?: {
        assuranceId?: number;
        search?: string;
    }): Promise<{
        assures: ({
            patient: {
                id: number;
                nom: string;
                prenom: string;
                sexe: string;
                telephone: string;
                code: string;
                age: string;
            };
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
            formuleId: number;
            dateDebut: Date | null;
            dateFin: Date | null;
            numeroAssure: string | null;
            numeroCarte: string | null;
            nomAssurePrincipal: string | null;
            typeBeneficiaire: string | null;
        })[];
        total: number;
        parAssurance: {
            assurance: string;
            nbAssures: number;
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
