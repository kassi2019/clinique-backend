import { PrismaService } from '../prisma/prisma.service';
export declare class ListesParametresService {
    private prisma;
    constructor(prisma: PrismaService);
    private delegate;
    findAll(cliniqueId: number, code?: string, tous?: boolean, page?: number, perPage?: number): Promise<any>;
    creer(cliniqueId: number, code: string, libelle: string): Promise<any>;
    importer(cliniqueId: number, code: string, libelles: string[]): Promise<{
        ajoutes: number;
        total: number;
    }>;
    modifier(id: number, code: string, libelle: string): Promise<any>;
    desactiver(id: number, code: string): Promise<any>;
}
