import { PrismaService } from '../prisma/prisma.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
export declare class UtilisateursService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: {
        page?: number;
        perPage?: number;
    }): Promise<{
        data: ({
            personnel: {
                service: {
                    nom: string;
                    id: number;
                };
                nom: string;
                id: number;
                statut: string;
                matricule: string;
                prenom: string;
                fonction: string;
            };
            role: {
                nom: string;
                id: number;
                code: string;
            };
        } & {
            id: number;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            personnelId: number;
            matricule: string;
            motDePasse: string;
            roleId: number;
            derniereConnexion: Date | null;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        personnel: {
            service: {
                nom: string;
                id: number;
            };
            nom: string;
            id: number;
            statut: string;
            matricule: string;
            prenom: string;
            fonction: string;
        };
        role: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
    }>;
    create(dto: CreateUtilisateurDto): Promise<{
        personnel: {
            service: {
                nom: string;
                id: number;
            };
            nom: string;
            id: number;
            statut: string;
            matricule: string;
            prenom: string;
            fonction: string;
        };
        role: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
    }>;
    update(id: number, dto: UpdateUtilisateurDto): Promise<{
        personnel: {
            service: {
                nom: string;
                id: number;
            };
            nom: string;
            id: number;
            statut: string;
            matricule: string;
            prenom: string;
            fonction: string;
        };
        role: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
    }>;
    resetMotDePasse(id: number, motDePasse: string): Promise<{
        personnel: {
            service: {
                nom: string;
                id: number;
            };
            nom: string;
            id: number;
            statut: string;
            matricule: string;
            prenom: string;
            fonction: string;
        };
        role: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
    }>;
    remove(id: number): Promise<{
        personnel: {
            service: {
                nom: string;
                id: number;
            };
            nom: string;
            id: number;
            statut: string;
            matricule: string;
            prenom: string;
            fonction: string;
        };
        role: {
            nom: string;
            id: number;
            code: string;
        };
    } & {
        id: number;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
    }>;
}
