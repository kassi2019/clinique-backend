import { EnregistrerPrelevementDto, EnregistrerResultatsDto } from './dto/laboratoire.dto';
import { LaboratoireService } from './laboratoire.service';
export declare class LaboratoireController {
    private laboratoireService;
    constructor(laboratoireService: LaboratoireService);
    rechercher(code?: string, cliniqueId?: string): any[] | Promise<{
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
    fileAttente(cliniqueId?: string): any[] | Promise<{
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
    detailPassage(id: number): Promise<{
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
                    unite: string | null;
                    valeur: string | null;
                    normes: string | null;
                    examenLaboId: number;
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
                conclusion: string | null;
                preleveParId: number | null;
                preleveLe: Date | null;
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
                unite: string | null;
                valeur: string | null;
                normes: string | null;
                examenLaboId: number;
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
            conclusion: string | null;
            preleveParId: number | null;
            preleveLe: Date | null;
            valideParId: number | null;
            valideLe: Date | null;
        })[];
    }>;
    enregistrerPrelevement(id: number, dto: EnregistrerPrelevementDto, req: any): Promise<{
        lignes: {
            parametre: string;
            id: number;
            unite: string | null;
            valeur: string | null;
            normes: string | null;
            examenLaboId: number;
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
        conclusion: string | null;
        preleveParId: number | null;
        preleveLe: Date | null;
        valideParId: number | null;
        valideLe: Date | null;
    }>;
    enregistrerResultats(id: number, dto: EnregistrerResultatsDto): Promise<{
        lignes: {
            parametre: string;
            id: number;
            unite: string | null;
            valeur: string | null;
            normes: string | null;
            examenLaboId: number;
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
        conclusion: string | null;
        preleveParId: number | null;
        preleveLe: Date | null;
        valideParId: number | null;
        valideLe: Date | null;
    }>;
    valider(id: number, req: any): Promise<{
        lignes: {
            parametre: string;
            id: number;
            unite: string | null;
            valeur: string | null;
            normes: string | null;
            examenLaboId: number;
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
        conclusion: string | null;
        preleveParId: number | null;
        preleveLe: Date | null;
        valideParId: number | null;
        valideLe: Date | null;
    }>;
    historique(jour?: string, recherche?: string, page?: string, perPage?: string, cliniqueId?: string): Promise<{
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
                unite: string | null;
                valeur: string | null;
                normes: string | null;
                examenLaboId: number;
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
            conclusion: string | null;
            preleveParId: number | null;
            preleveLe: Date | null;
            valideParId: number | null;
            valideLe: Date | null;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }> | {
        data: any[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    };
}
