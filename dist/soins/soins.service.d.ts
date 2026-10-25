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
            typePieceIdentite: string | null;
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
    private nbSoinsAFaire;
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
            typePieceIdentite: string | null;
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
                typePieceIdentite: string | null;
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
            gratuit: boolean;
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
        prescrits: ({
            ordonnance: {
                id: number;
                statut: string;
                numero: string;
            };
            lignes: ({
                prescription: {
                    _count: {
                        lignes: number;
                    };
                };
            } & {
                posologie: string | null;
                createdAt: Date;
                id: number;
                medicamentId: number | null;
                medicamentNom: string;
                forme: string | null;
                prescriptionId: number | null;
                dose: string;
                unite: string | null;
                voie: string | null;
                quantitePharmacie: number;
                prescriptionSoinId: number;
            })[];
            medecin: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
            administrations: ({
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
                prescriptionSoinId: number;
            })[];
        } & {
            typeSoin: string;
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            patientId: number;
            medecinId: number;
            consultationId: number;
            ordonnanceId: number | null;
            typeSoinId: number | null;
            foisParJour: number;
            dureeJours: number;
            instructions: string | null;
            nbAdministrations: number;
            arreteLe: Date | null;
        })[];
    }>;
    administrer(prescriptionSoinId: number, date: string, observations: string | undefined, agentId: number): Promise<{
        ordonnance: {
            id: number;
            statut: string;
            numero: string;
        };
        lignes: ({
            prescription: {
                _count: {
                    lignes: number;
                };
            };
        } & {
            posologie: string | null;
            createdAt: Date;
            id: number;
            medicamentId: number | null;
            medicamentNom: string;
            forme: string | null;
            prescriptionId: number | null;
            dose: string;
            unite: string | null;
            voie: string | null;
            quantitePharmacie: number;
            prescriptionSoinId: number;
        })[];
        medecin: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        administrations: ({
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
            prescriptionSoinId: number;
        })[];
    } & {
        typeSoin: string;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        patientId: number;
        medecinId: number;
        consultationId: number;
        ordonnanceId: number | null;
        typeSoinId: number | null;
        foisParJour: number;
        dureeJours: number;
        instructions: string | null;
        nbAdministrations: number;
        arreteLe: Date | null;
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
        data: (({
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
        }) | {
            id: string;
            date: Date;
            observations: string;
            agent: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
            soin: {
                libelle: string;
                patient: {
                    nom: string;
                    prenom: string;
                    code: string;
                };
                passage: {
                    numeroOrdre: string;
                };
            };
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
}
