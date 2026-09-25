import { RapportsService } from './rapports.service';
export declare class RapportsController {
    private rapportsService;
    constructor(rapportsService: RapportsService);
    lister(cliniqueId: number): Promise<{
        id: number;
        updatedAt: Date;
        statut: string;
        mois: number;
        annee: number;
    }[]>;
    getRapport(cliniqueId: number, mois: number, annee: number): Promise<{
        portes: Record<string, boolean>;
        parametres: {
            logoRapportGauche: string;
            logoRapportCentre: string;
            logoRapportDroit: string;
            sigVersion: string;
        };
        valeurs: {
            id: number;
            valeur: number | null;
            rapportId: number;
            tableau: string;
            ligne: number;
            colonne: number;
        }[];
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        immatriculation: string | null;
        districtNom: string | null;
        districtCode: string | null;
        regionNom: string | null;
        regionCode: string | null;
        populationDesservie: number | null;
        observations: string | null;
        mois: number;
        annee: number;
        etablissement: string | null;
        realiseParNom: string | null;
        realiseParFonction: string | null;
        realiseParContact: string | null;
    }>;
    update(id: number, body: Record<string, unknown>): Promise<{
        portes: Record<string, boolean>;
        valeurs: {
            id: number;
            valeur: number | null;
            rapportId: number;
            tableau: string;
            ligne: number;
            colonne: number;
        }[];
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        immatriculation: string | null;
        districtNom: string | null;
        districtCode: string | null;
        regionNom: string | null;
        regionCode: string | null;
        populationDesservie: number | null;
        observations: string | null;
        mois: number;
        annee: number;
        etablissement: string | null;
        realiseParNom: string | null;
        realiseParFonction: string | null;
        realiseParContact: string | null;
    }>;
    reimporterEntete(id: number): Promise<{
        portes: Record<string, boolean>;
        id: number;
        cliniqueId: number;
        createdAt: Date;
        updatedAt: Date;
        statut: string;
        immatriculation: string | null;
        districtNom: string | null;
        districtCode: string | null;
        regionNom: string | null;
        regionCode: string | null;
        populationDesservie: number | null;
        observations: string | null;
        mois: number;
        annee: number;
        etablissement: string | null;
        realiseParNom: string | null;
        realiseParFonction: string | null;
        realiseParContact: string | null;
    }>;
    saveValeurs(id: number, body: {
        tableau: string;
        valeurs: {
            ligne: number;
            colonne: number;
            valeur: number | null;
        }[];
    }): Promise<{
        tableau: string;
        enregistrees: number;
    }>;
    preRemplir(id: number): Promise<Record<string, {
        ligne: number;
        colonne: number;
        valeur: number | null;
    }[]>>;
}
