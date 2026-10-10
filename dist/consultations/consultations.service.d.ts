import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AffectationService } from '../affectation/affectation.service';
import { CreerConsultationDto, PrescriptionDto } from './dto/consultation.dto';
export declare class ConsultationsService {
    private prisma;
    private affectationService;
    constructor(prisma: PrismaService, affectationService: AffectationService);
    rechercher(reference: string, cliniqueId: number): Promise<{
        id: number;
        numeroOrdre: string;
        statut: string;
        typePatient: string;
        createdAt: Date;
        patient: {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            numeroDossier: string;
            creeParId: number | null;
            code: string;
            nom: string;
            prenom: string;
            age: string | null;
            dateNaissance: Date | null;
            numeroCni: string | null;
            numeroCmu: string | null;
            sexe: string | null;
            ville: string | null;
            quartier: string | null;
            profession: string | null;
            telephone: string | null;
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
            code: string;
            nom: string;
        };
        consultable: boolean;
    }[]>;
    detailPassage(passageId: number): Promise<{
        passage: {
            id: number;
            numeroOrdre: string;
            statut: string;
            typePatient: string;
            createdAt: Date;
            constantes: {
                taille: string;
                temperature: number;
                pouls: number;
                tensionGauche: string;
                tensionDroite: string;
                poids: number;
                perimetreBrachial: string;
                perimetreCranien: string;
            };
            patient: {
                id: number;
                cliniqueId: number;
                createdAt: Date;
                updatedAt: Date;
                numeroDossier: string;
                creeParId: number | null;
                code: string;
                nom: string;
                prenom: string;
                age: string | null;
                dateNaissance: Date | null;
                numeroCni: string | null;
                numeroCmu: string | null;
                sexe: string | null;
                ville: string | null;
                quartier: string | null;
                profession: string | null;
                telephone: string | null;
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
                code: string;
                nom: string;
            };
            prestations: {
                montant: number;
                service: {
                    id: number;
                    code: string;
                    nom: string;
                };
                prestation: {
                    type: string;
                };
                resultatExterne: {
                    id: number;
                    createdAt: Date;
                    nomFichier: string;
                    typeMime: string;
                    tailleOctets: number;
                    dateExamen: Date;
                    lieu: string;
                    conclusion: string;
                };
                id: number;
                serviceId: number | null;
                statut: string;
                agentId: number | null;
                createdAt: Date;
                updatedAt: Date;
                libelle: string;
                passageId: number;
                prestationId: number | null;
                source: string;
                gratuit: boolean;
                paiementId: number | null;
                creditId: number | null;
            }[];
            consultation: {
                medicaments: {
                    id: number;
                    createdAt: Date;
                    consultationId: number;
                    ordonnanceId: number | null;
                    medicamentId: number | null;
                    medicamentNom: string;
                    prixUnitaire: Prisma.Decimal | null;
                    forme: string | null;
                    posologie: string | null;
                    quantite: string | null;
                    duree: string | null;
                }[];
                medecin: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                    matricule: string;
                };
                ordonnances: {
                    id: number;
                    cliniqueId: number;
                    statut: string;
                    createdAt: Date;
                    updatedAt: Date;
                    consultationId: number;
                    numero: string;
                    sauveeLe: Date | null;
                }[];
            } & {
                id: number;
                patientId: number;
                motif: string | null;
                statut: string;
                perimetreBrachial: string | null;
                perimetreCranien: string | null;
                createdAt: Date;
                updatedAt: Date;
                hospitalisation: boolean;
                passageId: number;
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
                chirurgie: boolean | null;
                prescriptionMedicaments: boolean | null;
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
                tauxHemoglobine: string | null;
                testSyphilis: string | null;
                testHepatite: string | null;
                autresExamens: string | null;
                conduiteTenir: string | null;
                issueSortie: string | null;
                casPresumeTB: string | null;
                moDureeHeures: number | null;
                moDureeMinutes: number | null;
                moDebut: Date | null;
                moFin: Date | null;
            };
            examensLabo: ({
                lignes: {
                    id: number;
                    parametre: string;
                    examenLaboId: number;
                    valeur: string | null;
                    unite: string | null;
                    normes: string | null;
                }[];
                validePar: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                    matricule: string;
                };
            } & {
                id: number;
                cliniqueId: number;
                patientId: number;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                libelle: string;
                passageId: number;
                passagePrestationId: number;
                conclusion: string | null;
                preleveParId: number | null;
                preleveLe: Date | null;
                valideParId: number | null;
                valideLe: Date | null;
            })[];
            examensImagerie: ({
                validePar: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                    matricule: string;
                };
            } & {
                id: number;
                cliniqueId: number;
                patientId: number;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                libelle: string;
                passageId: number;
                indication: string | null;
                passagePrestationId: number;
                conclusion: string | null;
                valideParId: number | null;
                valideLe: Date | null;
                saisiParId: number | null;
                technique: string | null;
                resultat: string | null;
            })[];
            fiches: {
                id: number;
                createdAt: Date;
                libelleType: string;
                texte: string;
                indication: string;
                prescripteur: string;
                medecin: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                };
            }[];
        };
        historique: ({
            passage: {
                numeroOrdre: string;
                taille: string;
                temperature: Prisma.Decimal;
                pouls: number;
                tensionGauche: string;
                tensionDroite: string;
                poids: Prisma.Decimal;
                createdAt: Date;
                service: {
                    nom: string;
                };
                prestations: {
                    id: number;
                    statut: string;
                    createdAt: Date;
                    libelle: string;
                    prestation: {
                        type: string;
                    };
                    examenLabo: {
                        id: number;
                    };
                    examenImagerie: {
                        id: number;
                    };
                    resultatExterne: {
                        id: number;
                        createdAt: Date;
                        nomFichier: string;
                        typeMime: string;
                        tailleOctets: number;
                        dateExamen: Date;
                        lieu: string;
                        conclusion: string;
                    };
                }[];
                examensLabo: ({
                    lignes: {
                        id: number;
                        parametre: string;
                        examenLaboId: number;
                        valeur: string | null;
                        unite: string | null;
                        normes: string | null;
                    }[];
                    validePar: {
                        personnel: {
                            nom: string;
                            prenom: string;
                        };
                        matricule: string;
                    };
                } & {
                    id: number;
                    cliniqueId: number;
                    patientId: number;
                    statut: string;
                    createdAt: Date;
                    updatedAt: Date;
                    libelle: string;
                    passageId: number;
                    passagePrestationId: number;
                    conclusion: string | null;
                    preleveParId: number | null;
                    preleveLe: Date | null;
                    valideParId: number | null;
                    valideLe: Date | null;
                })[];
                examensImagerie: ({
                    validePar: {
                        personnel: {
                            nom: string;
                            prenom: string;
                        };
                        matricule: string;
                    };
                } & {
                    id: number;
                    cliniqueId: number;
                    patientId: number;
                    statut: string;
                    createdAt: Date;
                    updatedAt: Date;
                    libelle: string;
                    passageId: number;
                    indication: string | null;
                    passagePrestationId: number;
                    conclusion: string | null;
                    valideParId: number | null;
                    valideLe: Date | null;
                    saisiParId: number | null;
                    technique: string | null;
                    resultat: string | null;
                })[];
                fichesExamenImagerie: {
                    id: number;
                    createdAt: Date;
                    libelleType: string;
                    texte: string;
                    valeurs: string;
                }[];
            };
            medicaments: {
                id: number;
                createdAt: Date;
                consultationId: number;
                ordonnanceId: number | null;
                medicamentId: number | null;
                medicamentNom: string;
                prixUnitaire: Prisma.Decimal | null;
                forme: string | null;
                posologie: string | null;
                quantite: string | null;
                duree: string | null;
            }[];
            medecin: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
            ordonnances: {
                id: number;
                cliniqueId: number;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                consultationId: number;
                numero: string;
                sauveeLe: Date | null;
            }[];
        } & {
            id: number;
            patientId: number;
            motif: string | null;
            statut: string;
            perimetreBrachial: string | null;
            perimetreCranien: string | null;
            createdAt: Date;
            updatedAt: Date;
            hospitalisation: boolean;
            passageId: number;
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
            chirurgie: boolean | null;
            prescriptionMedicaments: boolean | null;
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
            tauxHemoglobine: string | null;
            testSyphilis: string | null;
            testHepatite: string | null;
            autresExamens: string | null;
            conduiteTenir: string | null;
            issueSortie: string | null;
            casPresumeTB: string | null;
            moDureeHeures: number | null;
            moDureeMinutes: number | null;
            moDebut: Date | null;
            moFin: Date | null;
        })[];
    }>;
    creerOuMaj(passageId: number, medecinId: number, dto: CreerConsultationDto): Promise<{
        medicaments: {
            id: number;
            createdAt: Date;
            consultationId: number;
            ordonnanceId: number | null;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: Prisma.Decimal | null;
            forme: string | null;
            posologie: string | null;
            quantite: string | null;
            duree: string | null;
        }[];
        medecin: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        ordonnances: {
            id: number;
            cliniqueId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            consultationId: number;
            numero: string;
            sauveeLe: Date | null;
        }[];
    } & {
        id: number;
        patientId: number;
        motif: string | null;
        statut: string;
        perimetreBrachial: string | null;
        perimetreCranien: string | null;
        createdAt: Date;
        updatedAt: Date;
        hospitalisation: boolean;
        passageId: number;
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
        chirurgie: boolean | null;
        prescriptionMedicaments: boolean | null;
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
        tauxHemoglobine: string | null;
        testSyphilis: string | null;
        testHepatite: string | null;
        autresExamens: string | null;
        conduiteTenir: string | null;
        issueSortie: string | null;
        casPresumeTB: string | null;
        moDureeHeures: number | null;
        moDureeMinutes: number | null;
        moDebut: Date | null;
        moFin: Date | null;
    }>;
    private synchroniserFactureHospitalisation;
    private synchroniserAutresExamens;
    private synchroniserTestsOrdonnance;
    private produitTest;
    private creerOrdonnance;
    private ordonnanceEnCours;
    nouvelleOrdonnance(consultationId: number): Promise<{
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: number;
        numero: string;
        sauveeLe: Date | null;
    }>;
    ajouterMedicament(consultationId: number, dto: PrescriptionDto): Promise<{
        id: number;
        createdAt: Date;
        consultationId: number;
        ordonnanceId: number | null;
        medicamentId: number | null;
        medicamentNom: string;
        prixUnitaire: Prisma.Decimal | null;
        forme: string | null;
        posologie: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    retirerMedicament(prescriptionId: number): Promise<{
        id: number;
        createdAt: Date;
        consultationId: number;
        ordonnanceId: number | null;
        medicamentId: number | null;
        medicamentNom: string;
        prixUnitaire: Prisma.Decimal | null;
        forme: string | null;
        posologie: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    prescrireExamens(consultationId: number, lignesIds: number[]): Promise<{
        id: number;
        serviceId: number | null;
        statut: string;
        agentId: number | null;
        createdAt: Date;
        updatedAt: Date;
        libelle: string;
        montant: Prisma.Decimal;
        passageId: number;
        prestationId: number | null;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }[]>;
    ajouterExamen(consultationId: number, dto: {
        prestationId?: number;
        libelle?: string;
    }, utilisateurId?: number): Promise<{
        id: number;
        serviceId: number | null;
        statut: string;
        agentId: number | null;
        createdAt: Date;
        updatedAt: Date;
        libelle: string;
        montant: Prisma.Decimal;
        passageId: number;
        prestationId: number | null;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }>;
    retirerExamen(ligneId: number): Promise<{
        id: number;
        serviceId: number | null;
        statut: string;
        agentId: number | null;
        createdAt: Date;
        updatedAt: Date;
        libelle: string;
        montant: Prisma.Decimal;
        passageId: number;
        prestationId: number | null;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }>;
    joindreResultatExterne(ligneId: number, dto: {
        nomFichier?: string;
        contenu?: string;
        dateExamen?: string;
        lieu?: string;
        conclusion?: string;
    }, utilisateurId?: number): Promise<{
        id: number;
        createdAt: Date;
        nomFichier: string;
        typeMime: string;
        tailleOctets: number;
        dateExamen: Date;
        lieu: string;
        conclusion: string;
    }>;
    resultatExterne(ligneId: number): Promise<{
        ligne: {
            libelle: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        passagePrestationId: number;
        nomFichier: string;
        typeMime: string;
        contenu: string;
        tailleOctets: number;
        dateExamen: Date | null;
        lieu: string | null;
        conclusion: string | null;
        utilisateurId: number | null;
    }>;
    supprimerResultatExterne(ligneId: number): Promise<{
        ok: boolean;
    }>;
    sauvegarderOrdonnance(consultationId: number): Promise<{
        medicaments: {
            id: number;
            createdAt: Date;
            consultationId: number;
            ordonnanceId: number | null;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: Prisma.Decimal | null;
            forme: string | null;
            posologie: string | null;
            quantite: string | null;
            duree: string | null;
        }[];
        medecin: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        ordonnances: {
            id: number;
            cliniqueId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            consultationId: number;
            numero: string;
            sauveeLe: Date | null;
        }[];
    } & {
        id: number;
        patientId: number;
        motif: string | null;
        statut: string;
        perimetreBrachial: string | null;
        perimetreCranien: string | null;
        createdAt: Date;
        updatedAt: Date;
        hospitalisation: boolean;
        passageId: number;
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
        chirurgie: boolean | null;
        prescriptionMedicaments: boolean | null;
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
        tauxHemoglobine: string | null;
        testSyphilis: string | null;
        testHepatite: string | null;
        autresExamens: string | null;
        conduiteTenir: string | null;
        issueSortie: string | null;
        casPresumeTB: string | null;
        moDureeHeures: number | null;
        moDureeMinutes: number | null;
        moDebut: Date | null;
        moFin: Date | null;
    }>;
    enregistrerCertificat(consultationId: number, dto: {
        civilite: string;
        nomPatient: string;
        dateNaissance?: string;
        profession?: string;
        dureeJours: number;
        debut: string;
        fin: string;
        medecin: string;
        lieu?: string;
    }, medecinId: number): Promise<{
        id: number;
        cliniqueId: number;
        patientId: number;
        createdAt: Date;
        dateNaissance: string | null;
        profession: string | null;
        passageId: number;
        medecinId: number | null;
        medecin: string;
        consultationId: number;
        numero: string;
        lieu: string | null;
        civilite: string;
        nomPatient: string;
        dureeJours: number;
        debut: Date;
        fin: Date;
    }>;
    certificatsArret(consultationId: number): Promise<{
        id: number;
        cliniqueId: number;
        patientId: number;
        createdAt: Date;
        dateNaissance: string | null;
        profession: string | null;
        passageId: number;
        medecinId: number | null;
        medecin: string;
        consultationId: number;
        numero: string;
        lieu: string | null;
        civilite: string;
        nomPatient: string;
        dureeJours: number;
        debut: Date;
        fin: Date;
    }[]>;
    changerDisponibilite(utilisateurId: number, disponibilite: 'DISPONIBLE' | 'INDISPONIBLE'): Promise<{
        disponibilite: string;
    }>;
    ping(utilisateurId: number): Promise<{
        ok: boolean;
    }>;
    maFile(utilisateurId: number, jour?: string): Promise<{
        disponibilite: string;
        enAttente: ({
            passage: {
                id: number;
                numeroOrdre: string;
                statut: string;
                createdAt: Date;
                patient: {
                    code: string;
                    nom: string;
                    prenom: string;
                    age: string;
                    sexe: string;
                };
                service: {
                    nom: string;
                };
            };
        } & {
            id: number;
            cliniqueId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            medecinId: number | null;
            dateAffectation: Date;
        })[];
        terminees: ({
            passage: {
                id: number;
                numeroOrdre: string;
                patient: {
                    code: string;
                    nom: string;
                    prenom: string;
                    age: string;
                    sexe: string;
                };
                consultations: {
                    statut: string;
                    valideeLe: Date;
                }[];
            };
        } & {
            id: number;
            cliniqueId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            medecinId: number | null;
            dateAffectation: Date;
        })[];
    }>;
    ouvrirAffectation(affectationId: number): Promise<{
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    fermerAffectation(affectationId: number): Promise<{
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    valider(consultationId: number): Promise<{
        medicaments: {
            id: number;
            createdAt: Date;
            consultationId: number;
            ordonnanceId: number | null;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: Prisma.Decimal | null;
            forme: string | null;
            posologie: string | null;
            quantite: string | null;
            duree: string | null;
        }[];
        medecin: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        ordonnances: {
            id: number;
            cliniqueId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            consultationId: number;
            numero: string;
            sauveeLe: Date | null;
        }[];
    } & {
        id: number;
        patientId: number;
        motif: string | null;
        statut: string;
        perimetreBrachial: string | null;
        perimetreCranien: string | null;
        createdAt: Date;
        updatedAt: Date;
        hospitalisation: boolean;
        passageId: number;
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
        chirurgie: boolean | null;
        prescriptionMedicaments: boolean | null;
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
        tauxHemoglobine: string | null;
        testSyphilis: string | null;
        testHepatite: string | null;
        autresExamens: string | null;
        conduiteTenir: string | null;
        issueSortie: string | null;
        casPresumeTB: string | null;
        moDureeHeures: number | null;
        moDureeMinutes: number | null;
        moDebut: Date | null;
        moFin: Date | null;
    }>;
}
