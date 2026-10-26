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
            createdAt: Date;
            id: number;
            updatedAt: Date;
            nom: string;
            code: string;
            description: string | null;
            signatureAutorisee: boolean;
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
        createdAt: Date;
        id: number;
        updatedAt: Date;
        nom: string;
        code: string;
        description: string | null;
        signatureAutorisee: boolean;
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
        createdAt: Date;
        id: number;
        updatedAt: Date;
        nom: string;
        code: string;
        description: string | null;
        signatureAutorisee: boolean;
    }>;
    autoriserSignature(id: number, autorisee: boolean): Promise<{
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
        createdAt: Date;
        id: number;
        updatedAt: Date;
        nom: string;
        code: string;
        description: string | null;
        signatureAutorisee: boolean;
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
        createdAt: Date;
        id: number;
        updatedAt: Date;
        nom: string;
        code: string;
        description: string | null;
        signatureAutorisee: boolean;
    }>;
    remove(id: number): Promise<{
        createdAt: Date;
        id: number;
        updatedAt: Date;
        nom: string;
        code: string;
        description: string | null;
        signatureAutorisee: boolean;
    }>;
}
