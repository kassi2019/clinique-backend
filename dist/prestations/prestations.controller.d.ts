import { CreatePrestationDto, UpdatePrestationDto } from './dto/create-prestation.dto';
import { PrestationsService } from './prestations.service';
export declare class PrestationsController {
    private prestationsService;
    constructor(prestationsService: PrestationsService);
    findAll(cliniqueId?: string, serviceId?: string, search?: string, page?: string, perPage?: string): Promise<{
        data: ({
            clinique: {
                id: number;
                nom: string;
                code: string;
            };
            service: {
                id: number;
                nom: string;
                code: string;
            };
        } & {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            serviceId: number;
            libelle: string;
            montant: import("@prisma/client/runtime/library").Decimal;
            code: string;
            type: string;
            actif: boolean;
        } & {
            montant: number;
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
        service: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        serviceId: number;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        code: string;
        type: string;
        actif: boolean;
    } & {
        montant: number;
    }>;
    create(dto: CreatePrestationDto): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        serviceId: number;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        code: string;
        type: string;
        actif: boolean;
    } & {
        montant: number;
    }>;
    update(id: number, dto: UpdatePrestationDto): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        serviceId: number;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        code: string;
        type: string;
        actif: boolean;
    } & {
        montant: number;
    }>;
    remove(id: number): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        createdAt: Date;
        id: number;
        cliniqueId: number;
        updatedAt: Date;
        serviceId: number;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
        code: string;
        type: string;
        actif: boolean;
    } & {
        montant: number;
    }>;
}
