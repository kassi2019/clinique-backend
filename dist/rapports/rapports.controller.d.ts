import { RapportsService } from './rapports.service';
export declare class RapportsController {
    private rapportsService;
    constructor(rapportsService: RapportsService);
    lister(cliniqueId: number): Promise<{
        id: number;
        statut: string;
        updatedAt: Date;
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
            ligne: number;
            valeur: number | null;
            rapportId: number;
            tableau: string;
            colonne: number;
        }[];
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
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
            ligne: number;
            valeur: number | null;
            rapportId: number;
            tableau: string;
            colonne: number;
        }[];
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
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
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
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
