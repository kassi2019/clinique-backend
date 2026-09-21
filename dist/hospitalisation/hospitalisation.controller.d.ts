import { AdmissionDto, CreerChambreDto, CreerLitDto, CreerTypeChambreDto, SortieDto, SuiviDto } from './dto/hospitalisation.dto';
import { HospitalisationService } from './hospitalisation.service';
export declare class HospitalisationController {
    private hospitalisationService;
    constructor(hospitalisationService: HospitalisationService);
    listerTypes(cliniqueId?: string): any[] | Promise<({
        _count: {
            chambres: number;
        };
    } & {
        id: number;
        cliniqueId: number;
        libelle: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    creerType(cliniqueId: string, dto: CreerTypeChambreDto): Promise<{
        id: number;
        cliniqueId: number;
        libelle: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    modifierType(id: number, dto: CreerTypeChambreDto): Promise<{
        id: number;
        cliniqueId: number;
        libelle: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    desactiverType(id: number): Promise<{
        id: number;
        cliniqueId: number;
        libelle: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listerChambres(cliniqueId?: string): any[] | Promise<({
        typeChambre: {
            id: number;
            cliniqueId: number;
            libelle: string;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        lits: {
            id: number;
            actif: boolean;
            chambreId: number;
            numero: string;
        }[];
    } & {
        id: number;
        cliniqueId: number;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    creerChambre(cliniqueId: string, dto: CreerChambreDto): Promise<{
        typeChambre: {
            id: number;
            cliniqueId: number;
            libelle: string;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        lits: {
            id: number;
            actif: boolean;
            chambreId: number;
            numero: string;
        }[];
    } & {
        id: number;
        cliniqueId: number;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    modifierChambre(id: number, dto: CreerChambreDto): Promise<{
        typeChambre: {
            id: number;
            cliniqueId: number;
            libelle: string;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        lits: {
            id: number;
            actif: boolean;
            chambreId: number;
            numero: string;
        }[];
    } & {
        id: number;
        cliniqueId: number;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    desactiverChambre(id: number): Promise<{
        id: number;
        cliniqueId: number;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    creerLit(id: number, dto: CreerLitDto): Promise<{
        id: number;
        actif: boolean;
        chambreId: number;
        numero: string;
    }>;
    desactiverLit(id: number): Promise<{
        id: number;
        actif: boolean;
        chambreId: number;
        numero: string;
    }>;
    listerLits(cliniqueId?: string): any[] | Promise<{
        id: number;
        numero: string;
        actif: boolean;
        chambre: {
            typeChambre: {
                id: number;
                cliniqueId: number;
                libelle: string;
                actif: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            cliniqueId: number;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
            numero: string;
            typeChambreId: number | null;
            tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
        };
        label: string;
        occupe: boolean;
        sejour: {
            patient: {
                nom: string;
                code: string;
                prenom: string;
            };
        } & {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
            patientId: number;
            motif: string | null;
            litId: number;
            passagePrestationId: number | null;
            dateEntree: Date;
            dateSortie: Date | null;
            dureePrevue: string | null;
            observations: string | null;
            sortieMotif: string | null;
            sortieParId: number | null;
            nbJoursFactures: number | null;
            montantJournalier: import("@prisma/client/runtime/library").Decimal | null;
        };
    }[]>;
    rechercher(code?: string, cliniqueId?: string): any[] | Promise<{
        id: number;
        numeroOrdre: string;
        statut: string;
        createdAt: Date;
        patient: {
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
            id: number;
            nom: string;
            code: string;
        };
        consultation: {
            hospitalisation: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
            patientId: number;
            motif: string | null;
            medecinId: number;
            observation: string | null;
            diagnostic: string | null;
            hospitalisationDuree: string | null;
            typeHospitalisation: string | null;
            hospitalisationDureeJours: number | null;
            litId: number | null;
            valideeLe: Date | null;
            ordonnanceSauveeLe: Date | null;
            numeroOrdonnance: string | null;
            ordonnanceStatut: string;
            modeEntree: string | null;
            modeEntreeAutre: string | null;
            traitementAnterieur: string | null;
            hta: boolean | null;
            diabete: boolean | null;
            antecedentsMedicaux: string | null;
            antecedentsChirurgicaux: string | null;
            ddr: string | null;
            grossesseEnCours: boolean | null;
            tabac: boolean | null;
            alcool: boolean | null;
            typeSuivi: string | null;
            consultantType: string | null;
            imc: string | null;
            zscore: string | null;
            frequenceRespiratoire: string | null;
            perimetreBrachial: string | null;
            perimetreCranien: string | null;
            rechercheTB: string | null;
            pathologiesAssociees: string | null;
            tdrPaludisme: string | null;
            goutteEpaisse: string | null;
            mildaEligible: string | null;
            mildaRemise: string | null;
            cdipPropose: boolean | null;
            cdipRealise: boolean | null;
            codeDepistage: string | null;
            glycemieAjeun: string | null;
            glycemieNonAjeun: string | null;
            autresExamens: string | null;
            conduiteTenir: string | null;
            issueSortie: string | null;
            casPresumeTB: string | null;
            moDureeHeures: number | null;
            moDureeMinutes: number | null;
            moDebut: Date | null;
            moFin: Date | null;
        };
        sejour: {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
            patientId: number;
            motif: string | null;
            litId: number;
            passagePrestationId: number | null;
            dateEntree: Date;
            dateSortie: Date | null;
            dureePrevue: string | null;
            observations: string | null;
            sortieMotif: string | null;
            sortieParId: number | null;
            nbJoursFactures: number | null;
            montantJournalier: import("@prisma/client/runtime/library").Decimal | null;
        };
    }[]>;
    detailPassage(id: number): Promise<{
        passage: {
            id: number;
            numeroOrdre: string;
            statut: string;
            typePatient: string;
            createdAt: Date;
            patient: {
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
                id: number;
                nom: string;
                code: string;
            };
            consultation: {
                medecin: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                };
            } & {
                hospitalisation: boolean;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                passageId: number;
                statut: string;
                patientId: number;
                motif: string | null;
                medecinId: number;
                observation: string | null;
                diagnostic: string | null;
                hospitalisationDuree: string | null;
                typeHospitalisation: string | null;
                hospitalisationDureeJours: number | null;
                litId: number | null;
                valideeLe: Date | null;
                ordonnanceSauveeLe: Date | null;
                numeroOrdonnance: string | null;
                ordonnanceStatut: string;
                modeEntree: string | null;
                modeEntreeAutre: string | null;
                traitementAnterieur: string | null;
                hta: boolean | null;
                diabete: boolean | null;
                antecedentsMedicaux: string | null;
                antecedentsChirurgicaux: string | null;
                ddr: string | null;
                grossesseEnCours: boolean | null;
                tabac: boolean | null;
                alcool: boolean | null;
                typeSuivi: string | null;
                consultantType: string | null;
                imc: string | null;
                zscore: string | null;
                frequenceRespiratoire: string | null;
                perimetreBrachial: string | null;
                perimetreCranien: string | null;
                rechercheTB: string | null;
                pathologiesAssociees: string | null;
                tdrPaludisme: string | null;
                goutteEpaisse: string | null;
                mildaEligible: string | null;
                mildaRemise: string | null;
                cdipPropose: boolean | null;
                cdipRealise: boolean | null;
                codeDepistage: string | null;
                glycemieAjeun: string | null;
                glycemieNonAjeun: string | null;
                autresExamens: string | null;
                conduiteTenir: string | null;
                issueSortie: string | null;
                casPresumeTB: string | null;
                moDureeHeures: number | null;
                moDureeMinutes: number | null;
                moDebut: Date | null;
                moFin: Date | null;
            };
            sejour: {
                patient: {
                    id: number;
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
                lit: {
                    chambre: {
                        typeChambre: {
                            id: number;
                            cliniqueId: number;
                            libelle: string;
                            actif: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                        };
                    } & {
                        id: number;
                        cliniqueId: number;
                        actif: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        numero: string;
                        typeChambreId: number | null;
                        tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
                    };
                } & {
                    id: number;
                    actif: boolean;
                    chambreId: number;
                    numero: string;
                };
                sortiePar: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                    matricule: string;
                };
                ligneCaisse: {
                    id: number;
                    libelle: string;
                    statut: string;
                    montant: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: number;
                cliniqueId: number;
                createdAt: Date;
                updatedAt: Date;
                passageId: number;
                statut: string;
                patientId: number;
                motif: string | null;
                litId: number;
                passagePrestationId: number | null;
                dateEntree: Date;
                dateSortie: Date | null;
                dureePrevue: string | null;
                observations: string | null;
                sortieMotif: string | null;
                sortieParId: number | null;
                nbJoursFactures: number | null;
                montantJournalier: import("@prisma/client/runtime/library").Decimal | null;
            };
        };
        historique: ({
            passage: {
                createdAt: Date;
                numeroOrdre: string;
            };
            lit: {
                chambre: {
                    id: number;
                    cliniqueId: number;
                    actif: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    numero: string;
                    typeChambreId: number | null;
                    tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
                };
            } & {
                id: number;
                actif: boolean;
                chambreId: number;
                numero: string;
            };
        } & {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
            patientId: number;
            motif: string | null;
            litId: number;
            passagePrestationId: number | null;
            dateEntree: Date;
            dateSortie: Date | null;
            dureePrevue: string | null;
            observations: string | null;
            sortieMotif: string | null;
            sortieParId: number | null;
            nbJoursFactures: number | null;
            montantJournalier: import("@prisma/client/runtime/library").Decimal | null;
        })[];
    }>;
    admettre(id: number, dto: AdmissionDto): Promise<{
        patient: {
            id: number;
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
        lit: {
            chambre: {
                typeChambre: {
                    id: number;
                    cliniqueId: number;
                    libelle: string;
                    actif: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: number;
                cliniqueId: number;
                actif: boolean;
                createdAt: Date;
                updatedAt: Date;
                numero: string;
                typeChambreId: number | null;
                tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
            };
        } & {
            id: number;
            actif: boolean;
            chambreId: number;
            numero: string;
        };
        sortiePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        ligneCaisse: {
            id: number;
            libelle: string;
            statut: string;
            montant: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        patientId: number;
        motif: string | null;
        litId: number;
        passagePrestationId: number | null;
        dateEntree: Date;
        dateSortie: Date | null;
        dureePrevue: string | null;
        observations: string | null;
        sortieMotif: string | null;
        sortieParId: number | null;
        nbJoursFactures: number | null;
        montantJournalier: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    suivi(id: number, dto: SuiviDto): Promise<{
        patient: {
            id: number;
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
        lit: {
            chambre: {
                typeChambre: {
                    id: number;
                    cliniqueId: number;
                    libelle: string;
                    actif: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: number;
                cliniqueId: number;
                actif: boolean;
                createdAt: Date;
                updatedAt: Date;
                numero: string;
                typeChambreId: number | null;
                tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
            };
        } & {
            id: number;
            actif: boolean;
            chambreId: number;
            numero: string;
        };
        sortiePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        ligneCaisse: {
            id: number;
            libelle: string;
            statut: string;
            montant: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        patientId: number;
        motif: string | null;
        litId: number;
        passagePrestationId: number | null;
        dateEntree: Date;
        dateSortie: Date | null;
        dureePrevue: string | null;
        observations: string | null;
        sortieMotif: string | null;
        sortieParId: number | null;
        nbJoursFactures: number | null;
        montantJournalier: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    sortie(id: number, dto: SortieDto, req: any): Promise<{
        patient: {
            id: number;
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
        lit: {
            chambre: {
                typeChambre: {
                    id: number;
                    cliniqueId: number;
                    libelle: string;
                    actif: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: number;
                cliniqueId: number;
                actif: boolean;
                createdAt: Date;
                updatedAt: Date;
                numero: string;
                typeChambreId: number | null;
                tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
            };
        } & {
            id: number;
            actif: boolean;
            chambreId: number;
            numero: string;
        };
        sortiePar: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        ligneCaisse: {
            id: number;
            libelle: string;
            statut: string;
            montant: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        patientId: number;
        motif: string | null;
        litId: number;
        passagePrestationId: number | null;
        dateEntree: Date;
        dateSortie: Date | null;
        dureePrevue: string | null;
        observations: string | null;
        sortieMotif: string | null;
        sortieParId: number | null;
        nbJoursFactures: number | null;
        montantJournalier: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    historique(jour?: string, recherche?: string, statut?: string, page?: string, perPage?: string, cliniqueId?: string): Promise<{
        data: {
            montantJournalier: number;
            patient: {
                id: number;
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
            lit: {
                chambre: {
                    typeChambre: {
                        id: number;
                        cliniqueId: number;
                        libelle: string;
                        actif: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    id: number;
                    cliniqueId: number;
                    actif: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    numero: string;
                    typeChambreId: number | null;
                    tarifJournalier: import("@prisma/client/runtime/library").Decimal | null;
                };
            } & {
                id: number;
                actif: boolean;
                chambreId: number;
                numero: string;
            };
            sortiePar: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
            ligneCaisse: {
                id: number;
                libelle: string;
                statut: string;
                montant: import("@prisma/client/runtime/library").Decimal;
            };
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
            patientId: number;
            motif: string | null;
            litId: number;
            passagePrestationId: number | null;
            dateEntree: Date;
            dateSortie: Date | null;
            dureePrevue: string | null;
            observations: string | null;
            sortieMotif: string | null;
            sortieParId: number | null;
            nbJoursFactures: number | null;
        }[];
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
