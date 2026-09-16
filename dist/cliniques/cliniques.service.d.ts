import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCliniqueDto, UpdateCliniqueDto } from './dto/create-clinique.dto';
export declare class CliniquesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Prisma.PrismaPromise<{
        nom: string;
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }[]>;
    findOne(id: number): Promise<{
        _count: {
            personnel: number;
            services: number;
        };
    } & {
        nom: string;
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }>;
    create(dto: CreateCliniqueDto): Promise<{
        nom: string;
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }>;
    update(id: number, dto: UpdateCliniqueDto): Promise<{
        nom: string;
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }>;
    remove(id: number): Promise<{
        nom: string;
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }>;
}
