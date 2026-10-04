import { PrismaService } from '../prisma/prisma.service';
export declare class SoinsService {
    private prisma;
    constructor(prisma: PrismaService);
    private lignesSoins;
    fileAttente(cliniqueId: number): Promise<{
        id: number;
        numeroOrdre: string;
        patient: {
            nationalite: string | null;
            profession: string | null;
            quartier: string | null;
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
            prenom: string;
            sexe: string | null;
            telephone: string | null;
            code: string;
            numeroDossier: string;
            creeParId: number | null;
            age: string | null;
            dateNaissance: Date | null;
            numeroCni: string | null;
            numeroCmu: string | null;
            ville: string | null;
            scolarisation: string | null;
            statutConjugal: string | null;
            typePopulation: string | null;
            populationsRisque: string | null;
            protectionSociale: string | null;
            residenceHabituelle: string | null;
            residenceActuelle: string | null;
        };
        service: {
            nom: string;
        };
        createdAt: Date;
        nbSoins: number;
    }[]>;
    rechercher(reference: string, cliniqueId: number): Promise<{
        id: number;
        numeroOrdre: string;
        patient: {
            nationalite: string | null;
            profession: string | null;
            quartier: string | null;
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
            prenom: string;
            sexe: string | null;
            telephone: string | null;
            code: string;
            numeroDossier: string;
            creeParId: number | null;
            age: string | null;
            dateNaissance: Date | null;
            numeroCni: string | null;
            numeroCmu: string | null;
            ville: string | null;
            scolarisation: string | null;
            statutConjugal: string | null;
            typePopulation: string | null;
            populationsRisque: string | null;
            protectionSociale: string | null;
            residenceHabituelle: string | null;
            residenceActuelle: string | null;
        };
        service: {
            nom: string;
        };
        nbSoins: number;
    }[]>;
    detailPassage(passageId: number): Promise<{
        passage: {
            patient: {
                nationalite: string | null;
                profession: string | null;
                quartier: string | null;
                createdAt: Date;
                id: number;
                cliniqueId: number;
                updatedAt: Date;
                nom: string;
                prenom: string;
                sexe: string | null;
                telephone: string | null;
                code: string;
                numeroDossier: string;
                creeParId: number | null;
                age: string | null;
                dateNaissance: Date | null;
                numeroCni: string | null;
                numeroCmu: string | null;
                ville: string | null;
                scolarisation: string | null;
                statutConjugal: string | null;
                typePopulation: string | null;
                populationsRisque: string | null;
                protectionSociale: string | null;
                residenceHabituelle: string | null;
                residenceActuelle: string | null;
            };
            service: {
                nom: string;
            };
        } & {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            serviceId: number;
            patientId: number;
            numeroOrdre: string;
            typePatient: string;
            motif: string | null;
            referent: string | null;
            prestationDemandee: string | null;
            agentId: number | null;
            taille: string | null;
            temperature: import("@prisma/client/runtime/library").Decimal | null;
            pouls: number | null;
            tensionGauche: string | null;
            tensionDroite: string | null;
            poids: import("@prisma/client/runtime/library").Decimal | null;
            perimetreBrachial: string | null;
            perimetreCranien: string | null;
            materniteTraiteLe: Date | null;
            expireLe: Date;
        };
        prestations: ({
            service: {
                nom: string;
            };
        } & {
            createdAt: Date;
            id: number;
            statut: string;
            updatedAt: Date;
            serviceId: number | null;
            libelle: string;
            passageId: number;
            agentId: number | null;
            prestationId: number | null;
            montant: import("@prisma/client/runtime/library").Decimal;
            source: string;
            paiementId: number | null;
            creditId: number | null;
        })[];
        soins: ({
            realisations: ({
                agent: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                    matricule: string;
                };
            } & {
                createdAt: Date;
                id: number;
                agentId: number | null;
                date: Date;
                observations: string | null;
                soinId: number;
            })[];
        } & {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            libelle: string;
            passageId: number;
            patientId: number;
            passagePrestationId: number;
        })[];
    }>;
    realiser(passagePrestationId: number, date: string, observations: string | undefined, agentId: number): Promise<{
        realisations: ({
            agent: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
        } & {
            createdAt: Date;
            id: number;
            agentId: number | null;
            date: Date;
            observations: string | null;
            soinId: number;
        })[];
    } & {
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        libelle: string;
        passageId: number;
        patientId: number;
        passagePrestationId: number;
    }>;
    realisations(cliniqueId: number, page?: number, perPage?: number, jour?: string, recherche?: string): Promise<{
        data: ({
            soin: {
                patient: {
                    nom: string;
                    prenom: string;
                    code: string;
                };
                passage: {
                    numeroOrdre: string;
                };
            } & {
                createdAt: Date;
                id: number;
                cliniqueId: number;
                statut: string;
                updatedAt: Date;
                libelle: string;
                passageId: number;
                patientId: number;
                passagePrestationId: number;
            };
            agent: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
        } & {
            createdAt: Date;
            id: number;
            agentId: number | null;
            date: Date;
            observations: string | null;
            soinId: number;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
}
