import { PrismaService } from '../prisma/prisma.service';
import { EnregistrerResultatsDto } from './dto/laboratoire.dto';
export declare class LaboratoireService {
    private prisma;
    constructor(prisma: PrismaService);
    private labServiceId;
    rechercher(reference: string, cliniqueId: number): Promise<{
        id: number;
        numeroOrdre: string;
        statut: string;
        createdAt: Date;
        patient: {
            nom: string;
            id: number;
            cliniqueId: number;
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
            nationalite: string | null;
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
            id: number;
            code: string;
        };
        examensPayes: {
            montant: number;
            service: {
                nom: string;
            };
            id: number;
            passageId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            serviceId: number | null;
            prestationId: number | null;
            libelle: string;
            source: string;
            paiementId: number | null;
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
                nom: string;
                id: number;
                cliniqueId: number;
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
                nationalite: string | null;
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
                id: number;
                code: string;
            };
            prestations: {
                montant: number;
                service: {
                    nom: string;
                    id: number;
                    code: string;
                };
                prestation: {
                    type: string;
                };
                id: number;
                passageId: number;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                serviceId: number | null;
                prestationId: number | null;
                libelle: string;
                source: string;
                paiementId: number | null;
            }[];
            examens: ({
                lignes: {
                    parametre: string;
                    id: number;
                    unite: string | null;
                    valeur: string | null;
                    normes: string | null;
                    examenLaboId: number;
                }[];
                validePar: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                    matricule: string;
                };
                prelevePar: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                    matricule: string;
                };
            } & {
                id: number;
                cliniqueId: number;
                passageId: number;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: number;
                libelle: string;
                passagePrestationId: number;
                conclusion: string | null;
                valideParId: number | null;
                valideLe: Date | null;
                preleveParId: number | null;
                preleveLe: Date | null;
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
                unite: string | null;
                valeur: string | null;
                normes: string | null;
                examenLaboId: number;
            }[];
        } & {
            id: number;
            cliniqueId: number;
            passageId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: number;
            libelle: string;
            passagePrestationId: number;
            conclusion: string | null;
            valideParId: number | null;
            valideLe: Date | null;
            preleveParId: number | null;
            preleveLe: Date | null;
        })[];
    }>;
    enregistrerPrelevement(passageId: number, passagePrestationId: number, utilisateurId: number): Promise<{
        lignes: {
            parametre: string;
            id: number;
            unite: string | null;
            valeur: string | null;
            normes: string | null;
            examenLaboId: number;
        }[];
        validePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        prelevePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
    } & {
        id: number;
        cliniqueId: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        libelle: string;
        passagePrestationId: number;
        conclusion: string | null;
        valideParId: number | null;
        valideLe: Date | null;
        preleveParId: number | null;
        preleveLe: Date | null;
    }>;
    enregistrerResultats(examenId: number, dto: EnregistrerResultatsDto): Promise<{
        lignes: {
            parametre: string;
            id: number;
            unite: string | null;
            valeur: string | null;
            normes: string | null;
            examenLaboId: number;
        }[];
        validePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        prelevePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
    } & {
        id: number;
        cliniqueId: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        libelle: string;
        passagePrestationId: number;
        conclusion: string | null;
        valideParId: number | null;
        valideLe: Date | null;
        preleveParId: number | null;
        preleveLe: Date | null;
    }>;
    valider(examenId: number, utilisateurId: number): Promise<{
        lignes: {
            parametre: string;
            id: number;
            unite: string | null;
            valeur: string | null;
            normes: string | null;
            examenLaboId: number;
        }[];
        validePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        prelevePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
    } & {
        id: number;
        cliniqueId: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        libelle: string;
        passagePrestationId: number;
        conclusion: string | null;
        valideParId: number | null;
        valideLe: Date | null;
        preleveParId: number | null;
        preleveLe: Date | null;
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
                code: string;
                prenom: string;
                sexe: string;
                age: string;
            };
            passage: {
                createdAt: Date;
                numeroOrdre: string;
            };
            lignes: {
                parametre: string;
                id: number;
                unite: string | null;
                valeur: string | null;
                normes: string | null;
                examenLaboId: number;
            }[];
            validePar: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
            };
            prelevePar: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
            };
        } & {
            id: number;
            cliniqueId: number;
            passageId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: number;
            libelle: string;
            passagePrestationId: number;
            conclusion: string | null;
            valideParId: number | null;
            valideLe: Date | null;
            preleveParId: number | null;
            preleveLe: Date | null;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
}
