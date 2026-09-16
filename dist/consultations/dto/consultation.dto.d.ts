export declare class CreerConsultationDto {
    motif?: string;
    observation?: string;
    diagnostic?: string;
    hospitalisation?: boolean;
    hospitalisationDuree?: string;
}
export declare class PrescriptionDto {
    medicamentId?: number;
    nom?: string;
    forme?: string;
    posologie?: string;
    quantite?: string;
    duree?: string;
}
export declare class PrescrireExamensDto {
    lignesIds: number[];
}
