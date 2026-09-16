import { PharmacieService } from './pharmacie.service';
export declare class PharmacieController {
    private pharmacieService;
    constructor(pharmacieService: PharmacieService);
    rechercherOrdonnances(code?: string, cliniqueId?: number): any[] | Promise<{
        id: number;
        numeroOrdre: string;
        createdAt: Date;
        patient: {
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            numeroDossier: string;
            code: string;
            nom: string;
            prenom: string;
            age: string | null;
            sexe: string | null;
            ville: string | null;
            quartier: string | null;
            profession: string | null;
            telephone: string | null;
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
                    statut: string;
                    createdAt: Date;
                    dispensationId: number;
                    caissierId: number;
                    numeroRecu: string;
                    modePaiement: string;
                    motifAnnulation: string | null;
                    dateAnnulation: Date | null;
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
    detailOrdonnance(id: number): Promise<{
        consultation: {
            id: number;
            statut: string;
            valideeLe: Date;
            patient: {
                id: number;
                cliniqueId: number;
                createdAt: Date;
                updatedAt: Date;
                numeroDossier: string;
                code: string;
                nom: string;
                prenom: string;
                age: string | null;
                sexe: string | null;
                ville: string | null;
                quartier: string | null;
                profession: string | null;
                telephone: string | null;
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
                statut: string;
                createdAt: Date;
                dispensationId: number;
                caissierId: number;
                numeroRecu: string;
                modePaiement: string;
                motifAnnulation: string | null;
                dateAnnulation: Date | null;
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
    dispenser(consultationId: number, dto: {
        lignes: {
            prescriptionId: number;
            quantiteDelivree: number;
        }[];
    }, req: any): Promise<{
        lignes: {
            id: number;
            medicamentId: number | null;
            medicamentNom: string;
            dispensationId: number;
            prescriptionId: number | null;
            quantitePrescrite: string | null;
            quantiteDelivree: number;
            uniteVente: string | null;
            prixUnitaire: import("@prisma/client/runtime/library").Decimal;
            montant: import("@prisma/client/runtime/library").Decimal;
        }[];
        paiement: {
            id: number;
            statut: string;
            createdAt: Date;
            montantTotal: import("@prisma/client/runtime/library").Decimal;
            dispensationId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
        };
    } & {
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: number;
        pharmacienId: number;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        clotureeLe: Date | null;
    }>;
    cloturer(id: number): Promise<{
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: number;
        pharmacienId: number;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        clotureeLe: Date | null;
    }>;
    payer(id: number, dto: {
        modePaiement: string;
    }, req: any): Promise<{
        paiement: {
            montantTotal: number;
            id: number;
            statut: string;
            createdAt: Date;
            dispensationId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
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
    annulerPaiement(id: number, dto: {
        motif: string;
    }): Promise<{
        id: number;
        statut: string;
        createdAt: Date;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        dispensationId: number;
        caissierId: number;
        numeroRecu: string;
        modePaiement: string;
        motifAnnulation: string | null;
        dateAnnulation: Date | null;
    }>;
    stocks(cliniqueId?: number, search?: string): any[] | Promise<{
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
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        forme: string | null;
        uniteVente: string;
        actif: boolean;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
    }[]>;
    entrerStock(dto: any, req: any): Promise<{
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
    inventaire(dto: any, req: any): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        forme: string | null;
        uniteVente: string;
        actif: boolean;
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
        id: number;
        createdAt: Date;
        medicamentId: number;
        quantite: number;
        type: string;
        lotId: number | null;
        reference: string | null;
        utilisateurId: number | null;
        commentaire: string | null;
    }[]>;
    alertes(cliniqueId?: number): Promise<{
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
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            forme: string | null;
            uniteVente: string;
            actif: boolean;
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
    }> | {
        stockBas: any[];
        peremptions: any[];
    };
    consommables(cliniqueId?: number): any[] | Promise<{
        alerte: boolean;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        quantite: number;
        actif: boolean;
        seuilAlerte: number;
        unite: string | null;
    }[]>;
    creerConsommable(dto: any): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        quantite: number;
        actif: boolean;
        seuilAlerte: number;
        unite: string | null;
    }>;
    majConsommable(id: number, dto: any): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        quantite: number;
        actif: boolean;
        seuilAlerte: number;
        unite: string | null;
    }>;
    mouvementConsommable(id: number, dto: {
        type: string;
        quantite: number;
        commentaire?: string;
    }, req: any): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        quantite: number;
        actif: boolean;
        seuilAlerte: number;
        unite: string | null;
    }>;
    mouvementsConsommable(id: number): Promise<{
        id: number;
        createdAt: Date;
        quantite: number;
        type: string;
        reference: string | null;
        utilisateurId: number | null;
        commentaire: string | null;
        consommableId: number;
    }[]>;
}
