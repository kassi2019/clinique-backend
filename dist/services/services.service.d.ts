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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
            actif: boolean;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        code: string;
        description: string | null;
    }>;
    create(dto: CreateServiceDto): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        code: string;
        description: string | null;
    }>;
    update(id: number, dto: UpdateServiceDto): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        code: string;
        description: string | null;
    }>;
    remove(id: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        nom: string;
        actif: boolean;
        code: string;
        description: string | null;
    }>;
}
