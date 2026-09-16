import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: {
        cliniqueId?: number;
        page?: number;
        perPage?: number;
    }): Promise<{
        data: ({
            clinique: {
                nom: string;
                id: number;
                code: string;
            };
        } & {
            nom: string;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
            actif: boolean;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        actif: boolean;
    }>;
    create(dto: CreateServiceDto): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        actif: boolean;
    }>;
    update(id: number, dto: UpdateServiceDto): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        actif: boolean;
    }>;
    remove(id: number): Promise<{
        nom: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        actif: boolean;
    }>;
}
