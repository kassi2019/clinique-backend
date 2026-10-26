import { PrismaService } from '../prisma/prisma.service';
export interface SignatureCachetDto {
    signature?: string | null;
    cachet?: string | null;
}
export declare class SignatureService {
    private prisma;
    constructor(prisma: PrismaService);
    lire(personnelId: number): Promise<{
        id: number;
        nom: string;
        prenom: string;
        signature: string;
        cachet: string;
    }>;
    enregistrer(personnelId: number, dto: SignatureCachetDto): Promise<{
        id: number;
        nom: string;
        prenom: string;
        signature: string;
        cachet: string;
    }>;
    personnelDe(utilisateurId: number, pourModifier?: boolean): Promise<number>;
}
