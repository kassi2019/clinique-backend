export declare const TYPES_PRESTATION: readonly ["CONSULTATION", "EXAMEN_LABO", "IMAGERIE", "SOIN", "MATERNITE", "HOSPITALISATION", "MEDICAMENT", "AUTRE"];
export declare class CreatePrestationDto {
    cliniqueId: number;
    serviceId: number;
    code: string;
    libelle: string;
    type: string;
    montant: number;
    actif?: boolean;
}
export declare class UpdatePrestationDto {
    cliniqueId?: number;
    serviceId?: number;
    code?: string;
    libelle?: string;
    type?: string;
    montant?: number;
    actif?: boolean;
}
