import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
import { EncaisserDto } from './dto/encaisser.dto';
export declare class CaisseService {
    private prisma;
    private impressionService;
    private readonly logger;
    constructor(prisma: PrismaService, impressionService: ImpressionService);
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
        montant: import("@prisma/client/runtime/library").Decimal;
        prestationId: number | null;
        libelle: string;
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
    annulerPaiement(paiementId: number, motif: string): Promise<{
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        caissierId: number;
        numeroRecu: string;
        modePaiement: string;
        motifAnnulation: string | null;
        dateAnnulation: Date | null;
    }>;
}
