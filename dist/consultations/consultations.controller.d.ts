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
            consultation: {
                medicaments: {
                    posologie: string | null;
                    createdAt: Date;
                    id: number;
                    consultationId: number;
                    medicamentId: number | null;
                    medicamentNom: string;
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
                preleveParId: number | null;
                preleveLe: Date | null;
                conclusion: string | null;
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
                    preleveParId: number | null;
                    preleveLe: Date | null;
                    conclusion: string | null;
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
                    indication: string | null;
                    passagePrestationId: number;
                    conclusion: string | null;
                    valideParId: number | null;
                    valideLe: Date | null;
                    saisiParId: number | null;
                    technique: string | null;
                    resultat: string | null;
                })[];
                numeroOrdre: string;
            };
            medicaments: {
                posologie: string | null;
                createdAt: Date;
                id: number;
                consultationId: number;
                medicamentId: number | null;
                medicamentNom: string;
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
        })[];
    }>;
    creerOuMaj(id: number, dto: CreerConsultationDto, req: any): Promise<{
        medicaments: {
            posologie: string | null;
            createdAt: Date;
            id: number;
            consultationId: number;
            medicamentId: number | null;
            medicamentNom: string;
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
    }>;
    ajouterMedicament(id: number, dto: PrescriptionDto): Promise<{
        posologie: string | null;
        createdAt: Date;
        id: number;
        consultationId: number;
        medicamentId: number | null;
        medicamentNom: string;
        forme: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    retirerMedicament(id: number): Promise<{
        posologie: string | null;
        createdAt: Date;
        id: number;
        consultationId: number;
        medicamentId: number | null;
        medicamentNom: string;
        forme: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    prescrireExamens(id: number, dto: PrescrireExamensDto): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        serviceId: number | null;
        libelle: string;
        passageId: number;
        agentId: number | null;
        prestationId: number | null;
        montant: import("@prisma/client/runtime/library").Decimal;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }[]>;
    ajouterExamen(id: number, dto: PrescrireExamenDto, req: any): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        serviceId: number | null;
        libelle: string;
        passageId: number;
        agentId: number | null;
        prestationId: number | null;
        montant: import("@prisma/client/runtime/library").Decimal;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }>;
    retirerExamen(id: number): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        serviceId: number | null;
        libelle: string;
        passageId: number;
        agentId: number | null;
        prestationId: number | null;
        montant: import("@prisma/client/runtime/library").Decimal;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }>;
    sauvegarderOrdonnance(id: number): Promise<{
        medicaments: {
            posologie: string | null;
            createdAt: Date;
            id: number;
            consultationId: number;
            medicamentId: number | null;
            medicamentNom: string;
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
        civilite: string;
        nomPatient: string;
        dureeJours: number;
        lieu: string | null;
    }>;
    certificatsArret(id: number): Promise<{
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
        civilite: string;
        nomPatient: string;
        dureeJours: number;
        lieu: string | null;
    }[]>;
    valider(id: number): Promise<{
        medicaments: {
            posologie: string | null;
            createdAt: Date;
            id: number;
            consultationId: number;
            medicamentId: number | null;
            medicamentNom: string;
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
    ouvrirAffectation(id: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    fermerAffectation(id: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
}
