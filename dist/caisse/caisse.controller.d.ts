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
            nom: string;
            code: string;
        };
    }[]>;
    fileAttente(cliniqueId: number, jour?: string, page?: string, perPage?: string): Promise<{
        data: {
            id: number;
            numeroOrdre: string;
            patient: {
                nom: string;
                code: string;
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
        assurancePatient: {
            assurance: {
                code: string;
                libelle: string;
            };
            formule: {
                code: string;
                libelle: string;
            };
            numeroAssure: string;
            typeBeneficiaire: string;
        };
        prestations: {
            montant: number;
            couverture: any;
            service: {
                nom: string;
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
        paiements: {
            montantTotal: number;
            partAssurance: number;
            partPatient: number;
            lignes: {
                montant: number;
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
            caissier: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            statut: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
            assuranceId: number | null;
            formuleLibelle: string | null;
            tauxParametre: number | null;
            tauxApplique: number | null;
            motifTaux: string | null;
        }[];
        patient: {
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
            nom: string;
            code: string;
        };
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        serviceId: number;
        patientId: number;
        numeroOrdre: string;
        typePatient: string;
        motif: string | null;
        referent: string | null;
        prestationDemandee: string | null;
        taille: string | null;
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: import("@prisma/client/runtime/library").Decimal | null;
        expireLe: Date;
    }>;
    ajouterPrestation(id: number, dto: AjouterPrestationDto): Promise<{
        montant: number;
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
    }>;
    retirerPrestation(id: number): Promise<{
        id: number;
        libelle: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        serviceId: number | null;
        prestationId: number | null;
        montant: import("@prisma/client/runtime/library").Decimal;
        source: string;
        paiementId: number | null;
    }>;
    encaisser(id: number, dto: EncaisserDto, req: any): Promise<{
        paiement: {
            montantTotal: number;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            passageId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            statut: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
            assuranceId: number | null;
            formuleLibelle: string | null;
            tauxParametre: number | null;
            tauxApplique: number | null;
            partAssurance: import("@prisma/client/runtime/library").Decimal | null;
            partPatient: import("@prisma/client/runtime/library").Decimal | null;
            motifTaux: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        caissierId: number;
        numeroRecu: string;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        modePaiement: string;
        statut: string;
        motifAnnulation: string | null;
        dateAnnulation: Date | null;
        assuranceId: number | null;
        formuleLibelle: string | null;
        tauxParametre: number | null;
        tauxApplique: number | null;
        partAssurance: import("@prisma/client/runtime/library").Decimal | null;
        partPatient: import("@prisma/client/runtime/library").Decimal | null;
        motifTaux: string | null;
    }>;
}
