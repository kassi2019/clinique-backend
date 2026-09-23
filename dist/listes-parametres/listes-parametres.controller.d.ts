import { ListesParametresService } from './listes-parametres.service';
export declare class ListesParametresController {
    private listesService;
    constructor(listesService: ListesParametresService);
    findAll(cliniqueId: number, code?: string, tous?: string, page?: string, perPage?: string): Promise<any>;
    creer(body: {
        cliniqueId: number;
        code: string;
        libelle: string;
    }): Promise<any>;
    importer(body: {
        cliniqueId: number;
        code: string;
        libelles: string[];
    }): Promise<{
        ajoutes: number;
        total: number;
    }>;
    modifier(id: number, code: string, body: {
        libelle: string;
    }): Promise<any>;
    desactiver(id: number, code?: string): Promise<any>;
}
