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
