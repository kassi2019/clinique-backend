import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrestationDto, UpdatePrestationDto } from './dto/create-prestation.dto';
export declare class PrestationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        cliniqueId?: number;
        serviceId?: number;
        search?: string;
        page?: number;
        perPage?: number;
    }): Promise<{
        data: ({
            clinique: {
                id: number;
                nom: string;
                code: string;
            };
            service: {
                id: number;
                nom: string;
                code: string;
            };
        } & {
            type: string;
            id: number;
            cliniqueId: number;
            libelle: string;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            serviceId: number;
            montant: Prisma.Decimal;
        } & {
            montant: number;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        libelle: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        serviceId: number;
        montant: Prisma.Decimal;
    } & {
        montant: number;
    }>;
    create(dto: CreatePrestationDto): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        libelle: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        serviceId: number;
        montant: Prisma.Decimal;
    } & {
        montant: number;
    }>;
    update(id: number, dto: UpdatePrestationDto): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        libelle: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        serviceId: number;
        montant: Prisma.Decimal;
    } & {
        montant: number;
    }>;
    remove(id: number): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        libelle: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        serviceId: number;
        montant: Prisma.Decimal;
    } & {
        montant: number;
    }>;
}
