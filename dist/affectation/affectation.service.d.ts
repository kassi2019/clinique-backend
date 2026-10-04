import { PrismaService } from '../prisma/prisma.service';
export declare class AffectationService {
    private prisma;
    private readonly logger;
    static SEUIL_ACTIVITE_MS: number;
    constructor(prisma: PrismaService);
    private medecinsDisponibles;
    assignerPassage(passageId: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
    redistribuerNonAffectees(cliniqueId: number): Promise<number>;
    annulerAffectation(passageId: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        medecinId: number | null;
        dateAffectation: Date;
    }>;
}
