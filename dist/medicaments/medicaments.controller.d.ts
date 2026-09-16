import { PrismaService } from '../prisma/prisma.service';
export declare class MedicamentsController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(cliniqueId?: string): Promise<{
        id: number;
        cliniqueId: number;
        nom: string;
        forme: string | null;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
        uniteVente: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(dto: any): Promise<{
        id: number;
        cliniqueId: number;
        nom: string;
        forme: string | null;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
        uniteVente: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: any): Promise<{
        id: number;
        cliniqueId: number;
        nom: string;
        forme: string | null;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
        uniteVente: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        cliniqueId: number;
        nom: string;
        forme: string | null;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
        uniteVente: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
