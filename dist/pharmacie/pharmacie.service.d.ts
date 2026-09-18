import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class PharmacieService {
    private prisma;
    private impressionService;
    private readonly logger;
    constructor(prisma: PrismaService, impressionService: ImpressionService);
    rechercherOrdonnances(reference: string, cliniqueId: number): Promise<{
        id: number;
        numeroOrdre: string;
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
        consultations: {
            id: number;
            statut: string;
            valideeLe: Date;
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
            dispensations: {
                montantTotal: number;
                lignes: {
                    montant: number;
                    prixUnitaire: number;
                    id: number;
                    medicamentId: number | null;
                    medicamentNom: string;
                    dispensationId: number;
                    prescriptionId: number | null;
                    quantitePrescrite: string | null;
                    quantiteDelivree: number;
                    uniteVente: string | null;
                }[];
                paiement: {
                    montantTotal: number;
                    id: number;
                    caissierId: number;
                    numeroRecu: string;
                    modePaiement: string;
                    statut: string;
                    motifAnnulation: string | null;
                    dateAnnulation: Date | null;
                    createdAt: Date;
                    dispensationId: number;
                };
                id: number;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                consultationId: number;
                pharmacienId: number;
                clotureeLe: Date | null;
            }[];
        }[];
    }[]>;
    detailOrdonnance(consultationId: number): Promise<{
        consultation: {
            id: number;
            statut: string;
            valideeLe: Date;
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
            };
            medecin: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
        };
        prescriptions: {
            id: number;
            medicamentNom: string;
            forme: string;
            posologie: string;
            quantite: string;
            duree: string;
            medicament: {
                id: number;
                stock: number;
                prixVente: number;
                uniteVente: string;
                lots: {
                    id: number;
                    numeroLot: string;
                    quantiteRestante: number;
                    datePeremption: Date;
                }[];
            };
        }[];
        dispensations: {
            montantTotal: number;
            lignes: {
                prixUnitaire: number;
                montant: number;
                id: number;
                medicamentId: number | null;
                medicamentNom: string;
                dispensationId: number;
                prescriptionId: number | null;
                quantitePrescrite: string | null;
                quantiteDelivree: number;
                uniteVente: string | null;
            }[];
            paiement: {
                montantTotal: number;
                id: number;
                caissierId: number;
                numeroRecu: string;
                modePaiement: string;
                statut: string;
                motifAnnulation: string | null;
                dateAnnulation: Date | null;
                createdAt: Date;
                dispensationId: number;
            };
            pharmacien: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
            };
            id: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            consultationId: number;
            pharmacienId: number;
            clotureeLe: Date | null;
        }[];
    }>;
    dispenser(consultationId: number, lignes: {
        prescriptionId: number;
        quantiteDelivree: number;
    }[], pharmacienId: number): Promise<{
        paiement: {
            id: number;
            caissierId: number;
            numeroRecu: string;
            montantTotal: import("@prisma/client/runtime/library").Decimal;
            modePaiement: string;
            statut: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
            createdAt: Date;
            dispensationId: number;
        };
        lignes: {
            id: number;
            montant: import("@prisma/client/runtime/library").Decimal;
            medicamentId: number | null;
            medicamentNom: string;
            dispensationId: number;
            prescriptionId: number | null;
            quantitePrescrite: string | null;
            quantiteDelivree: number;
            uniteVente: string | null;
            prixUnitaire: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: number;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: number;
        pharmacienId: number;
        clotureeLe: Date | null;
    }>;
    cloturer(dispensationId: number): Promise<{
        id: number;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: number;
        pharmacienId: number;
        clotureeLe: Date | null;
    }>;
    payer(dispensationId: number, modePaiement: string, caissierId: number): Promise<{
        paiement: {
            montantTotal: number;
            id: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            statut: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
            createdAt: Date;
            dispensationId: number;
        };
        lignes: {
            id: number;
            medicamentNom: string;
            quantiteDelivree: number;
            prixUnitaire: number;
            montant: number;
        }[];
        impression: any;
    }>;
    annulerPaiement(paiementId: number, motif: string): Promise<{
        id: number;
        caissierId: number;
        numeroRecu: string;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        modePaiement: string;
        statut: string;
        motifAnnulation: string | null;
        dateAnnulation: Date | null;
        createdAt: Date;
        dispensationId: number;
    }>;
    stocks(cliniqueId: number, search?: string): Promise<{
        prixVente: number;
        lots: {
            datePeremption: Date;
            perime: boolean;
            peremptionProche: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            medicamentId: number;
            numeroLot: string;
            quantiteInitiale: number;
            quantiteRestante: number;
            prixAchat: import("@prisma/client/runtime/library").Decimal | null;
        }[];
        alerteStock: boolean;
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
    }[]>;
    entrerStock(dto: {
        medicamentId: number;
        numeroLot: string;
        quantite: number;
        datePeremption: string;
        prixAchat?: number;
    }, utilisateurId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        medicamentId: number;
        datePeremption: Date;
        numeroLot: string;
        quantiteInitiale: number;
        quantiteRestante: number;
        prixAchat: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    inventaire(dto: {
        medicamentId: number;
        quantiteReelle: number;
        commentaire?: string;
    }, utilisateurId: number): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    mouvements(medicamentId: number): Promise<{
        utilisateur: {
            matricule: string;
            nom: string;
            prenom: string;
        };
        lot: {
            numeroLot: string;
        };
        type: string;
        id: number;
        createdAt: Date;
        medicamentId: number;
        quantite: number;
        reference: string | null;
        commentaire: string | null;
        lotId: number | null;
        utilisateurId: number | null;
    }[]>;
    alertes(cliniqueId: number): Promise<{
        stockBas: {
            prixVente: number;
            lots: {
                datePeremption: Date;
                perime: boolean;
                peremptionProche: boolean;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                medicamentId: number;
                numeroLot: string;
                quantiteInitiale: number;
                quantiteRestante: number;
                prixAchat: import("@prisma/client/runtime/library").Decimal | null;
            }[];
            alerteStock: boolean;
            nom: string;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            actif: boolean;
            forme: string | null;
            uniteVente: string;
            dosage: string | null;
            stock: number;
            seuilAlerte: number;
        }[];
        peremptions: {
            datePeremption: Date;
            perime: boolean;
            peremptionProche: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            medicamentId: number;
            numeroLot: string;
            quantiteInitiale: number;
            quantiteRestante: number;
            prixAchat: import("@prisma/client/runtime/library").Decimal | null;
            medicament: string;
        }[];
    }>;
    consommables(cliniqueId: number): Promise<{
        alerte: boolean;
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }[]>;
    creerConsommable(dto: any): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }>;
    majConsommable(id: number, dto: any): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }>;
    mouvementConsommable(id: number, dto: {
        type: string;
        quantite: number;
        commentaire?: string;
    }, utilisateurId: number): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }>;
    mouvementsConsommable(id: number): Promise<{
        type: string;
        id: number;
        createdAt: Date;
        quantite: number;
        reference: string | null;
        commentaire: string | null;
        utilisateurId: number | null;
        consommableId: number;
    }[]>;
}
