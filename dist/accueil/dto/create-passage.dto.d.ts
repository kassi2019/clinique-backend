export declare class UpdatePatientDto {
    nom?: string;
    prenom?: string;
    age?: string | number;
    sexe?: string;
    ville?: string;
    quartier?: string;
    profession?: string;
    telephone?: string;
    nationalite?: string;
    statutConjugal?: string;
    scolarisation?: string;
    residenceHabituelle?: string;
    residenceActuelle?: string;
}
export declare class UpdatePassageDto {
    serviceId?: number;
    typePatient?: string;
    motif?: string;
    referent?: string;
    prestationDemandee?: string;
    taille?: string;
    temperature?: number;
    pouls?: number;
    tensionGauche?: string;
    tensionDroite?: string;
    poids?: number;
    perimetreBrachial?: string;
    perimetreCranien?: string;
    patient?: UpdatePatientDto;
}
export declare class NouveauPatientDto {
    nom: string;
    prenom: string;
    age?: string | number;
    sexe?: string;
    ville?: string;
    quartier?: string;
    profession?: string;
    telephone?: string;
}
export declare class CreatePassageDto {
    cliniqueId: number;
    patientId?: number;
    nouveauPatient?: NouveauPatientDto;
    serviceId: number;
    typePatient?: string;
    motif?: string;
    referent?: string;
    prestationDemandee?: string;
    consultationPrestationId?: number;
    actePrestationId?: number;
    taille?: string;
    temperature?: number;
    pouls?: number;
    tensionGauche?: string;
    tensionDroite?: string;
    poids?: number;
    perimetreBrachial?: string;
    perimetreCranien?: string;
}
