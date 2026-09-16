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
                nom: string;
                id: number;
                code: string;
            };
            service: {
                nom: string;
                id: number;
                code: string;
            };
        } & {
            type: string;
            id: number;
            cliniqueId: number;
            serviceId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            actif: boolean;
            libelle: string;
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
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        serviceId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        actif: boolean;
        libelle: string;
        montant: Prisma.Decimal;
    } & {
        montant: number;
    }>;
    create(dto: CreatePrestationDto): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        serviceId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        actif: boolean;
        libelle: string;
        montant: Prisma.Decimal;
    } & {
        montant: number;
    }>;
    update(id: number, dto: UpdatePrestationDto): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        serviceId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        actif: boolean;
        libelle: string;
        montant: Prisma.Decimal;
    } & {
        montant: number;
    }>;
    remove(id: number): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        serviceId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        actif: boolean;
        libelle: string;
        montant: Prisma.Decimal;
    } & {
        montant: number;
    }>;
}
