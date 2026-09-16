import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { ResetMotDePasseDto, UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { UtilisateursService } from './utilisateurs.service';
export declare class UtilisateursController {
    private utilisateursService;
    constructor(utilisateursService: UtilisateursService);
    findAll(page?: string, perPage?: string): Promise<{
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
    resetMotDePasse(id: number, dto: ResetMotDePasseDto): Promise<{
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
