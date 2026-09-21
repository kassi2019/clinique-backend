import { CliniquesService } from './cliniques.service';
import { CreateCliniqueDto, UpdateCliniqueDto } from './dto/create-clinique.dto';
export declare class CliniquesController {
    private cliniquesService;
    constructor(cliniquesService: CliniquesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }[]>;
    findOne(id: number): Promise<{
        _count: {
            personnel: number;
            services: number;
        };
    } & {
        id: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }>;
    create(dto: CreateCliniqueDto): Promise<{
        id: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }>;
    update(id: number, dto: UpdateCliniqueDto): Promise<{
        id: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        code: string;
        adresse: string | null;
        telephone: string | null;
    }>;
}
