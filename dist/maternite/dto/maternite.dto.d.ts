export declare class CreateGrossesseDto {
    cliniqueId: number;
    patientId: number;
    ddr: string;
    gravidite?: number;
    parite?: number;
    antecedentsObstetricaux?: string;
    facteursRisque?: string;
}
export declare class UpdateGrossesseDto {
    ddr?: string;
    gravidite?: number;
    parite?: number;
    antecedentsObstetricaux?: string;
    facteursRisque?: string;
    statut?: string;
}
export declare class CreateVisiteCpnDto {
    date: string;
    ageGestationnelSA?: string;
    poids?: number;
    tensionGauche?: string;
    tensionDroite?: string;
    hauteurUterine?: string;
    bcf?: string;
    mouvementsActifs?: string;
    oedemes?: string;
    albumine?: string;
    sucre?: string;
    presentation?: string;
    tv?: string;
    conseils?: string;
    prochaineVisite?: string;
}
export declare class UpdateVisiteCpnDto {
    date?: string;
    ageGestationnelSA?: string;
    poids?: number;
    tensionGauche?: string;
    tensionDroite?: string;
    hauteurUterine?: string;
    bcf?: string;
    mouvementsActifs?: string;
    oedemes?: string;
    albumine?: string;
    sucre?: string;
    presentation?: string;
    tv?: string;
    conseils?: string;
    prochaineVisite?: string;
}
export declare class CreateAccouchementDto {
    dateHeure: string;
    voie?: string;
    termeSA?: string;
    sexeEnfant?: string;
    poidsEnfant?: number;
    apgar?: string;
    issueMere?: string;
    issueEnfant?: string;
    complications?: string;
    lieu?: string;
}
export declare class UpdateAccouchementDto {
    dateHeure?: string;
    voie?: string;
    termeSA?: string;
    sexeEnfant?: string;
    poidsEnfant?: number;
    apgar?: string;
    issueMere?: string;
    issueEnfant?: string;
    complications?: string;
    lieu?: string;
}
