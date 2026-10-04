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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        libelle: string;
        actif: boolean;
    })[]>;
    creerType(cliniqueId: number, dto: CreerTypeChambreDto): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        libelle: string;
        actif: boolean;
    }>;
    modifierType(id: number, dto: CreerTypeChambreDto): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        libelle: string;
        actif: boolean;
    }>;
    desactiverType(id: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        libelle: string;
        actif: boolean;
    }>;
    listerChambres(cliniqueId: number): Promise<({
        typeChambre: {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            libelle: string;
            actif: boolean;
        };
        lits: {
            id: number;
            actif: boolean;
            numero: string;
            chambreId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        actif: boolean;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: Prisma.Decimal | null;
    })[]>;
    creerChambre(cliniqueId: number, dto: CreerChambreDto): Promise<{
        typeChambre: {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            libelle: string;
            actif: boolean;
        };
        lits: {
            id: number;
            actif: boolean;
            numero: string;
            chambreId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        actif: boolean;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: Prisma.Decimal | null;
    }>;
    modifierChambre(id: number, dto: Partial<CreerChambreDto>): Promise<{
        typeChambre: {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            libelle: string;
            actif: boolean;
        };
        lits: {
            id: number;
            actif: boolean;
            numero: string;
            chambreId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        actif: boolean;
        numero: string;
        typeChambreId: number | null;
        tarifJournalier: Prisma.Decimal | null;
    }>;
    desactiverChambre(id: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
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
                createdAt: Date;
                id: number;
                cliniqueId: number;
                updatedAt: Date;
                libelle: string;
                actif: boolean;
            };
        } & {
            createdAt: Date;
            id: number;
            cliniqueId: number;
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
                prenom: string;
                code: string;
            };
        } & {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            patientId: number;
            motif: string | null;
            agentId: number | null;
            litId: number;
            passagePrestationId: number | null;
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
        consultation: {
            diagnostic: string | null;
            hospitalisation: boolean;
            createdAt: Date;
            id: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            patientId: number;
            motif: string | null;
            perimetreBrachial: string | null;
            perimetreCranien: string | null;
            medecinId: number;
            observation: string | null;
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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            patientId: number;
            motif: string | null;
            agentId: number | null;
            litId: number;
            passagePrestationId: number | null;
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
            consultation: {
                medecin: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                };
            } & {
                diagnostic: string | null;
                hospitalisation: boolean;
                createdAt: Date;
                id: number;
                statut: string;
                updatedAt: Date;
                passageId: number;
                patientId: number;
                motif: string | null;
                perimetreBrachial: string | null;
                perimetreCranien: string | null;
                medecinId: number;
                observation: string | null;
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
                    prenom: string;
                    sexe: string;
                    code: string;
                    age: string;
                };
                passage: {
                    createdAt: Date;
                    numeroOrdre: string;
                };
                lit: {
                    chambre: {
                        typeChambre: {
                            createdAt: Date;
                            id: number;
                            cliniqueId: number;
                            updatedAt: Date;
                            libelle: string;
                            actif: boolean;
                        };
                    } & {
                        createdAt: Date;
                        id: number;
                        cliniqueId: number;
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
                createdAt: Date;
                id: number;
                cliniqueId: number;
                statut: string;
                updatedAt: Date;
                passageId: number;
                patientId: number;
                motif: string | null;
                agentId: number | null;
                litId: number;
                passagePrestationId: number | null;
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
                    createdAt: Date;
                    id: number;
                    cliniqueId: number;
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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            patientId: number;
            motif: string | null;
            agentId: number | null;
            litId: number;
            passagePrestationId: number | null;
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
    admettre(passageId: number, dto: AdmissionDto, utilisateurId?: number): Promise<{
        patient: {
            id: number;
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
        lit: {
            chambre: {
                typeChambre: {
                    createdAt: Date;
                    id: number;
                    cliniqueId: number;
                    updatedAt: Date;
                    libelle: string;
                    actif: boolean;
                };
            } & {
                createdAt: Date;
                id: number;
                cliniqueId: number;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        patientId: number;
        motif: string | null;
        agentId: number | null;
        litId: number;
        passagePrestationId: number | null;
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
            id: number;
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
        lit: {
            chambre: {
                typeChambre: {
                    createdAt: Date;
                    id: number;
                    cliniqueId: number;
                    updatedAt: Date;
                    libelle: string;
                    actif: boolean;
                };
            } & {
                createdAt: Date;
                id: number;
                cliniqueId: number;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        patientId: number;
        motif: string | null;
        agentId: number | null;
        litId: number;
        passagePrestationId: number | null;
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
            id: number;
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
        lit: {
            chambre: {
                typeChambre: {
                    createdAt: Date;
                    id: number;
                    cliniqueId: number;
                    updatedAt: Date;
                    libelle: string;
                    actif: boolean;
                };
            } & {
                createdAt: Date;
                id: number;
                cliniqueId: number;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        patientId: number;
        motif: string | null;
        agentId: number | null;
        litId: number;
        passagePrestationId: number | null;
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
                id: number;
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
            lit: {
                chambre: {
                    typeChambre: {
                        createdAt: Date;
                        id: number;
                        cliniqueId: number;
                        updatedAt: Date;
                        libelle: string;
                        actif: boolean;
                    };
                } & {
                    createdAt: Date;
                    id: number;
                    cliniqueId: number;
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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            patientId: number;
            motif: string | null;
            agentId: number | null;
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
    }>;
}
