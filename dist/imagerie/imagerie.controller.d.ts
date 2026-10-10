import { EnregistrerCrDto } from './dto/imagerie.dto';
import { ImagerieService } from './imagerie.service';
export declare class ImagerieController {
    private imagerieService;
    constructor(imagerieService: ImagerieService);
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
        nbExamensIma: number;
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
                indication: string | null;
                conclusion: string | null;
                valideParId: number | null;
                valideLe: Date | null;
                saisiParId: number | null;
                technique: string | null;
                resultat: string | null;
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
            indication: string | null;
            conclusion: string | null;
            valideParId: number | null;
            valideLe: Date | null;
            saisiParId: number | null;
            technique: string | null;
            resultat: string | null;
        })[];
    }>;
    enregistrerCr(id: number, dto: EnregistrerCrDto, req: any): Promise<{
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
        indication: string | null;
        conclusion: string | null;
        valideParId: number | null;
        valideLe: Date | null;
        saisiParId: number | null;
        technique: string | null;
        resultat: string | null;
    }>;
    valider(id: number, req: any): Promise<{
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
        indication: string | null;
        conclusion: string | null;
        valideParId: number | null;
        valideLe: Date | null;
        saisiParId: number | null;
        technique: string | null;
        resultat: string | null;
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
            indication: string | null;
            conclusion: string | null;
            valideParId: number | null;
            valideLe: Date | null;
            saisiParId: number | null;
            technique: string | null;
            resultat: string | null;
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
    fichesTypes(cliniqueId: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        libelle: string;
        actif: boolean;
        texte: string;
        titre: string | null;
        titre2: string | null;
        champs: string | null;
    }[]>;
    creerFicheType(dto: {
        cliniqueId: number;
        libelle: string;
        titre?: string;
        texte: string;
        champs?: string;
    }): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        libelle: string;
        actif: boolean;
        texte: string;
        titre: string | null;
        titre2: string | null;
        champs: string | null;
    }>;
    modifierFicheType(id: number, dto: {
        libelle?: string;
        titre?: string;
        texte?: string;
        champs?: string;
        actif?: boolean;
    }): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        libelle: string;
        actif: boolean;
        texte: string;
        titre: string | null;
        titre2: string | null;
        champs: string | null;
    }>;
    basculerFicheType(id: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        libelle: string;
        actif: boolean;
        texte: string;
        titre: string | null;
        titre2: string | null;
        champs: string | null;
    }>;
    fichesPassage(id: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        passageId: number;
        patientId: number;
        medecinId: number | null;
        typeFicheId: number;
        libelleType: string;
        texte: string;
        valeurs: string | null;
        indication: string | null;
        prescripteur: string | null;
    }[]>;
    creerFiche(id: number, dto: {
        typeFicheId: number;
        texte?: string;
        valeurs?: Record<string, any>;
        indication?: string;
        prescripteur?: string;
    }, req: any): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        passageId: number;
        patientId: number;
        medecinId: number | null;
        typeFicheId: number;
        libelleType: string;
        texte: string;
        valeurs: string | null;
        indication: string | null;
        prescripteur: string | null;
    }>;
    modifierFiche(id: number, dto: {
        texte?: string;
        valeurs?: Record<string, any>;
        indication?: string;
        prescripteur?: string;
    }): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        passageId: number;
        patientId: number;
        medecinId: number | null;
        typeFicheId: number;
        libelleType: string;
        texte: string;
        valeurs: string | null;
        indication: string | null;
        prescripteur: string | null;
    }>;
    imprimerFiche(id: number): Promise<{
        ok: boolean;
        message: string;
    }>;
}
