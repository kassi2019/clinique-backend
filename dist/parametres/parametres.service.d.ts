import { PrismaService } from '../prisma/prisma.service';
import { UpdateParametreDto } from './dto/update-parametre.dto';
export declare class ParametresService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreate(cliniqueId: number): import(".prisma/client").Prisma.Prisma__ParametreClient<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        loginImage: string | null;
        logoRapportGauche: string | null;
        logoRapportCentre: string | null;
        logoRapportDroit: string | null;
        sigVersion: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(cliniqueId: number, dto: UpdateParametreDto): Promise<{
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        loginImage: string | null;
        logoRapportGauche: string | null;
        logoRapportCentre: string | null;
        logoRapportDroit: string | null;
        sigVersion: string | null;
    }>;
}
