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
                    id: number;
                    nom: string;
                    code: string;
                    description: string | null;
                };
            } & {
                roleId: number;
                lecture: boolean;
                ecriture: boolean;
                validation: boolean;
                moduleId: number;
            })[];
        } & {
            id: number;
            nom: string;
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
                id: number;
                nom: string;
                code: string;
                description: string | null;
            };
        } & {
            roleId: number;
            lecture: boolean;
            ecriture: boolean;
            validation: boolean;
            moduleId: number;
        })[];
    } & {
        id: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
    create(dto: CreateRoleDto): Promise<{
        habilitations: ({
            module: {
                id: number;
                nom: string;
                code: string;
                description: string | null;
            };
        } & {
            roleId: number;
            lecture: boolean;
            ecriture: boolean;
            validation: boolean;
            moduleId: number;
        })[];
    } & {
        id: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
    update(id: number, dto: CreateRoleDto): Promise<{
        habilitations: ({
            module: {
                id: number;
                nom: string;
                code: string;
                description: string | null;
            };
        } & {
            roleId: number;
            lecture: boolean;
            ecriture: boolean;
            validation: boolean;
            moduleId: number;
        })[];
    } & {
        id: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
}
