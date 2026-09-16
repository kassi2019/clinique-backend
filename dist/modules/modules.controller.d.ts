import { PrismaService } from '../prisma/prisma.service';
export declare class ModulesController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        nom: string;
        id: number;
        code: string;
        description: string | null;
    }[]>;
}
