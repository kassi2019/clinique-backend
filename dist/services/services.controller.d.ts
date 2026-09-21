import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';
import { ServicesService } from './services.service';
export declare class ServicesController {
    private servicesService;
    constructor(servicesService: ServicesService);
    findAll(cliniqueId?: string, page?: string, perPage?: string): Promise<{
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
