import { PrismaService } from '../prisma/prisma.service';
export declare class AffectationService {
    private prisma;
    private readonly logger;
    static SEUIL_ACTIVITE_MS: number;
    constructor(prisma: PrismaService);
    private medecinsDisponibles;
    assignerPassage(passageId: number): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    redistribuerNonAffectees(cliniqueId: number): Promise<number>;
    annulerAffectation(passageId: number): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        passageId: number;
        statut: string;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
}
