import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';
import { ServicesService } from './services.service';
export declare class ServicesController {
    private servicesService;
    constructor(servicesService: ServicesService);
    findAll(cliniqueId?: string, page?: string, perPage?: string): Promise<{
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
