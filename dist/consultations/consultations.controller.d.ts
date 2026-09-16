import { ConsultationsService } from './consultations.service';
import { CreerConsultationDto, PrescriptionDto, PrescrireExamensDto } from './dto/consultation.dto';
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
    creerOuMaj(id: number, dto: CreerConsultationDto, req: any): Promise<{
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
    ajouterMedicament(id: number, dto: PrescriptionDto): Promise<{
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
    retirerMedicament(id: number): Promise<{
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
    prescrireExamens(id: number, dto: PrescrireExamensDto): Promise<{
        id: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: number | null;
        prestationId: number | null;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        source: string;
        paiementId: number | null;
    }[]>;
    retirerExamen(id: number): Promise<{
        id: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: number | null;
        prestationId: number | null;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        source: string;
        paiementId: number | null;
    }>;
    sauvegarderOrdonnance(id: number): Promise<{
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
    valider(id: number): Promise<{
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
