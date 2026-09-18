export declare class EnregistrerPrelevementDto {
    passagePrestationId: number;
}
export declare class ResultatLigneDto {
    parametre: string;
    valeur?: string;
    unite?: string;
    normes?: string;
}
export declare class EnregistrerResultatsDto {
    lignes: ResultatLigneDto[];
    conclusion?: string;
}
