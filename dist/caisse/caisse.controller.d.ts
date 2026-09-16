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
    detail(id: number): Promise<{
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
    ajouterPrestation(id: number, dto: AjouterPrestationDto): Promise<{
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
    retirerPrestation(id: number): Promise<{
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
    encaisser(id: number, dto: EncaisserDto, req: any): Promise<{
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
    annuler(id: number, dto: AnnulerPaiementDto): Promise<{
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
