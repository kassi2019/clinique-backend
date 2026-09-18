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
    enregistrerPrelevement(id: number, dto: EnregistrerPrelevementDto, req: any): Promise<{
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
    enregistrerResultats(id: number, dto: EnregistrerResultatsDto): Promise<{
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
    valider(id: number, req: any): Promise<{
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
    historique(jour?: string, recherche?: string, page?: string, perPage?: string, cliniqueId?: string): Promise<{
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
    }> | {
        data: any[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    };
}
