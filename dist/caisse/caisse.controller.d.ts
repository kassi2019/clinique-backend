import { CaisseService } from './caisse.service';
import { AjouterPrestationDto, AnnulerPaiementDto, EncaisserDto } from './dto/encaisser.dto';
export declare class CaisseController {
    private caisseService;
    constructor(caisseService: CaisseService);
    rechercher(search?: string, cliniqueId?: number): any[] | Promise<{
        id: number;
        numeroOrdre: string;
        statut: string;
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
    }[]>;
    fileAttente(cliniqueId: number, page?: string, perPage?: string): Promise<{
        data: {
            id: number;
            numeroOrdre: string;
            patient: {
                code: string;
                nom: string;
                prenom: string;
            };
            service: {
                nom: string;
            };
            totalAPayer: number;
            nbLignes: number;
        }[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    payesDuJour(cliniqueId: number, page?: string, perPage?: string): Promise<{
        data: {
            id: number;
            numeroRecu: string;
            modePaiement: string;
            montant: number;
            createdAt: Date;
            numeroOrdre: string;
            patient: {
                nom: string;
                prenom: string;
            };
        }[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    detail(id: number): Promise<{
        prestations: {
            montant: number;
            service: {
                nom: string;
            };
            id: number;
            serviceId: number | null;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            prestationId: number | null;
            libelle: string;
            source: string;
            paiementId: number | null;
        }[];
        paiements: {
            montantTotal: number;
            lignes: {
                montant: number;
                id: number;
                serviceId: number | null;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                passageId: number;
                prestationId: number | null;
                libelle: string;
                source: string;
                paiementId: number | null;
            }[];
            caissier: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
            id: number;
            cliniqueId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
        }[];
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
        id: number;
        cliniqueId: number;
        patientId: number;
        numeroOrdre: string;
        serviceId: number;
        typePatient: string;
        motif: string | null;
        referent: string | null;
        prestationDemandee: string | null;
        statut: string;
        taille: string | null;
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: import("@prisma/client/runtime/library").Decimal | null;
        expireLe: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    ajouterPrestation(id: number, dto: AjouterPrestationDto): Promise<{
        montant: number;
        id: number;
        serviceId: number | null;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        prestationId: number | null;
        libelle: string;
        source: string;
        paiementId: number | null;
    }>;
    retirerPrestation(id: number): Promise<{
        id: number;
        serviceId: number | null;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        prestationId: number | null;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        source: string;
        paiementId: number | null;
    }>;
    encaisser(id: number, dto: EncaisserDto, req: any): Promise<{
        paiement: {
            montantTotal: number;
            id: number;
            cliniqueId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
        };
        lignes: {
            id: number;
            libelle: string;
            montant: number;
        }[];
        passage: {
            id: number;
            statut: string;
            numeroOrdre: string;
        };
        patient: {
            nom: string;
            prenom: string;
            code: string;
        };
        impression: any;
    }>;
    annuler(id: number, dto: AnnulerPaiementDto): Promise<{
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        caissierId: number;
        numeroRecu: string;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        modePaiement: string;
        motifAnnulation: string | null;
        dateAnnulation: Date | null;
    }>;
}
