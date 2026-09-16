import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
export declare class RolesController {
    private rolesService;
    constructor(rolesService: RolesService);
    findAll(page?: string, perPage?: string): Promise<{
        data: ({
            habilitations: ({
                module: {
                    nom: string;
                    id: number;
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
            roleId: number;
            lecture: boolean;
            ecriture: boolean;
            validation: boolean;
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
            roleId: number;
            lecture: boolean;
            ecriture: boolean;
            validation: boolean;
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
            roleId: number;
            lecture: boolean;
            ecriture: boolean;
            validation: boolean;
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
