export declare const MODES_PAIEMENT: readonly ["ESPECES", "MOBILE_MONEY", "CARTE"];
export declare class EncaisserDto {
    lignesIds: number[];
    modePaiement: string;
}
export declare class AnnulerPaiementDto {
    motif: string;
}
export declare class AjouterPrestationDto {
    prestationId: number;
}
