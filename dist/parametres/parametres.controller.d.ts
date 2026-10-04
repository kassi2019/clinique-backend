import { UpdateParametreDto } from './dto/update-parametre.dto';
import { ParametresService } from './parametres.service';
export declare class ParametresController {
    private parametresService;
    constructor(parametresService: ParametresService);
    findOne(cliniqueId: number): import(".prisma/client").Prisma.Prisma__ParametreClient<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        loginImage: string | null;
        logoRapportGauche: string | null;
        logoRapportCentre: string | null;
        logoRapportDroit: string | null;
        sigVersion: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(cliniqueId: number, dto: UpdateParametreDto): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        loginImage: string | null;
        logoRapportGauche: string | null;
        logoRapportCentre: string | null;
        logoRapportDroit: string | null;
        sigVersion: string | null;
    }>;
}
