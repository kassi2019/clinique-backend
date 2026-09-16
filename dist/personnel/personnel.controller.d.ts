import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { PersonnelService } from './personnel.service';
export declare class PersonnelController {
    private personnelService;
    constructor(personnelService: PersonnelService);
    findAll(search?: string, statut?: string, cliniqueId?: string, page?: string, perPage?: string): Promise<{
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
            serviceId: number | null;
            statut: string;
            createdAt: Date;
            updatedAt: Date;
            telephone: string | null;
            prenom: string;
            sexe: string | null;
            matricule: string;
            photo: string | null;
            fonction: string;
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
        serviceId: number | null;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        telephone: string | null;
        prenom: string;
        sexe: string | null;
        matricule: string;
        photo: string | null;
        fonction: string;
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
        serviceId: number | null;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        telephone: string | null;
        prenom: string;
        sexe: string | null;
        matricule: string;
        photo: string | null;
        fonction: string;
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
        serviceId: number | null;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        telephone: string | null;
        prenom: string;
        sexe: string | null;
        matricule: string;
        photo: string | null;
        fonction: string;
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
        serviceId: number | null;
        statut: string;
        createdAt: Date;
        updatedAt: Date;
        telephone: string | null;
        prenom: string;
        sexe: string | null;
        matricule: string;
        photo: string | null;
        fonction: string;
        email: string | null;
        dateEmbauche: Date | null;
    }>;
}
