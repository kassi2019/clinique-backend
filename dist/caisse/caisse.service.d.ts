import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
import { AffectationService } from '../affectation/affectation.service';
import { EncaisserDto } from './dto/encaisser.dto';
export declare class CaisseService {
    private prisma;
    private impressionService;
    private affectationService;
    private readonly logger;
    constructor(prisma: PrismaService, impressionService: ImpressionService, affectationService: AffectationService);
    rechercher(search: string, cliniqueId: number): Promise<{
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
    detailPassage(passageId: number): Promise<{
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
    ajouterPrestation(passageId: number, prestationId: number): Promise<{
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
    retirerPrestation(ligneId: number): Promise<{
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
    encaisser(passageId: number, dto: EncaisserDto, utilisateurId: number): Promise<{
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
    fileAttente(cliniqueId: number, page?: number, perPage?: number): Promise<{
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
    payesDuJour(cliniqueId: number, page?: number, perPage?: number): Promise<{
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
    annulerPaiement(paiementId: number, motif: string): Promise<{
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
