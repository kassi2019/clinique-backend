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
        consultations: {
            id: number;
            statut: string;
            valideeLe: Date;
            numeroOrdonnance: string;
            ordonnanceStatut: string;
            medicaments: {
                posologie: string | null;
                createdAt: Date;
                id: number;
                consultationId: number;
                medicamentId: number | null;
                medicamentNom: string;
                prixUnitaire: import("@prisma/client/runtime/library").Decimal | null;
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
                    createdAt: Date;
                    id: number;
                    statut: string;
                    caissierId: number;
                    numeroRecu: string;
                    modePaiement: string;
                    motifAnnulation: string | null;
                    dateAnnulation: Date | null;
                    dispensationId: number;
                };
                createdAt: Date;
                id: number;
                statut: string;
                updatedAt: Date;
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
                prenom: string;
                code: string;
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
                createdAt: Date;
                id: number;
                statut: string;
                caissierId: number;
                numeroRecu: string;
                modePaiement: string;
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
            createdAt: Date;
            id: number;
            statut: string;
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
        paiement: {
            createdAt: Date;
            id: number;
            statut: string;
            caissierId: number;
            numeroRecu: string;
            montantTotal: import("@prisma/client/runtime/library").Decimal;
            modePaiement: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
            dispensationId: number;
        };
        lignes: {
            id: number;
            montant: import("@prisma/client/runtime/library").Decimal;
            medicamentId: number | null;
            medicamentNom: string;
            prixUnitaire: import("@prisma/client/runtime/library").Decimal;
            dispensationId: number;
            prescriptionId: number | null;
            quantitePrescrite: string | null;
            quantiteDelivree: number;
            uniteVente: string | null;
        }[];
    } & {
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        consultationId: number;
        pharmacienId: number;
        clotureeLe: Date | null;
    }>;
    cloturer(id: number): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        consultationId: number;
        pharmacienId: number;
        clotureeLe: Date | null;
    }>;
    payer(id: number, dto: {
        modePaiement: string;
    }, req: any): Promise<{
        paiement: {
            montantTotal: number;
            createdAt: Date;
            id: number;
            statut: string;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
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
        createdAt: Date;
        id: number;
        statut: string;
        caissierId: number;
        numeroRecu: string;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        modePaiement: string;
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
            createdAt: Date;
            id: number;
            updatedAt: Date;
            medicamentId: number;
            numeroLot: string;
            quantiteInitiale: number;
            quantiteRestante: number;
            prixAchat: import("@prisma/client/runtime/library").Decimal | null;
        }[];
        alerteStock: boolean;
        statutStock: {
            code: string;
            libelle: string;
            couleur: string;
        };
        consommable: boolean;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
    }[]>;
    entrerStock(dto: any, req: any): Promise<{
        fournisseur: string | null;
        createdAt: Date;
        id: number;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    inventaireMultiple(dto: {
        lignes: {
            lotId: number;
            quantiteReelle: number;
        }[];
    }, req: any): Promise<{
        ajustes: number;
        total: number;
    }>;
    lots(medicamentId: number): Promise<{
        fournisseur: string | null;
        createdAt: Date;
        id: number;
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
        createdAt: Date;
        id: number;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
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
        createdAt: Date;
        id: number;
        utilisateurId: number | null;
        type: string;
        medicamentId: number;
        quantite: number;
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
                createdAt: Date;
                id: number;
                updatedAt: Date;
                medicamentId: number;
                numeroLot: string;
                quantiteInitiale: number;
                quantiteRestante: number;
                prixAchat: import("@prisma/client/runtime/library").Decimal | null;
            }[];
            alerteStock: boolean;
            statutStock: {
                code: string;
                libelle: string;
                couleur: string;
            };
            consommable: boolean;
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
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
            fournisseur: string | null;
            createdAt: Date;
            id: number;
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
    recalculerSeuils(cliniqueId: number): Promise<{
        recalcules: number;
    }>;
    retirerLot(id: number, dto: {
        quantite: number;
        motif: string;
        commentaire?: string;
    }, req: any): Promise<{
        fournisseur: string | null;
        createdAt: Date;
        id: number;
        updatedAt: Date;
        medicamentId: number;
        datePeremption: Date;
        numeroLot: string;
        quantiteInitiale: number;
        quantiteRestante: number;
        prixAchat: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    peremptionsProches(cliniqueId?: number, jours?: string): any[] | Promise<({
        medicament: {
            id: number;
            nom: string;
            dosage: string;
        };
    } & {
        fournisseur: string | null;
        createdAt: Date;
        id: number;
        updatedAt: Date;
        medicamentId: number;
        datePeremption: Date;
        numeroLot: string;
        quantiteInitiale: number;
        quantiteRestante: number;
        prixAchat: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    retirerPerimesAuto(cliniqueId: number): Promise<{
        lotsRetires: number;
        quantiteRetiree: number;
    }>;
    retraits(cliniqueId?: number, debut?: string, fin?: string): any[] | Promise<({
        medicament: {
            nom: string;
            dosage: string;
        };
        lot: {
            datePeremption: Date;
            numeroLot: string;
            prixAchat: import("@prisma/client/runtime/library").Decimal;
        };
        utilisateur: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
    } & {
        createdAt: Date;
        id: number;
        utilisateurId: number | null;
        type: string;
        medicamentId: number;
        quantite: number;
        reference: string | null;
        commentaire: string | null;
        lotId: number | null;
    })[]>;
    pointsFinanciers(cliniqueId?: number, debut?: string, fin?: string): Promise<{
        periode: {
            debut: string;
            fin: string;
        };
        recus: number;
        vendus: number;
        perdus: number;
        correctifs: number;
        restants: number;
    }> | {
        recus: number;
        vendus: number;
        perdus: number;
        correctifs: number;
        restants: number;
        periode: {};
    };
    detailFinancier(cliniqueId?: number, type?: string, debut?: string, fin?: string): any[] | Promise<{
        date: Date;
        medicament: string;
        lot: string;
        quantite: number;
        prixAchat: number;
        montant: number;
    }[] | {
        date: Date;
        patient: string;
        numeroOrdre: string;
        montant: number;
    }[] | {
        date: Date;
        medicament: string;
        motif: string;
        quantite: number;
        lot: string;
        montant: number;
        par: string;
        commentaire: string;
    }[] | {
        date: Date;
        medicament: string;
        lot: string;
        ecart: number;
        montant: number;
        par: string;
    }[] | {
        medicament: string;
        lot: string;
        peremption: string;
        quantite: number;
        prixAchat: number;
        montant: number;
    }[]>;
    consommables(cliniqueId?: number): any[] | Promise<{
        alerte: boolean;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }[]>;
    creerConsommable(dto: any): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }>;
    majConsommable(id: number, dto: any): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }>;
    mouvementConsommable(id: number, dto: {
        type: string;
        quantite: number;
        commentaire?: string;
    }, req: any): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        quantite: number;
        seuilAlerte: number;
        unite: string | null;
    }>;
    mouvementsConsommable(id: number): Promise<{
        createdAt: Date;
        id: number;
        utilisateurId: number | null;
        type: string;
        quantite: number;
        reference: string | null;
        commentaire: string | null;
        consommableId: number;
    }[]>;
}
