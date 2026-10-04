import { PrismaService } from '../prisma/prisma.service';
export declare class AuditController {
    private prisma;
    constructor(prisma: PrismaService);
    lister(page?: string, perPage?: string, utilisateurId?: string, cliniqueId?: string, jour?: string): Promise<{
        data: ({
            utilisateur: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
        } & {
            methode: string;
            route: string;
            entite: string | null;
            entiteId: string | null;
            details: string | null;
            createdAt: Date;
            id: number;
            cliniqueId: number | null;
            utilisateurId: number | null;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
}
