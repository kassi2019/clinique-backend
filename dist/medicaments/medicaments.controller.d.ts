import { PrismaService } from '../prisma/prisma.service';
export declare class MedicamentsController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(cliniqueId?: string): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        forme: string | null;
        dosage: string | null;
    }[]>;
    create(dto: any): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        forme: string | null;
        dosage: string | null;
    }>;
    update(id: number, dto: any): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        forme: string | null;
        dosage: string | null;
    }>;
    remove(id: number): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        forme: string | null;
        dosage: string | null;
    }>;
}
