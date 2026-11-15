import { PrismaService } from '../prisma/prisma.service';
export declare class UtilisateursOptionsController {
    private prisma;
    constructor(prisma: PrismaService);
    lister(cliniqueId?: string): Promise<{
        id: number;
        nom: string;
    }[]>;
}
