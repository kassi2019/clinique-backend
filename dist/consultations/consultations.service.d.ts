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
            };
            patient: {
                nationalite: string | null;
                profession: string | null;
                quartier: string | null;
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
                id: number;
                libelle: string;
                createdAt: Date;
                updatedAt: Date;
                passageId: number;
                statut: string;
                serviceId: number | null;
                prestationId: number | null;
                source: string;
                paiementId: number | null;
            }[];
            consultation: {
                medicaments: {
                    posologie: string | null;
                    id: number;
                    createdAt: Date;
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
                id: number;
                createdAt: Date;
                updatedAt: Date;
                passageId: number;
                statut: string;
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
                id: number;
                cliniqueId: number;
                libelle: string;
                createdAt: Date;
                updatedAt: Date;
                passageId: number;
                statut: string;
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
                id: number;
                cliniqueId: number;
                libelle: string;
                createdAt: Date;
                updatedAt: Date;
                passageId: number;
                statut: string;
                patientId: number;
                passagePrestationId: number;
                conclusion: string | null;
                valideParId: number | null;
                valideLe: Date | null;
                indication: string | null;
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
            medicaments: {
                posologie: string | null;
                id: number;
                createdAt: Date;
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
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
    creerOuMaj(passageId: number, medecinId: number, dto: CreerConsultationDto): Promise<{
        medicaments: {
            posologie: string | null;
            id: number;
            createdAt: Date;
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
        id: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
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
    private synchroniserFactureHospitalisation;
    ajouterMedicament(consultationId: number, dto: PrescriptionDto): Promise<{
        posologie: string | null;
        id: number;
        createdAt: Date;
        consultationId: number;
        medicamentId: number | null;
        medicamentNom: string;
        forme: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    retirerMedicament(prescriptionId: number): Promise<{
        posologie: string | null;
        id: number;
        createdAt: Date;
        consultationId: number;
        medicamentId: number | null;
        medicamentNom: string;
        forme: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    prescrireExamens(consultationId: number, lignesIds: number[]): Promise<{
        id: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        serviceId: number | null;
        prestationId: number | null;
        montant: Prisma.Decimal;
        source: string;
        paiementId: number | null;
    }[]>;
    ajouterExamen(consultationId: number, dto: {
        prestationId?: number;
        libelle?: string;
    }): Promise<{
        id: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        serviceId: number | null;
        prestationId: number | null;
        montant: Prisma.Decimal;
        source: string;
        paiementId: number | null;
    }>;
    retirerExamen(ligneId: number): Promise<{
        id: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        serviceId: number | null;
        prestationId: number | null;
        montant: Prisma.Decimal;
        source: string;
        paiementId: number | null;
    }>;
    sauvegarderOrdonnance(consultationId: number): Promise<{
        medicaments: {
            posologie: string | null;
            id: number;
            createdAt: Date;
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
        id: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
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
                    code: string;
                    prenom: string;
                    sexe: string;
                    age: string;
                };
                service: {
                    nom: string;
                };
                id: number;
                createdAt: Date;
                statut: string;
                numeroOrdre: string;
            };
        } & {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
            medecinId: number | null;
            dateAffectation: Date;
        })[];
        terminees: ({
            passage: {
                patient: {
                    nom: string;
                    code: string;
                    prenom: string;
                    sexe: string;
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
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            statut: string;
            medecinId: number | null;
            dateAffectation: Date;
        })[];
    }>;
    ouvrirAffectation(affectationId: number): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    fermerAffectation(affectationId: number): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    valider(consultationId: number): Promise<{
        medicaments: {
            posologie: string | null;
            id: number;
            createdAt: Date;
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
        id: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
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
}
