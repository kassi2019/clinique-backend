export declare class CreateCliniqueDto {
    code: string;
    nom: string;
    adresse?: string;
    telephone?: string;
    statut?: string;
    immatriculation?: string;
    districtNom?: string;
    districtCode?: string;
    regionNom?: string;
    regionCode?: string;
    populationDesservie?: number;
    responsableRapportNom?: string;
    responsableRapportFonction?: string;
    responsableRapportContact?: string;
}
export declare class UpdateCliniqueDto {
    code?: string;
    nom?: string;
    adresse?: string;
    telephone?: string;
    statut?: string;
    immatriculation?: string;
    districtNom?: string;
    districtCode?: string;
    regionNom?: string;
    regionCode?: string;
    populationDesservie?: number;
    responsableRapportNom?: string;
    responsableRapportFonction?: string;
    responsableRapportContact?: string;
}
