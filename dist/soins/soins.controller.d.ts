import { SoinsService } from './soins.service';
export declare class SoinsController {
    private soinsService;
    constructor(soinsService: SoinsService);
    fileAttente(cliniqueId: number): Promise<{
        id: number;
        numeroOrdre: string;
        patient: {
            nationalite: string | null;
            id: number;
            cliniqueId: number;
            nom: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            telephone: string | null;
            prenom: string;
            sexe: string | null;
            numeroDossier: string;
            age: string | null;
            ville: string | null;
            quartier: string | null;
            profession: string | null;
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
    rechercher(code?: string, cliniqueId?: number): any[] | Promise<{
        id: number;
        numeroOrdre: string;
        patient: {
            nationalite: string | null;
            id: number;
            cliniqueId: number;
            nom: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            telephone: string | null;
            prenom: string;
            sexe: string | null;
            numeroDossier: string;
            age: string | null;
            ville: string | null;
            quartier: string | null;
            profession: string | null;
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
    detailPassage(id: number): Promise<{
        passage: {
            patient: {
                nationalite: string | null;
                id: number;
                cliniqueId: number;
                nom: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                telephone: string | null;
                prenom: string;
                sexe: string | null;
                numeroDossier: string;
                age: string | null;
                ville: string | null;
                quartier: string | null;
                profession: string | null;
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
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            statut: string;
            serviceId: number;
            patientId: number;
            numeroOrdre: string;
            typePatient: string;
            motif: string | null;
            referent: string | null;
            prestationDemandee: string | null;
            taille: string | null;
            temperature: import("@prisma/client/runtime/library").Decimal | null;
            pouls: number | null;
            tensionGauche: string | null;
            tensionDroite: string | null;
            poids: import("@prisma/client/runtime/library").Decimal | null;
            perimetreBrachial: string | null;
            perimetreCranien: string | null;
            expireLe: Date;
        };
        prestations: ({
            service: {
                nom: string;
            };
        } & {
            id: number;
            libelle: string;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
            serviceId: number | null;
            prestationId: number | null;
            montant: import("@prisma/client/runtime/library").Decimal;
            source: string;
            paiementId: number | null;
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
                id: number;
                createdAt: Date;
                date: Date;
                observations: string | null;
                agentId: number | null;
                soinId: number;
            })[];
        } & {
            id: number;
            cliniqueId: number;
            libelle: string;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
            patientId: number;
            passagePrestationId: number;
        })[];
    }>;
    realiser(id: number, body: {
        passagePrestationId: number;
        date: string;
        observations?: string;
    }, req: any): Promise<{
        realisations: ({
            agent: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
        } & {
            id: number;
            createdAt: Date;
            date: Date;
            observations: string | null;
            agentId: number | null;
            soinId: number;
        })[];
    } & {
        id: number;
        cliniqueId: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        patientId: number;
        passagePrestationId: number;
    }>;
    realisations(cliniqueId: number, page?: string, perPage?: string, jour?: string, recherche?: string): Promise<{
        data: ({
            soin: {
                patient: {
                    nom: string;
                    code: string;
                    prenom: string;
                };
                passage: {
                    numeroOrdre: string;
                };
            } & {
                id: number;
                cliniqueId: number;
                libelle: string;
                createdAt: Date;
                updatedAt: Date;
                passageId: number;
                statut: string;
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
            id: number;
            createdAt: Date;
            date: Date;
            observations: string | null;
            agentId: number | null;
            soinId: number;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
}
