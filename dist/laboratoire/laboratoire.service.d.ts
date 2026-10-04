import { PrismaService } from '../prisma/prisma.service';
import { EnregistrerResultatsDto } from './dto/laboratoire.dto';
export declare class LaboratoireService {
    private prisma;
    constructor(prisma: PrismaService);
    private labServiceId;
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
        nbExamens: number;
    }[]>;
    rechercher(reference: string, cliniqueId: number): Promise<{
        id: number;
        numeroOrdre: string;
        statut: string;
        createdAt: Date;
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
            id: number;
            nom: string;
            code: string;
        };
        examensPayes: {
            montant: number;
            service: {
                nom: string;
            };
            createdAt: Date;
            id: number;
            statut: string;
            updatedAt: Date;
            serviceId: number | null;
            libelle: string;
            passageId: number;
            agentId: number | null;
            prestationId: number | null;
            source: string;
            gratuit: boolean;
            paiementId: number | null;
            creditId: number | null;
        }[];
        nbExamensLab: number;
        nbExamensTraites: number;
    }[]>;
    detailPassage(passageId: number): Promise<{
        passage: {
            id: number;
            numeroOrdre: string;
            statut: string;
            typePatient: string;
            referent: string;
            prestationDemandee: string;
            createdAt: Date;
            constantes: {
                taille: string;
                temperature: number;
                pouls: number;
                tensionGauche: string;
                tensionDroite: string;
                poids: number;
            };
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
                id: number;
                nom: string;
                code: string;
            };
            prestations: {
                montant: number;
                service: {
                    id: number;
                    nom: string;
                    code: string;
                };
                prestation: {
                    type: string;
                };
                createdAt: Date;
                id: number;
                statut: string;
                updatedAt: Date;
                serviceId: number | null;
                libelle: string;
                passageId: number;
                agentId: number | null;
                prestationId: number | null;
                source: string;
                gratuit: boolean;
                paiementId: number | null;
                creditId: number | null;
            }[];
            examens: ({
                lignes: {
                    parametre: string;
                    id: number;
                    examenLaboId: number;
                    valeur: string | null;
                    unite: string | null;
                    normes: string | null;
                }[];
                prelevePar: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                    matricule: string;
                };
                validePar: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                    matricule: string;
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
                preleveParId: number | null;
                preleveLe: Date | null;
                conclusion: string | null;
                valideParId: number | null;
                valideLe: Date | null;
            })[];
        };
        historique: ({
            passage: {
                service: {
                    nom: string;
                };
                createdAt: Date;
                numeroOrdre: string;
            };
            lignes: {
                parametre: string;
                id: number;
                examenLaboId: number;
                valeur: string | null;
                unite: string | null;
                normes: string | null;
            }[];
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
            preleveParId: number | null;
            preleveLe: Date | null;
            conclusion: string | null;
            valideParId: number | null;
            valideLe: Date | null;
        })[];
    }>;
    enregistrerPrelevement(passageId: number, passagePrestationId: number, utilisateurId: number): Promise<{
        lignes: {
            parametre: string;
            id: number;
            examenLaboId: number;
            valeur: string | null;
            unite: string | null;
            normes: string | null;
        }[];
        prelevePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        validePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
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
        preleveParId: number | null;
        preleveLe: Date | null;
        conclusion: string | null;
        valideParId: number | null;
        valideLe: Date | null;
    }>;
    enregistrerResultats(examenId: number, dto: EnregistrerResultatsDto): Promise<{
        lignes: {
            parametre: string;
            id: number;
            examenLaboId: number;
            valeur: string | null;
            unite: string | null;
            normes: string | null;
        }[];
        prelevePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        validePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
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
        preleveParId: number | null;
        preleveLe: Date | null;
        conclusion: string | null;
        valideParId: number | null;
        valideLe: Date | null;
    }>;
    valider(examenId: number, utilisateurId: number): Promise<{
        lignes: {
            parametre: string;
            id: number;
            examenLaboId: number;
            valeur: string | null;
            unite: string | null;
            normes: string | null;
        }[];
        prelevePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        validePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
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
        preleveParId: number | null;
        preleveLe: Date | null;
        conclusion: string | null;
        valideParId: number | null;
        valideLe: Date | null;
    }>;
    historique(params: {
        jour?: string;
        recherche?: string;
        page: number;
        perPage: number;
        cliniqueId: number;
    }): Promise<{
        data: ({
            patient: {
                nom: string;
                prenom: string;
                sexe: string;
                code: string;
                age: string;
            };
            passage: {
                createdAt: Date;
                numeroOrdre: string;
            };
            lignes: {
                parametre: string;
                id: number;
                examenLaboId: number;
                valeur: string | null;
                unite: string | null;
                normes: string | null;
            }[];
            prelevePar: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
            };
            validePar: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
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
            preleveParId: number | null;
            preleveLe: Date | null;
            conclusion: string | null;
            valideParId: number | null;
            valideLe: Date | null;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
}
