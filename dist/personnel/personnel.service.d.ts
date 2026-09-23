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
                id: number;
                nom: string;
                code: string;
            };
            service: {
                id: number;
                cliniqueId: number;
                nom: string;
                actif: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                description: string | null;
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
            fonction: string;
            id: number;
            cliniqueId: number;
            nom: string;
            createdAt: Date;
            updatedAt: Date;
            statut: string;
            telephone: string | null;
            matricule: string;
            prenom: string;
            sexe: string | null;
            photo: string | null;
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
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            cliniqueId: number;
            nom: string;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
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
        fonction: string;
        id: number;
        cliniqueId: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        telephone: string | null;
        matricule: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        serviceId: number | null;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
    create(dto: CreatePersonnelDto): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            cliniqueId: number;
            nom: string;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
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
        fonction: string;
        id: number;
        cliniqueId: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        telephone: string | null;
        matricule: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        serviceId: number | null;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
    private genererMatricule;
    update(id: number, dto: UpdatePersonnelDto): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            cliniqueId: number;
            nom: string;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
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
        fonction: string;
        id: number;
        cliniqueId: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        telephone: string | null;
        matricule: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        serviceId: number | null;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
    remove(id: number): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            id: number;
            cliniqueId: number;
            nom: string;
            actif: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
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
        fonction: string;
        id: number;
        cliniqueId: number;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        telephone: string | null;
        matricule: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        serviceId: number | null;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
}
