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
            service: {
                nom: string;
            };
            id: number;
            statut: string;
            createdAt: Date;
            numeroOrdre: string;
        }[];
    } & {
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
        } & {
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
            temperature: Prisma.Decimal | null;
            pouls: number | null;
            tensionGauche: string | null;
            tensionDroite: string | null;
            poids: Prisma.Decimal | null;
            expireLe: Date;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    passageParReference(reference: string, cliniqueId?: number): Promise<{
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
    } & {
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
        temperature: Prisma.Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: Prisma.Decimal | null;
        expireLe: Date;
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
    } & {
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
        temperature: Prisma.Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: Prisma.Decimal | null;
        expireLe: Date;
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
        temperature: Prisma.Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: Prisma.Decimal | null;
        expireLe: Date;
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
    } & {
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
        temperature: Prisma.Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: Prisma.Decimal | null;
        expireLe: Date;
    }>;
    private prochainNumeroOrdre;
    private prochainNumeroDossier;
    private genererCodeUnique;
    private debutJour;
    private avecStatutVerifie;
}
