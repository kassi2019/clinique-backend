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
                resultatExterne: {
                    createdAt: Date;
                    id: number;
                    nomFichier: string;
                    typeMime: string;
                    tailleOctets: number;
                    dateExamen: Date;
                    lieu: string;
                    conclusion: string;
                };
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
            consultation: {
                medicaments: {
                    posologie: string | null;
                    createdAt: Date;
                    id: number;
                    consultationId: number;
                    ordonnanceId: number | null;
                    medicamentId: number | null;
                    medicamentNom: string;
                    prixUnitaire: Prisma.Decimal | null;
                    forme: string | null;
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
                    createdAt: Date;
                    id: number;
                    cliniqueId: number;
                    statut: string;
                    updatedAt: Date;
                    consultationId: number;
                    numero: string;
                    sauveeLe: Date | null;
                }[];
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
                    parametre: string;
                    id: number;
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
            examensImagerie: ({
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
            fiches: {
                createdAt: Date;
                id: number;
                medecin: {
                    personnel: {
                        nom: string;
                        prenom: string;
                    };
                };
                libelleType: string;
                texte: string;
                indication: string;
                prescripteur: string;
            }[];
        };
        historique: ({
            passage: {
                service: {
                    nom: string;
                };
                createdAt: Date;
                fichesExamenImagerie: {
                    createdAt: Date;
                    id: number;
                    libelleType: string;
                    texte: string;
                    valeurs: string;
                }[];
                prestations: {
                    resultatExterne: {
                        createdAt: Date;
                        id: number;
                        nomFichier: string;
                        typeMime: string;
                        tailleOctets: number;
                        dateExamen: Date;
                        lieu: string;
                        conclusion: string;
                    };
                    examenLabo: {
                        id: number;
                    };
                    examenImagerie: {
                        id: number;
                    };
                    prestation: {
                        type: string;
                    };
                    createdAt: Date;
                    id: number;
                    statut: string;
                    libelle: string;
                }[];
                examensLabo: ({
                    lignes: {
                        parametre: string;
                        id: number;
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
                examensImagerie: ({
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
                numeroOrdre: string;
                taille: string;
                temperature: Prisma.Decimal;
                pouls: number;
                tensionGauche: string;
                tensionDroite: string;
                poids: Prisma.Decimal;
            };
            medicaments: {
                posologie: string | null;
                createdAt: Date;
                id: number;
                consultationId: number;
                ordonnanceId: number | null;
                medicamentId: number | null;
                medicamentNom: string;
                prixUnitaire: Prisma.Decimal | null;
                forme: string | null;
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
                createdAt: Date;
                id: number;
                cliniqueId: number;
                statut: string;
                updatedAt: Date;
                consultationId: number;
                numero: string;
                sauveeLe: Date | null;
            }[];
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
            posologie: string | null;
            createdAt: Date;
            id: number;
            consultationId: number;
            ordonnanceId: number | null;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: Prisma.Decimal | null;
            forme: string | null;
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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            consultationId: number;
            numero: string;
            sauveeLe: Date | null;
        }[];
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        consultationId: number;
        numero: string;
        sauveeLe: Date | null;
    }>;
    ajouterMedicament(consultationId: number, dto: PrescriptionDto): Promise<{
        posologie: string | null;
        createdAt: Date;
        id: number;
        consultationId: number;
        ordonnanceId: number | null;
        medicamentId: number | null;
        medicamentNom: string;
        prixUnitaire: Prisma.Decimal | null;
        forme: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    retirerMedicament(prescriptionId: number): Promise<{
        posologie: string | null;
        createdAt: Date;
        id: number;
        consultationId: number;
        ordonnanceId: number | null;
        medicamentId: number | null;
        medicamentNom: string;
        prixUnitaire: Prisma.Decimal | null;
        forme: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    prescrireExamens(consultationId: number, lignesIds: number[]): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        serviceId: number | null;
        libelle: string;
        passageId: number;
        agentId: number | null;
        prestationId: number | null;
        montant: Prisma.Decimal;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }[]>;
    ajouterExamen(consultationId: number, dto: {
        prestationId?: number;
        libelle?: string;
    }, utilisateurId?: number): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        serviceId: number | null;
        libelle: string;
        passageId: number;
        agentId: number | null;
        prestationId: number | null;
        montant: Prisma.Decimal;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }>;
    retirerExamen(ligneId: number): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        serviceId: number | null;
        libelle: string;
        passageId: number;
        agentId: number | null;
        prestationId: number | null;
        montant: Prisma.Decimal;
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
        createdAt: Date;
        id: number;
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
        createdAt: Date;
        id: number;
        utilisateurId: number | null;
        updatedAt: Date;
        contenu: string;
        passagePrestationId: number;
        nomFichier: string;
        typeMime: string;
        tailleOctets: number;
        dateExamen: Date | null;
        lieu: string | null;
        conclusion: string | null;
    }>;
    supprimerResultatExterne(ligneId: number): Promise<{
        ok: boolean;
    }>;
    sauvegarderOrdonnance(consultationId: number): Promise<{
        medicaments: {
            posologie: string | null;
            createdAt: Date;
            id: number;
            consultationId: number;
            ordonnanceId: number | null;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: Prisma.Decimal | null;
            forme: string | null;
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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            consultationId: number;
            numero: string;
            sauveeLe: Date | null;
        }[];
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
        profession: string | null;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        passageId: number;
        patientId: number;
        dateNaissance: string | null;
        medecinId: number | null;
        medecin: string;
        consultationId: number;
        debut: Date;
        fin: Date;
        numero: string;
        lieu: string | null;
        civilite: string;
        nomPatient: string;
        dureeJours: number;
    }>;
    certificatsArret(consultationId: number): Promise<{
        profession: string | null;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        passageId: number;
        patientId: number;
        dateNaissance: string | null;
        medecinId: number | null;
        medecin: string;
        consultationId: number;
        debut: Date;
        fin: Date;
        numero: string;
        lieu: string | null;
        civilite: string;
        nomPatient: string;
        dureeJours: number;
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
                patient: {
                    nom: string;
                    prenom: string;
                    sexe: string;
                    code: string;
                    age: string;
                };
                service: {
                    nom: string;
                };
                createdAt: Date;
                id: number;
                statut: string;
                numeroOrdre: string;
            };
        } & {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            medecinId: number | null;
            dateAffectation: Date;
        })[];
        terminees: ({
            passage: {
                patient: {
                    nom: string;
                    prenom: string;
                    sexe: string;
                    code: string;
                    age: string;
                };
                id: number;
                consultations: {
                    statut: string;
                    valideeLe: Date;
                }[];
                numeroOrdre: string;
            };
        } & {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            medecinId: number | null;
            dateAffectation: Date;
        })[];
    }>;
    ouvrirAffectation(affectationId: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    fermerAffectation(affectationId: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    valider(consultationId: number): Promise<{
        medicaments: {
            posologie: string | null;
            createdAt: Date;
            id: number;
            consultationId: number;
            ordonnanceId: number | null;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: Prisma.Decimal | null;
            forme: string | null;
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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            consultationId: number;
            numero: string;
            sauveeLe: Date | null;
        }[];
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
