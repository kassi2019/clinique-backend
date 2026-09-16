import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
export declare class PersonnelService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        search?: string;
        statut?: string;
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
            service: {
                nom: string;
                id: number;
                cliniqueId: number;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                description: string | null;
                actif: boolean;
            };
            utilisateur: {
                role: {
                    nom: string;
                    code: string;
                };
                id: number;
                statut: string;
                matricule: string;
            };
        } & {
            nom: string;
            id: number;
            cliniqueId: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            telephone: string | null;
            matricule: string;
            prenom: string;
            sexe: string | null;
            photo: string | null;
            fonction: string;
            serviceId: number | null;
            email: string | null;
            dateEmbauche: Date | null;
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
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
            actif: boolean;
        };
        utilisateur: {
            role: {
                nom: string;
                code: string;
            };
            id: number;
            statut: string;
            matricule: string;
        };
    } & {
        nom: string;
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        telephone: string | null;
        matricule: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        fonction: string;
        serviceId: number | null;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
    create(dto: CreatePersonnelDto): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
            actif: boolean;
        };
        utilisateur: {
            role: {
                nom: string;
                code: string;
            };
            id: number;
            statut: string;
            matricule: string;
        };
    } & {
        nom: string;
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        telephone: string | null;
        matricule: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        fonction: string;
        serviceId: number | null;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
    update(id: number, dto: UpdatePersonnelDto): Promise<{
        clinique: {
            nom: string;
            id: number;
            code: string;
        };
        service: {
            nom: string;
            id: number;
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
            actif: boolean;
        };
        utilisateur: {
            role: {
                nom: string;
                code: string;
            };
            id: number;
            statut: string;
            matricule: string;
        };
    } & {
        nom: string;
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        telephone: string | null;
        matricule: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        fonction: string;
        serviceId: number | null;
        email: string | null;
        dateEmbauche: Date | null;
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
            cliniqueId: number;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
            actif: boolean;
        };
        utilisateur: {
            role: {
                nom: string;
                code: string;
            };
            id: number;
            statut: string;
            matricule: string;
        };
    } & {
        nom: string;
        id: number;
        cliniqueId: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        telephone: string | null;
        matricule: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        fonction: string;
        serviceId: number | null;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
}
