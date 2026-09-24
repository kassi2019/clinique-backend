import { PrismaService } from '../prisma/prisma.service';
import { PharmacieService } from './pharmacie.service';
export declare class TachesSeuilsService {
    private prisma;
    private pharmacie;
    private readonly logger;
    constructor(prisma: PrismaService, pharmacie: PharmacieService);
    recalculerSeuilsQuotidien(): Promise<void>;
}
