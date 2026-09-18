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
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    create(dto: any): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: number, dto: any): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: number): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        actif: boolean;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
