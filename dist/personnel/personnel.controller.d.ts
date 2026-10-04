import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { PersonnelService } from './personnel.service';
export declare class PersonnelController {
    private personnelService;
    constructor(personnelService: PersonnelService);
    findAll(search?: string, statut?: string, cliniqueId?: string, page?: string, perPage?: string): Promise<{
        data: ({
            clinique: {
                id: number;
                nom: string;
                code: string;
            };
            service: {
                createdAt: Date;
                id: number;
                cliniqueId: number;
                updatedAt: Date;
                nom: string;
                actif: boolean;
                code: string;
                description: string | null;
            };
            utilisateur: {
                role: {
                    nom: string;
                    code: string;
                };
                id: number;
                matricule: string;
                statut: string;
            };
        } & {
            fonction: string;
            createdAt: Date;
            id: number;
            cliniqueId: number;
            matricule: string;
            statut: string;
            updatedAt: Date;
            nom: string;
            prenom: string;
            sexe: string | null;
            photo: string | null;
            serviceId: number | null;
            telephone: string | null;
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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
            actif: boolean;
            code: string;
            description: string | null;
        };
        utilisateur: {
            role: {
                nom: string;
                code: string;
            };
            id: number;
            matricule: string;
            statut: string;
        };
    } & {
        fonction: string;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        matricule: string;
        statut: string;
        updatedAt: Date;
        nom: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        serviceId: number | null;
        telephone: string | null;
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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
            actif: boolean;
            code: string;
            description: string | null;
        };
        utilisateur: {
            role: {
                nom: string;
                code: string;
            };
            id: number;
            matricule: string;
            statut: string;
        };
    } & {
        fonction: string;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        matricule: string;
        statut: string;
        updatedAt: Date;
        nom: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        serviceId: number | null;
        telephone: string | null;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
    update(id: number, dto: UpdatePersonnelDto): Promise<{
        clinique: {
            id: number;
            nom: string;
            code: string;
        };
        service: {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
            actif: boolean;
            code: string;
            description: string | null;
        };
        utilisateur: {
            role: {
                nom: string;
                code: string;
            };
            id: number;
            matricule: string;
            statut: string;
        };
    } & {
        fonction: string;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        matricule: string;
        statut: string;
        updatedAt: Date;
        nom: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        serviceId: number | null;
        telephone: string | null;
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
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
            actif: boolean;
            code: string;
            description: string | null;
        };
        utilisateur: {
            role: {
                nom: string;
                code: string;
            };
            id: number;
            matricule: string;
            statut: string;
        };
    } & {
        fonction: string;
        createdAt: Date;
        id: number;
        cliniqueId: number;
        matricule: string;
        statut: string;
        updatedAt: Date;
        nom: string;
        prenom: string;
        sexe: string | null;
        photo: string | null;
        serviceId: number | null;
        telephone: string | null;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
}
