import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
import { AffectationService } from '../affectation/affectation.service';
import { AssurancesService } from '../assurances/assurances.service';
import { EncaisserDto } from './dto/encaisser.dto';
export declare class CaisseService {
    private prisma;
    private impressionService;
    private affectationService;
    private assurancesService;
    private readonly logger;
    constructor(prisma: PrismaService, impressionService: ImpressionService, affectationService: AffectationService, assurancesService: AssurancesService);
    rechercher(search: string, cliniqueId: number): Promise<{
        id: number;
        numeroOrdre: string;
        statut: string;
        createdAt: Date;
        patient: {
            nationalite: string | null;
            profession: string | null;
            quartier: string | null;
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
    detailPassage(passageId: number): Promise<{
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
            nationalite: string | null;
            profession: string | null;
            quartier: string | null;
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
        perimetreBrachial: string | null;
        perimetreCranien: string | null;
        materniteTraiteLe: Date | null;
        expireLe: Date;
    }>;
    ajouterPrestation(passageId: number, prestationId: number): Promise<{
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
    retirerPrestation(ligneId: number): Promise<{
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
    encaisser(passageId: number, dto: EncaisserDto, utilisateurId: number): Promise<{
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
    fileAttente(cliniqueId: number, page?: number, perPage?: number, jour?: string): Promise<{
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
