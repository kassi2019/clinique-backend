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
                nom: string;
                statut: string;
                matricule: string;
                prenom: string;
            };
            role: {
                id: number;
                nom: string;
                code: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            statut: string;
            personnelId: number;
            matricule: string;
            motDePasse: string;
            roleId: number;
            derniereConnexion: Date | null;
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
            nom: string;
            statut: string;
            matricule: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
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
            nom: string;
            statut: string;
            matricule: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
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
            nom: string;
            statut: string;
            matricule: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
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
            nom: string;
            statut: string;
            matricule: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
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
            nom: string;
            statut: string;
            matricule: string;
            prenom: string;
        };
        role: {
            id: number;
            nom: string;
            code: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        personnelId: number;
        matricule: string;
        motDePasse: string;
        roleId: number;
        derniereConnexion: Date | null;
        disponibilite: string;
        derniereActivite: Date | null;
    }>;
}
