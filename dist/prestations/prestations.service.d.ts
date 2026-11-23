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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            serviceId: number;
            libelle: string;
            montant: Prisma.Decimal;
            code: string;
            type: string;
            actif: boolean;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        serviceId: number;
        libelle: string;
        montant: Prisma.Decimal;
        code: string;
        type: string;
        actif: boolean;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        serviceId: number;
        libelle: string;
        montant: Prisma.Decimal;
        code: string;
        type: string;
        actif: boolean;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        serviceId: number;
        libelle: string;
        montant: Prisma.Decimal;
        code: string;
        type: string;
        actif: boolean;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        serviceId: number;
        libelle: string;
        montant: Prisma.Decimal;
        code: string;
        type: string;
        actif: boolean;
    } & {
        montant: number;
    }>;
}
