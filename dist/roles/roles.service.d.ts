import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: {
        page?: number;
        perPage?: number;
    }): Promise<{
        data: ({
            habilitations: ({
                module: {
                    nom: string;
                    id: number;
                    code: string;
                    description: string | null;
                };
            } & {
                lecture: boolean;
                ecriture: boolean;
                validation: boolean;
                roleId: number;
                moduleId: number;
            })[];
        } & {
            nom: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        habilitations: ({
            module: {
                nom: string;
                id: number;
                code: string;
                description: string | null;
            };
        } & {
            lecture: boolean;
            ecriture: boolean;
            validation: boolean;
            roleId: number;
            moduleId: number;
        })[];
    } & {
        nom: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
    create(dto: CreateRoleDto): Promise<{
        habilitations: ({
            module: {
                nom: string;
                id: number;
                code: string;
                description: string | null;
            };
        } & {
            lecture: boolean;
            ecriture: boolean;
            validation: boolean;
            roleId: number;
            moduleId: number;
        })[];
    } & {
        nom: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
    update(id: number, dto: CreateRoleDto): Promise<{
        habilitations: ({
            module: {
                nom: string;
                id: number;
                code: string;
                description: string | null;
            };
        } & {
            lecture: boolean;
            ecriture: boolean;
            validation: boolean;
            roleId: number;
            moduleId: number;
        })[];
    } & {
        nom: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
    remove(id: number): Promise<{
        nom: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
}
