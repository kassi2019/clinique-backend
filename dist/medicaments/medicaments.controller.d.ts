import { PrismaService } from '../prisma/prisma.service';
export declare class MedicamentsController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(cliniqueId?: string): Promise<{
        consommable: boolean;
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    create(dto: any): Promise<{
        consommable: boolean;
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: number, dto: any): Promise<{
        consommable: boolean;
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: number): Promise<{
        consommable: boolean;
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        forme: string | null;
        uniteVente: string;
        dosage: string | null;
        stock: number;
        seuilAlerte: number;
        prixVente: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    importer(dto: any): Promise<{
        ajoutes: number;
        total: number;
    }>;
}
