export declare class CreerChambreDto {
    numero: string;
    typeChambreId?: number;
    tarifJournalier?: number;
}
export declare class CreerTypeChambreDto {
    libelle: string;
}
export declare class CreerLitDto {
    numero: string;
}
export declare class AdmissionDto {
    litId: number;
    dateEntree?: string;
    motif?: string;
}
export declare class SuiviDto {
    observations?: string;
}
export declare const MOTIFS_SORTIE: readonly ["EXEAT", "TRANSFERT", "DECES", "AUTRE"];
export declare class SortieDto {
    dateSortie?: string;
    sortieMotif: string;
}
