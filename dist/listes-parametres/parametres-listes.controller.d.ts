import { ListesParametresService } from './listes-parametres.service';
export declare class ParametresListesController {
    private listes;
    constructor(listes: ListesParametresService);
    fonctions(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerFonction(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierFonction(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerFonction(id: number): Promise<any>;
    posologies(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerPosologie(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierPosologie(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerPosologie(id: number): Promise<any>;
    diagnostics(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerDiagnostic(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierDiagnostic(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerDiagnostic(id: number): Promise<any>;
    pathologies(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerPathologie(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierPathologie(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerPathologie(id: number): Promise<any>;
    nationalites(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerNationalite(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierNationalite(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerNationalite(id: number): Promise<any>;
    residences(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerResidence(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierResidence(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerResidence(id: number): Promise<any>;
    fournisseurs(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerFournisseur(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierFournisseur(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerFournisseur(id: number): Promise<any>;
    professions(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerProfession(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierProfession(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerProfession(id: number): Promise<any>;
    motifs(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerMotif(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierMotif(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerMotif(id: number): Promise<any>;
    quartiers(cliniqueId: number, tous?: string, page?: string, perPage?: string): Promise<any>;
    creerQuartier(b: {
        cliniqueId: number;
        libelle: string;
    }): Promise<any>;
    modifierQuartier(id: number, b: {
        libelle: string;
    }): Promise<any>;
    basculerQuartier(id: number): Promise<any>;
}
