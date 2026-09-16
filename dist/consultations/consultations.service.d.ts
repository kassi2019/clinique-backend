import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreerConsultationDto, PrescriptionDto } from './dto/consultation.dto';
export declare class ConsultationsService {
    private prisma;
    constructor(prisma: PrismaService);
    rechercher(reference: string, cliniqueId: number): Promise<{
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
        };
        service: {
            nom: string;
            id: number;
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
            consultation: {
                medicaments: {
                    id: number;
                    createdAt: Date;
                    consultationId: number;
                    medicamentId: number | null;
                    medicamentNom: string;
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
            } & {
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
                hospitalisation: boolean;
                hospitalisationDuree: string | null;
                valideeLe: Date | null;
                ordonnanceSauveeLe: Date | null;
            };
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
                id: number;
                createdAt: Date;
                consultationId: number;
                medicamentId: number | null;
                medicamentNom: string;
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
        } & {
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
            hospitalisation: boolean;
            hospitalisationDuree: string | null;
            valideeLe: Date | null;
            ordonnanceSauveeLe: Date | null;
        })[];
    }>;
    creerOuMaj(passageId: number, medecinId: number, dto: CreerConsultationDto): Promise<{
        medicaments: {
            id: number;
            createdAt: Date;
            consultationId: number;
            medicamentId: number | null;
            medicamentNom: string;
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
    } & {
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
        hospitalisation: boolean;
        hospitalisationDuree: string | null;
        valideeLe: Date | null;
        ordonnanceSauveeLe: Date | null;
    }>;
    ajouterMedicament(consultationId: number, dto: PrescriptionDto): Promise<{
        id: number;
        createdAt: Date;
        consultationId: number;
        medicamentId: number | null;
        medicamentNom: string;
        forme: string | null;
        posologie: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    retirerMedicament(prescriptionId: number): Promise<{
        id: number;
        createdAt: Date;
        consultationId: number;
        medicamentId: number | null;
        medicamentNom: string;
        forme: string | null;
        posologie: string | null;
        quantite: string | null;
        duree: string | null;
    }>;
    prescrireExamens(consultationId: number, lignesIds: number[]): Promise<{
        id: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: number | null;
        prestationId: number | null;
        libelle: string;
        montant: Prisma.Decimal;
        source: string;
        paiementId: number | null;
    }[]>;
    retirerExamen(ligneId: number): Promise<{
        id: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: number | null;
        prestationId: number | null;
        libelle: string;
        montant: Prisma.Decimal;
        source: string;
        paiementId: number | null;
    }>;
    sauvegarderOrdonnance(consultationId: number): Promise<{
        medicaments: {
            id: number;
            createdAt: Date;
            consultationId: number;
            medicamentId: number | null;
            medicamentNom: string;
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
    } & {
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
        hospitalisation: boolean;
        hospitalisationDuree: string | null;
        valideeLe: Date | null;
        ordonnanceSauveeLe: Date | null;
    }>;
    valider(consultationId: number): Promise<{
        medicaments: {
            id: number;
            createdAt: Date;
            consultationId: number;
            medicamentId: number | null;
            medicamentNom: string;
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
    } & {
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
        hospitalisation: boolean;
        hospitalisationDuree: string | null;
        valideeLe: Date | null;
        ordonnanceSauveeLe: Date | null;
    }>;
}
