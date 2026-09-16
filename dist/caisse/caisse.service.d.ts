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
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    }[]>;
    detailPassage(passageId: number): Promise<{
        prestations: {
            montant: number;
            service: {
                nom: string;
            };
            id: number;
            passageId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            serviceId: number | null;
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
                passageId: number;
                statut: string;
                createdAt: Date;
                updatedAt: Date;
                serviceId: number | null;
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
            passageId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            statut: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
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
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
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
    ajouterPrestation(passageId: number, prestationId: number): Promise<{
        montant: number;
        id: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: number | null;
        prestationId: number | null;
        libelle: string;
        source: string;
        paiementId: number | null;
    }>;
    retirerPrestation(ligneId: number): Promise<{
        id: number;
        passageId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: number | null;
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
            passageId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            statut: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
        passageId: number;
        caissierId: number;
        numeroRecu: string;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        modePaiement: string;
        statut: string;
        motifAnnulation: string | null;
        dateAnnulation: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
