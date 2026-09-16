import { Prisma } from '@prisma/client';
import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePassageDto, UpdatePassageDto } from './dto/create-passage.dto';
export declare class AccueilService {
    private prisma;
    private impressionService;
    private readonly logger;
    constructor(prisma: PrismaService, impressionService: ImpressionService);
    rechercherPatients(search: string, cliniqueId?: number): Promise<({
        passages: {
            id: number;
            numeroOrdre: string;
            statut: string;
            createdAt: Date;
            service: {
                nom: string;
            };
        }[];
    } & {
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
    })[]>;
    listerPassages(cliniqueId: number, opts: {
        date?: string;
        debut?: string;
        fin?: string;
        constantes?: 'OUI' | 'NON';
        search?: string;
        serviceId?: number;
        page?: number;
        perPage?: number;
    }): Promise<{
        data: ({
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
            clinique: {
                id: number;
                code: string;
                nom: string;
                adresse: string;
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
            temperature: Prisma.Decimal | null;
            pouls: number | null;
            tensionGauche: string | null;
            tensionDroite: string | null;
            poids: Prisma.Decimal | null;
            expireLe: Date;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    passageParReference(reference: string, cliniqueId?: number): Promise<{
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
        clinique: {
            id: number;
            code: string;
            nom: string;
            adresse: string;
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
        temperature: Prisma.Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: Prisma.Decimal | null;
        expireLe: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: number): Promise<{
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
        clinique: {
            id: number;
            code: string;
            nom: string;
            adresse: string;
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
        temperature: Prisma.Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: Prisma.Decimal | null;
        expireLe: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    creerPassage(dto: CreatePassageDto): Promise<{
        impression: any;
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
        clinique: {
            id: number;
            code: string;
            nom: string;
            adresse: string;
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
        temperature: Prisma.Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: Prisma.Decimal | null;
        expireLe: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    modifierPassage(id: number, dto: UpdatePassageDto): Promise<{
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
        clinique: {
            id: number;
            code: string;
            nom: string;
            adresse: string;
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
        temperature: Prisma.Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: Prisma.Decimal | null;
        expireLe: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private prochainNumeroOrdre;
    private prochainNumeroDossier;
    private genererCodeUnique;
    private debutJour;
    private avecStatutVerifie;
}
