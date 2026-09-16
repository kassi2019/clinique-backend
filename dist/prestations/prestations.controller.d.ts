import { CreatePrestationDto, UpdatePrestationDto } from './dto/create-prestation.dto';
import { PrestationsService } from './prestations.service';
export declare class PrestationsController {
    private prestationsService;
    constructor(prestationsService: PrestationsService);
    findAll(cliniqueId?: string, serviceId?: string, search?: string, page?: string, perPage?: string): Promise<{
        data: ({
            clinique: {
                nom: string;
                id: number;
                code: string;
            };
            service: {
                nom: string;
                id: number;
                code: string;
            };
        } & {
            type: string;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            actif: boolean;
            serviceId: number;
            libelle: string;
            montant: import("@prisma/client/runtime/library").Decimal;
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
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        actif: boolean;
        serviceId: number;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
    } & {
        montant: number;
    }>;
    create(dto: CreatePrestationDto): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        actif: boolean;
        serviceId: number;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
    } & {
        montant: number;
    }>;
    update(id: number, dto: UpdatePrestationDto): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        actif: boolean;
        serviceId: number;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
    } & {
        montant: number;
    }>;
    remove(id: number): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        type: string;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        actif: boolean;
        serviceId: number;
        libelle: string;
        montant: import("@prisma/client/runtime/library").Decimal;
    } & {
        montant: number;
    }>;
}
