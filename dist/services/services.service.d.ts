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
                id: number;
                nom: string;
                code: string;
            };
        } & {
            id: number;
            cliniqueId: number;
            nom: string;
            actif: boolean;
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
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
    create(dto: CreateServiceDto): Promise<{
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
    update(id: number, dto: UpdateServiceDto): Promise<{
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        cliniqueId: number;
        nom: string;
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
    }>;
}
