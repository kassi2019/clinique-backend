import { PharmacieService } from './pharmacie.service';
export declare class PharmacieController {
    private pharmacieService;
    constructor(pharmacieService: PharmacieService);
    rechercherOrdonnances(code?: string, cliniqueId?: number, medecinId?: string, statut?: string, debut?: string, fin?: string): Promise<{
        liste: boolean;
        id: number;
        numeroOrdre: string;
        createdAt: Date;
        patient: {
            nationalite: string | null;
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
            quartier: string | null;
            profession: string | null;
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
            numeroOrdonnance: string;
            ordonnanceStatut: string;
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
                    createdAt: Date;
                    caissierId: number;
                    numeroRecu: string;
                    modePaiement: string;
                    statut: string;
                    motifAnnulation: string | null;
                    dateAnnulation: Date | null;
                    dispensationId: number;
                };
                id: number;
                createdAt: Date;
                updatedAt: Date;
                statut: string;
                consultationId: number;
                pharmacienId: number;
                clotureeLe: Date | null;
            }[];
        }[];
    }[] | {
        liste: boolean;
        ordonnances: {
            id: number;
            numeroOrdonnance: string;
            ordonnanceStatut: string;
            createdAt: Date;
            patient: {
                nom: string;
                code: string;
                prenom: string;
            };
            passage: {
                numeroOrdre: string;
            };
            medecin: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
            nbMedicaments: number;
        }[];
    }> | {
        liste: boolean;
        ordonnances: any[];
    };
    detailOrdonnance(id: number): Promise<{
        consultation: {
            id: number;
            statut: string;
            valideeLe: Date;
            patient: {
                nationalite: string | null;
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
                quartier: string | null;
                profession: string | null;
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
                createdAt: Date;
                caissierId: number;
                numeroRecu: string;
                modePaiement: string;
                statut: string;
                motifAnnulation: string | null;
                dateAnnulation: Date | null;
                dispensationId: number;
            };
            pharmacien: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
            };
            id: number;
            createdAt: Date;
            updatedAt: Date;
            statut: string;
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
        paiement: {
            id: number;
            createdAt: Date;
            caissierId: number;
            numeroRecu: string;
            montantTotal: import("@prisma/client/runtime/library").Decimal;
            modePaiement: string;
            statut: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
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
        createdAt: Date;
        updatedAt: Date;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        statut: string;
        consultationId: number;
        pharmacienId: number;
        clotureeLe: Date | null;
    }>;
    cloturer(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        statut: string;
        consultationId: number;
        pharmacienId: number;
        clotureeLe: Date | null;
    }>;
    payer(id: number, dto: {
        modePaiement: string;
    }, req: any): Promise<{
        paiement: {
            montantTotal: number;
            id: number;
            createdAt: Date;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            statut: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
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
    annulerPaiement(id: number, dto: {
        motif: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        caissierId: number;
        numeroRecu: string;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        modePaiement: string;
        statut: string;
        motifAnnulation: string | null;
        dateAnnulation: Date | null;
        dispensationId: number;
    }>;
    stocks(cliniqueId?: number, search?: string): any[] | Promise<{
        prixVente: number;
        lots: {
            datePeremption: Date;
            perime: boolean;
            peremptionProche: boolean;
            fournisseur: string | null;
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
        consommable: boolean;
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
    }[]>;
    entrerStock(dto: any, req: any): Promise<{
        fournisseur: string | null;
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
        consommable: boolean;
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    lots(medicamentId: number): Promise<{
        fournisseur: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        medicamentId: number;
        datePeremption: Date;
        numeroLot: string;
        quantiteInitiale: number;
        quantiteRestante: number;
        prixAchat: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    lotsClinique(cliniqueId: number): Promise<({
        medicament: {
            id: number;
            nom: string;
            dosage: string;
        };
    } & {
        fournisseur: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        medicamentId: number;
        datePeremption: Date;
        numeroLot: string;
        quantiteInitiale: number;
        quantiteRestante: number;
        prixAchat: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    inventaireLot(id: number, dto: {
        quantiteReelle: number;
        commentaire?: string;
    }, req: any): Promise<{
        consommable: boolean;
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        utilisateurId: number | null;
        reference: string | null;
        commentaire: string | null;
        lotId: number | null;
    }[]>;
    alertes(cliniqueId?: number): Promise<{
        stockBas: {
            prixVente: number;
            lots: {
                datePeremption: Date;
                perime: boolean;
                peremptionProche: boolean;
                fournisseur: string | null;
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
            consommable: boolean;
            id: number;
            cliniqueId: number;
            nom: string;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
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
            fournisseur: string | null;
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
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }[]>;
    creerConsommable(dto: any): Promise<{
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }>;
    majConsommable(id: number, dto: any): Promise<{
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        quantite: number;
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
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }>;
    mouvementsConsommable(id: number): Promise<{
        type: string;
        id: number;
        createdAt: Date;
        quantite: number;
        utilisateurId: number | null;
        reference: string | null;
        commentaire: string | null;
        consommableId: number;
    }[]>;
}
