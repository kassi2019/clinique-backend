import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdmissionDto, CreerChambreDto, CreerLitDto, CreerTypeChambreDto, SortieDto, SuiviDto } from './dto/hospitalisation.dto';
export declare class HospitalisationService {
    private prisma;
    constructor(prisma: PrismaService);
    listerTypes(cliniqueId: number): Promise<({
        _count: {
            chambres: number;
        };
    } & {
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        libelle: string;
    })[]>;
    creerType(cliniqueId: number, dto: CreerTypeChambreDto): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        libelle: string;
    }>;
    modifierType(id: number, dto: CreerTypeChambreDto): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        libelle: string;
    }>;
    desactiverType(id: number): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        libelle: string;
    }>;
    listerChambres(cliniqueId: number): Promise<({
        typeChambre: {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            actif: boolean;
            libelle: string;
        };
        lits: {
            id: number;
            actif: boolean;
            numero: string;
            chambreId: number;
        }[];
    } & {
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: Prisma.Decimal | null;
    })[]>;
    creerChambre(cliniqueId: number, dto: CreerChambreDto): Promise<{
        typeChambre: {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            actif: boolean;
            libelle: string;
        };
        lits: {
            id: number;
            actif: boolean;
            numero: string;
            chambreId: number;
        }[];
    } & {
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: Prisma.Decimal | null;
    }>;
    modifierChambre(id: number, dto: Partial<CreerChambreDto>): Promise<{
        typeChambre: {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            actif: boolean;
            libelle: string;
        };
        lits: {
            id: number;
            actif: boolean;
            numero: string;
            chambreId: number;
        }[];
    } & {
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: Prisma.Decimal | null;
    }>;
    desactiverChambre(id: number): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: Prisma.Decimal | null;
    }>;
    creerLit(chambreId: number, dto: CreerLitDto): Promise<{
        id: number;
        actif: boolean;
        numero: string;
        chambreId: number;
    }>;
    desactiverLit(id: number): Promise<{
        id: number;
        actif: boolean;
        numero: string;
        chambreId: number;
    }>;
    listerLits(cliniqueId: number): Promise<{
        id: number;
        numero: string;
        actif: boolean;
        chambre: {
            typeChambre: {
                id: number;
                cliniqueId: number;
                createdAt: Date;
                updatedAt: Date;
                actif: boolean;
                libelle: string;
            };
        } & {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            actif: boolean;
            numero: string;
            typeChambreId: number | null;
            tarifJournalier: Prisma.Decimal | null;
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
            passageId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: number;
            motif: string | null;
            passagePrestationId: number | null;
            litId: number;
            dateEntree: Date;
            dateSortie: Date | null;
            dureePrevue: string | null;
            observations: string | null;
            sortieMotif: string | null;
            sortieParId: number | null;
            nbJoursFactures: number | null;
            montantJournalier: Prisma.Decimal | null;
        };
    }[]>;
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
        consultation: {
            hospitalisation: boolean;
            id: number;
            passageId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: number;
            motif: string | null;
            medecinId: number;
            observation: string | null;
            diagnostic: string | null;
            hospitalisationDuree: string | null;
            valideeLe: Date | null;
            ordonnanceSauveeLe: Date | null;
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
            passageId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: number;
            motif: string | null;
            passagePrestationId: number | null;
            litId: number;
            dateEntree: Date;
            dateSortie: Date | null;
            dureePrevue: string | null;
            observations: string | null;
            sortieMotif: string | null;
            sortieParId: number | null;
            nbJoursFactures: number | null;
            montantJournalier: Prisma.Decimal | null;
        };
    }[]>;
    detailPassage(passageId: number): Promise<{
        passage: {
            id: number;
            numeroOrdre: string;
            statut: string;
            typePatient: string;
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
                passageId: number;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: number;
                motif: string | null;
                medecinId: number;
                observation: string | null;
                diagnostic: string | null;
                hospitalisationDuree: string | null;
                valideeLe: Date | null;
                ordonnanceSauveeLe: Date | null;
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
                    nom: string;
                    id: number;
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
                            createdAt: Date;
                            updatedAt: Date;
                            actif: boolean;
                            libelle: string;
                        };
                    } & {
                        id: number;
                        cliniqueId: number;
                        createdAt: Date;
                        updatedAt: Date;
                        actif: boolean;
                        numero: string;
                        typeChambreId: number | null;
                        tarifJournalier: Prisma.Decimal | null;
                    };
                } & {
                    id: number;
                    actif: boolean;
                    numero: string;
                    chambreId: number;
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
                    statut: string;
                    libelle: string;
                    montant: Prisma.Decimal;
                };
            } & {
                id: number;
                cliniqueId: number;
                passageId: number;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: number;
                motif: string | null;
                passagePrestationId: number | null;
                litId: number;
                dateEntree: Date;
                dateSortie: Date | null;
                dureePrevue: string | null;
                observations: string | null;
                sortieMotif: string | null;
                sortieParId: number | null;
                nbJoursFactures: number | null;
                montantJournalier: Prisma.Decimal | null;
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
                    createdAt: Date;
                    updatedAt: Date;
                    actif: boolean;
                    numero: string;
                    typeChambreId: number | null;
                    tarifJournalier: Prisma.Decimal | null;
                };
            } & {
                id: number;
                actif: boolean;
                numero: string;
                chambreId: number;
            };
        } & {
            id: number;
            cliniqueId: number;
            passageId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: number;
            motif: string | null;
            passagePrestationId: number | null;
            litId: number;
            dateEntree: Date;
            dateSortie: Date | null;
            dureePrevue: string | null;
            observations: string | null;
            sortieMotif: string | null;
            sortieParId: number | null;
            nbJoursFactures: number | null;
            montantJournalier: Prisma.Decimal | null;
        })[];
    }>;
    admettre(passageId: number, dto: AdmissionDto): Promise<{
        patient: {
            nom: string;
            id: number;
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
                    createdAt: Date;
                    updatedAt: Date;
                    actif: boolean;
                    libelle: string;
                };
            } & {
                id: number;
                cliniqueId: number;
                createdAt: Date;
                updatedAt: Date;
                actif: boolean;
                numero: string;
                typeChambreId: number | null;
                tarifJournalier: Prisma.Decimal | null;
            };
        } & {
            id: number;
            actif: boolean;
            numero: string;
            chambreId: number;
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
            statut: string;
            libelle: string;
            montant: Prisma.Decimal;
        };
    } & {
        id: number;
        cliniqueId: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        motif: string | null;
        passagePrestationId: number | null;
        litId: number;
        dateEntree: Date;
        dateSortie: Date | null;
        dureePrevue: string | null;
        observations: string | null;
        sortieMotif: string | null;
        sortieParId: number | null;
        nbJoursFactures: number | null;
        montantJournalier: Prisma.Decimal | null;
    }>;
    suivi(sejourId: number, dto: SuiviDto): Promise<{
        patient: {
            nom: string;
            id: number;
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
                    createdAt: Date;
                    updatedAt: Date;
                    actif: boolean;
                    libelle: string;
                };
            } & {
                id: number;
                cliniqueId: number;
                createdAt: Date;
                updatedAt: Date;
                actif: boolean;
                numero: string;
                typeChambreId: number | null;
                tarifJournalier: Prisma.Decimal | null;
            };
        } & {
            id: number;
            actif: boolean;
            numero: string;
            chambreId: number;
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
            statut: string;
            libelle: string;
            montant: Prisma.Decimal;
        };
    } & {
        id: number;
        cliniqueId: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        motif: string | null;
        passagePrestationId: number | null;
        litId: number;
        dateEntree: Date;
        dateSortie: Date | null;
        dureePrevue: string | null;
        observations: string | null;
        sortieMotif: string | null;
        sortieParId: number | null;
        nbJoursFactures: number | null;
        montantJournalier: Prisma.Decimal | null;
    }>;
    sortie(sejourId: number, dto: SortieDto, utilisateurId: number): Promise<{
        patient: {
            nom: string;
            id: number;
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
                    createdAt: Date;
                    updatedAt: Date;
                    actif: boolean;
                    libelle: string;
                };
            } & {
                id: number;
                cliniqueId: number;
                createdAt: Date;
                updatedAt: Date;
                actif: boolean;
                numero: string;
                typeChambreId: number | null;
                tarifJournalier: Prisma.Decimal | null;
            };
        } & {
            id: number;
            actif: boolean;
            numero: string;
            chambreId: number;
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
            statut: string;
            libelle: string;
            montant: Prisma.Decimal;
        };
    } & {
        id: number;
        cliniqueId: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        motif: string | null;
        passagePrestationId: number | null;
        litId: number;
        dateEntree: Date;
        dateSortie: Date | null;
        dureePrevue: string | null;
        observations: string | null;
        sortieMotif: string | null;
        sortieParId: number | null;
        nbJoursFactures: number | null;
        montantJournalier: Prisma.Decimal | null;
    }>;
    historique(params: {
        jour?: string;
        recherche?: string;
        statut?: string;
        page: number;
        perPage: number;
        cliniqueId: number;
    }): Promise<{
        data: {
            montantJournalier: number;
            patient: {
                nom: string;
                id: number;
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
                        createdAt: Date;
                        updatedAt: Date;
                        actif: boolean;
                        libelle: string;
                    };
                } & {
                    id: number;
                    cliniqueId: number;
                    createdAt: Date;
                    updatedAt: Date;
                    actif: boolean;
                    numero: string;
                    typeChambreId: number | null;
                    tarifJournalier: Prisma.Decimal | null;
                };
            } & {
                id: number;
                actif: boolean;
                numero: string;
                chambreId: number;
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
                statut: string;
                libelle: string;
                montant: Prisma.Decimal;
            };
            id: number;
            cliniqueId: number;
            passageId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: number;
            motif: string | null;
            passagePrestationId: number | null;
            litId: number;
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
    }>;
}
