import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class PharmacieService {
    private prisma;
    private impressionService;
    private readonly logger;
    constructor(prisma: PrismaService, impressionService: ImpressionService);
    rechercherOrdonnances(reference: string, cliniqueId: number, filtres?: {
        medecinId?: number;
        statut?: string;
        debut?: string;
        fin?: string;
    }): Promise<{
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
    }>;
    detailOrdonnance(consultationId: number): Promise<{
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
    dispenser(consultationId: number, lignes: {
        prescriptionId: number;
        quantiteDelivree: number;
    }[], pharmacienId: number): Promise<{
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
    cloturer(dispensationId: number): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        consultationId: number;
        pharmacienId: number;
        clotureeLe: Date | null;
    }>;
    payer(dispensationId: number, modePaiement: string, caissierId: number): Promise<{
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
    annulerPaiement(paiementId: number, motif: string): Promise<{
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
    stocks(cliniqueId: number, search?: string): Promise<{
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
    entrerStock(dto: {
        medicamentId: number;
        numeroLot: string;
        quantite: number;
        datePeremption: string;
        prixAchat?: number;
        fournisseur?: string;
    }, utilisateurId: number): Promise<{
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
    inventaire(dto: {
        medicamentId: number;
        quantiteReelle: number;
        commentaire?: string;
    }, utilisateurId: number): Promise<{
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
    recalculerSeuil(medicamentId: number): Promise<{
        consommation30j: number;
        qs: number;
    }>;
    statutStock(stockDisponible: number, qs: number): {
        code: string;
        libelle: string;
        couleur: string;
    };
    recalculerTousSeuils(cliniqueId: number): Promise<{
        recalcules: number;
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
    inventaireLot(lotId: number, quantiteReelle: number, commentaire: string | undefined, utilisateurId: number): Promise<{
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
    inventaireMultiple(lignes: {
        lotId: number;
        quantiteReelle: number;
    }[], utilisateurId: number): Promise<{
        ajustes: number;
        total: number;
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
    alertes(cliniqueId: number): Promise<{
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
    }>;
    consommables(cliniqueId: number): Promise<{
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
    }, utilisateurId: number): Promise<{
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
    static MOTIFS_RETRAIT: Record<string, string>;
    retirerLot(lotId: number, dto: {
        quantite: number;
        motif: string;
        commentaire?: string;
    }, utilisateurId: number): Promise<{
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
    retirerPerimesAuto(cliniqueId: number): Promise<{
        lotsRetires: number;
        quantiteRetiree: number;
    }>;
    peremptionsProches(cliniqueId: number, jours?: number): Promise<({
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
    retraits(cliniqueId: number, debut?: string, fin?: string): Promise<({
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
    detailFinancier(cliniqueId: number, type: string, debut?: string, fin?: string): Promise<{
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
    pointsFinanciers(cliniqueId: number, debut?: string, fin?: string): Promise<{
        periode: {
            debut: string;
            fin: string;
        };
        recus: number;
        vendus: number;
        perdus: number;
        correctifs: number;
        restants: number;
    }>;
}
