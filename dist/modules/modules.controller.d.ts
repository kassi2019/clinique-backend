import { PrismaService } from '../prisma/prisma.service';
export declare class ModulesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        nom: string;
        code: string;
        description: string | null;
    }[]>;
}
