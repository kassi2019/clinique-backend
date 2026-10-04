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
                fonction: string;
                service: {
                    id: number;
                    nom: string;
                };
                id: number;
                matricule: string;
                statut: string;
                nom: string;
                prenom: string;
            };
            role: {
                id: number;
                nom: string;
                code: string;
            };
        } & {
            createdAt: Date;
            id: number;
            personnelId: number;
            matricule: string;
            motDePasse: string;
            roleId: number;
            statut: string;
            derniereConnexion: Date | null;
            updatedAt: Date;
            disponibilite: string;
            derniereActivite: Date | null;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        personnel: {
            fonction: string;
            service: {
                id: number;
                nom: string;
            };
            id: number;
            matricule: string;
            statut: string;
            nom: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        createdAt: Date;
        id: number;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        statut: string;
        derniereConnexion: Date | null;
        updatedAt: Date;
        disponibilite: string;
        derniereActivite: Date | null;
    }>;
    create(dto: CreateUtilisateurDto): Promise<{
        personnel: {
            fonction: string;
            service: {
                id: number;
                nom: string;
            };
            id: number;
            matricule: string;
            statut: string;
            nom: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        createdAt: Date;
        id: number;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        statut: string;
        derniereConnexion: Date | null;
        updatedAt: Date;
        disponibilite: string;
        derniereActivite: Date | null;
    }>;
    update(id: number, dto: UpdateUtilisateurDto): Promise<{
        personnel: {
            fonction: string;
            service: {
                id: number;
                nom: string;
            };
            id: number;
            matricule: string;
            statut: string;
            nom: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        createdAt: Date;
        id: number;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        statut: string;
        derniereConnexion: Date | null;
        updatedAt: Date;
        disponibilite: string;
        derniereActivite: Date | null;
    }>;
    resetMotDePasse(id: number, motDePasse: string): Promise<{
        personnel: {
            fonction: string;
            service: {
                id: number;
                nom: string;
            };
            id: number;
            matricule: string;
            statut: string;
            nom: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        createdAt: Date;
        id: number;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        statut: string;
        derniereConnexion: Date | null;
        updatedAt: Date;
        disponibilite: string;
        derniereActivite: Date | null;
    }>;
    remove(id: number): Promise<{
        personnel: {
            fonction: string;
            service: {
                id: number;
                nom: string;
            };
            id: number;
            matricule: string;
            statut: string;
            nom: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        createdAt: Date;
        id: number;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        statut: string;
        derniereConnexion: Date | null;
        updatedAt: Date;
        disponibilite: string;
        derniereActivite: Date | null;
    }>;
}
