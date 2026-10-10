import { ConsultationsService } from './consultations.service';
import { CreerConsultationDto, PrescriptionDto, PrescrireExamenDto, PrescrireExamensDto } from './dto/consultation.dto';
export declare class ConsultationsController {
    private consultationsService;
    constructor(consultationsService: ConsultationsService);
    rechercher(code?: string, cliniqueId?: number): any[] | Promise<{
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
    detail(id: number): Promise<{
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
                    prixUnitaire: import("@prisma/client/runtime/library").Decimal | null;
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
                temperature: import("@prisma/client/runtime/library").Decimal;
                pouls: number;
                tensionGauche: string;
                tensionDroite: string;
                poids: import("@prisma/client/runtime/library").Decimal;
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
                prixUnitaire: import("@prisma/client/runtime/library").Decimal | null;
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
    creerOuMaj(id: number, dto: CreerConsultationDto, req: any): Promise<{
        medicaments: {
            id: number;
            createdAt: Date;
            consultationId: number;
            ordonnanceId: number | null;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: import("@prisma/client/runtime/library").Decimal | null;
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
    ajouterMedicament(id: number, dto: PrescriptionDto): Promise<{
        id: number;
        createdAt: Date;
        consultationId: number;
        ordonnanceId: number | null;
        medicamentId: number | null;
        medicamentNom: string;
        prixUnitaire: import("@prisma/client/runtime/library").Decimal | null;
        forme: string | null;
        posologie: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    retirerMedicament(id: number): Promise<{
        id: number;
        createdAt: Date;
        consultationId: number;
        ordonnanceId: number | null;
        medicamentId: number | null;
        medicamentNom: string;
        prixUnitaire: import("@prisma/client/runtime/library").Decimal | null;
        forme: string | null;
        posologie: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    prescrireExamens(id: number, dto: PrescrireExamensDto): Promise<{
        id: number;
        serviceId: number | null;
        statut: string;
        agentId: number | null;
        createdAt: Date;
        updatedAt: Date;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        passageId: number;
        prestationId: number | null;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }[]>;
    ajouterExamen(id: number, dto: PrescrireExamenDto, req: any): Promise<{
        id: number;
        serviceId: number | null;
        statut: string;
        agentId: number | null;
        createdAt: Date;
        updatedAt: Date;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        passageId: number;
        prestationId: number | null;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }>;
    retirerExamen(id: number): Promise<{
        id: number;
        serviceId: number | null;
        statut: string;
        agentId: number | null;
        createdAt: Date;
        updatedAt: Date;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        passageId: number;
        prestationId: number | null;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }>;
    joindreResultatExterne(id: number, dto: {
        nomFichier?: string;
        contenu?: string;
        dateExamen?: string;
        lieu?: string;
        conclusion?: string;
    }, req: any): Promise<{
        id: number;
        createdAt: Date;
        nomFichier: string;
        typeMime: string;
        tailleOctets: number;
        dateExamen: Date;
        lieu: string;
        conclusion: string;
    }>;
    resultatExterne(id: number): Promise<{
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
    supprimerResultatExterne(id: number): Promise<{
        ok: boolean;
    }>;
    nouvelleOrdonnance(id: number): Promise<{
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: number;
        numero: string;
        sauveeLe: Date | null;
    }>;
    sauvegarderOrdonnance(id: number): Promise<{
        medicaments: {
            id: number;
            createdAt: Date;
            consultationId: number;
            ordonnanceId: number | null;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: import("@prisma/client/runtime/library").Decimal | null;
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
    enregistrerCertificat(id: number, dto: {
        civilite: string;
        nomPatient: string;
        dateNaissance?: string;
        profession?: string;
        dureeJours: number;
        debut: string;
        fin: string;
        medecin: string;
        lieu?: string;
    }, req: any): Promise<{
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
    certificatsArret(id: number): Promise<{
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
    valider(id: number): Promise<{
        medicaments: {
            id: number;
            createdAt: Date;
            consultationId: number;
            ordonnanceId: number | null;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: import("@prisma/client/runtime/library").Decimal | null;
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
    changerDisponibilite(dto: {
        disponibilite: string;
    }, req: any): Promise<{
        disponibilite: string;
    }>;
    ping(req: any): Promise<{
        ok: boolean;
    }>;
    maFile(req: any, jour?: string): Promise<{
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
    ouvrirAffectation(id: number): Promise<{
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    fermerAffectation(id: number): Promise<{
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
}
