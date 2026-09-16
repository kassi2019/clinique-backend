import { AccueilService } from './accueil.service';
import { CreatePassageDto, UpdatePassageDto } from './dto/create-passage.dto';
export declare class AccueilController {
    private accueilService;
    constructor(accueilService: AccueilService);
    rechercherPatients(search?: string, cliniqueId?: string): Promise<({
        passages: {
            service: {
                nom: string;
            };
            id: number;
            numeroOrdre: string;
            statut: string;
            createdAt: Date;
        }[];
    } & {
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        telephone: string | null;
        numeroDossier: string;
        prenom: string;
        age: string | null;
        sexe: string | null;
        ville: string | null;
        quartier: string | null;
        profession: string | null;
    })[]>;
    listerPassages(cliniqueId: number, date?: string, debut?: string, fin?: string, constantes?: string, search?: string, serviceId?: string, page?: string, perPage?: string): Promise<{
        data: ({
            clinique: {
                nom: string;
                id: number;
                code: string;
                adresse: string;
            };
            patient: {
                nom: string;
                id: number;
                cliniqueId: number;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                telephone: string | null;
                numeroDossier: string;
                prenom: string;
                age: string | null;
                sexe: string | null;
                ville: string | null;
                quartier: string | null;
                profession: string | null;
            };
            service: {
                nom: string;
                id: number;
                code: string;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    passageParReference(code: string, cliniqueId?: string): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
            adresse: string;
        };
        patient: {
            nom: string;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            telephone: string | null;
            numeroDossier: string;
            prenom: string;
            age: string | null;
            sexe: string | null;
            ville: string | null;
            quartier: string | null;
            profession: string | null;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
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
    findOne(id: number): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
            adresse: string;
        };
        patient: {
            nom: string;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            telephone: string | null;
            numeroDossier: string;
            prenom: string;
            age: string | null;
            sexe: string | null;
            ville: string | null;
            quartier: string | null;
            profession: string | null;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
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
    creerPassage(dto: CreatePassageDto): Promise<{
        impression: any;
        clinique: {
            nom: string;
            id: number;
            code: string;
            adresse: string;
        };
        patient: {
            nom: string;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            telephone: string | null;
            numeroDossier: string;
            prenom: string;
            age: string | null;
            sexe: string | null;
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
    modifierPassage(id: number, dto: UpdatePassageDto): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
            adresse: string;
        };
        patient: {
            nom: string;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            telephone: string | null;
            numeroDossier: string;
            prenom: string;
            age: string | null;
            sexe: string | null;
            ville: string | null;
            quartier: string | null;
            profession: string | null;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
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
}
