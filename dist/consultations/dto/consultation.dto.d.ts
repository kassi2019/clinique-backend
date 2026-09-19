export declare class PatientAdminDto {
    profession?: string;
    nationalite?: string;
    scolarisation?: string;
    statutConjugal?: string;
    typePopulation?: string;
    populationsRisque?: string;
    protectionSociale?: string;
    residenceHabituelle?: string;
    residenceActuelle?: string;
}
export declare class CreerConsultationDto {
    motif?: string;
    observation?: string;
    diagnostic?: string;
    hospitalisation?: boolean;
    hospitalisationDuree?: string;
    typeHospitalisation?: string;
    hospitalisationDureeJours?: number;
    litId?: number;
    modeEntree?: string;
    modeEntreeAutre?: string;
    traitementAnterieur?: string;
    hta?: boolean;
    diabete?: boolean;
    antecedentsMedicaux?: string;
    antecedentsChirurgicaux?: string;
    ddr?: string;
    grossesseEnCours?: boolean;
    tabac?: boolean;
    alcool?: boolean;
    typeSuivi?: string;
    consultantType?: string;
    imc?: string;
    zscore?: string;
    frequenceRespiratoire?: string;
    perimetreBrachial?: string;
    perimetreCranien?: string;
    rechercheTB?: string;
    pathologiesAssociees?: string;
    tdrPaludisme?: string;
    goutteEpaisse?: string;
    mildaEligible?: string;
    mildaRemise?: string;
    cdipPropose?: boolean;
    cdipRealise?: boolean;
    codeDepistage?: string;
    glycemieAjeun?: string;
    glycemieNonAjeun?: string;
    autresExamens?: string;
    conduiteTenir?: string;
    issueSortie?: string;
    casPresumeTB?: string;
    moDureeHeures?: number;
    moDureeMinutes?: number;
    moDebut?: string;
    moFin?: string;
    patient?: PatientAdminDto;
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
export declare class PrescrireExamenDto {
    prestationId?: number;
    libelle?: string;
}
