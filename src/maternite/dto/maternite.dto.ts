import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGrossesseDto {
  @IsInt()
  cliniqueId: number;

  @IsInt()
  patientId: number;

  @IsDateString()
  ddr: string;

  @IsOptional()
  @IsInt()
  gravidite?: number;

  @IsOptional()
  @IsInt()
  parite?: number;

  @IsOptional()
  @IsString()
  antecedentsObstetricaux?: string;

  @IsOptional()
  @IsString()
  facteursRisque?: string;

  // ── Registre CPN officiel ──
  @IsOptional()
  @IsString()
  numeroGestante?: string;

  @IsOptional()
  @IsString()
  modeEntree?: string;

  @IsOptional()
  @IsString()
  antecedentsMedicaux?: string;

  @IsOptional()
  @IsString()
  antecedentsChirurgicaux?: string;

  @IsOptional()
  @IsInt()
  enfantsVivants?: number;

  @IsOptional()
  @IsInt()
  enfantsDecedes?: number;

  @IsOptional()
  @IsInt()
  cesariennes?: number;

  @IsOptional()
  @IsInt()
  avortements?: number;

  @IsOptional()
  @IsString()
  toxemie?: string;

  @IsOptional()
  @IsIn(['NON_VACCINEE', 'INCOMPLETEMENT_VACCINEE', 'CORRECTEMENT_VACCINEE'])
  vatStatut?: string;

  @IsOptional()
  @IsDateString()
  vat1?: string;

  @IsOptional()
  @IsDateString()
  vat2?: string;

  @IsOptional()
  @IsDateString()
  vatRappel?: string;

  @IsOptional()
  @IsIn(['POSITIF', 'NEGATIF', 'INCONNU'])
  statutVih?: string;
}

export class UpdateGrossesseDto {
  @IsOptional()
  @IsDateString()
  ddr?: string;

  @IsOptional()
  @IsInt()
  gravidite?: number;

  @IsOptional()
  @IsInt()
  parite?: number;

  @IsOptional()
  @IsString()
  antecedentsObstetricaux?: string;

  @IsOptional()
  @IsString()
  facteursRisque?: string;

  @IsOptional()
  @IsIn(['EN_COURS', 'ACCOUCHEE', 'TERMINEE'])
  statut?: string;

  // ── Registre CPN officiel ──
  @IsOptional()
  @IsString()
  numeroGestante?: string;

  @IsOptional()
  @IsString()
  modeEntree?: string;

  @IsOptional()
  @IsString()
  antecedentsMedicaux?: string;

  @IsOptional()
  @IsString()
  antecedentsChirurgicaux?: string;

  @IsOptional()
  @IsInt()
  enfantsVivants?: number;

  @IsOptional()
  @IsInt()
  enfantsDecedes?: number;

  @IsOptional()
  @IsInt()
  cesariennes?: number;

  @IsOptional()
  @IsInt()
  avortements?: number;

  @IsOptional()
  @IsString()
  toxemie?: string;

  @IsOptional()
  @IsIn(['NON_VACCINEE', 'INCOMPLETEMENT_VACCINEE', 'CORRECTEMENT_VACCINEE'])
  vatStatut?: string;

  @IsOptional()
  @IsDateString()
  vat1?: string;

  @IsOptional()
  @IsDateString()
  vat2?: string;

  @IsOptional()
  @IsDateString()
  vatRappel?: string;

  @IsOptional()
  @IsIn(['POSITIF', 'NEGATIF', 'INCONNU'])
  statutVih?: string;
}

export class CreateVisiteCpnDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  ageGestationnelSA?: string;

  @IsOptional()
  @IsNumber()
  poids?: number;

  @IsOptional()
  @IsString()
  taille?: string;

  @IsOptional()
  @IsString()
  tensionGauche?: string;

  @IsOptional()
  @IsString()
  tensionDroite?: string;

  @IsOptional()
  @IsString()
  hauteurUterine?: string;

  @IsOptional()
  @IsString()
  bcf?: string;

  @IsOptional()
  @IsString()
  mouvementsActifs?: string;

  @IsOptional()
  @IsString()
  oedemes?: string;

  @IsOptional()
  @IsString()
  albumine?: string;

  @IsOptional()
  @IsString()
  sucre?: string;

  @IsOptional()
  @IsString()
  presentation?: string;

  @IsOptional()
  @IsString()
  tv?: string;

  @IsOptional()
  @IsString()
  conseils?: string;

  @IsOptional()
  @IsDateString()
  prochaineVisite?: string;

  // ── Registre CPN — rapport SIG (T4 et T5) ──
  @IsOptional()
  @IsBoolean()
  risqueDepiste?: boolean;

  @IsOptional()
  @IsBoolean()
  malnutrition?: boolean;

  @IsOptional()
  @IsBoolean()
  anemie?: boolean;

  @IsOptional()
  @IsBoolean()
  syphilisPositif?: boolean;

  @IsOptional()
  @IsBoolean()
  agHbsPositif?: boolean;

  @IsOptional()
  @IsInt()
  spDose?: number;

  @IsOptional()
  @IsBoolean()
  mildaRemise?: boolean;

  @IsOptional()
  @IsBoolean()
  ferFolate?: boolean;

  @IsOptional()
  @IsBoolean()
  deparasitee?: boolean;

  @IsOptional()
  @IsBoolean()
  counselingPfppi?: boolean;
}

export class UpdateVisiteCpnDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  ageGestationnelSA?: string;

  @IsOptional()
  @IsNumber()
  poids?: number;

  @IsOptional()
  @IsString()
  taille?: string;

  @IsOptional()
  @IsString()
  tensionGauche?: string;

  @IsOptional()
  @IsString()
  tensionDroite?: string;

  @IsOptional()
  @IsString()
  hauteurUterine?: string;

  @IsOptional()
  @IsString()
  bcf?: string;

  @IsOptional()
  @IsString()
  mouvementsActifs?: string;

  @IsOptional()
  @IsString()
  oedemes?: string;

  @IsOptional()
  @IsString()
  albumine?: string;

  @IsOptional()
  @IsString()
  sucre?: string;

  @IsOptional()
  @IsString()
  presentation?: string;

  @IsOptional()
  @IsString()
  tv?: string;

  @IsOptional()
  @IsString()
  conseils?: string;

  @IsOptional()
  @IsDateString()
  prochaineVisite?: string;

  // ── Registre CPN — rapport SIG (T4 et T5) ──
  @IsOptional()
  @IsBoolean()
  risqueDepiste?: boolean;

  @IsOptional()
  @IsBoolean()
  malnutrition?: boolean;

  @IsOptional()
  @IsBoolean()
  anemie?: boolean;

  @IsOptional()
  @IsBoolean()
  syphilisPositif?: boolean;

  @IsOptional()
  @IsBoolean()
  agHbsPositif?: boolean;

  @IsOptional()
  @IsInt()
  spDose?: number;

  @IsOptional()
  @IsBoolean()
  mildaRemise?: boolean;

  @IsOptional()
  @IsBoolean()
  ferFolate?: boolean;

  @IsOptional()
  @IsBoolean()
  deparasitee?: boolean;

  @IsOptional()
  @IsBoolean()
  counselingPfppi?: boolean;
}

export class CreateAccouchementDto {
  @IsDateString()
  dateHeure: string;

  @IsOptional()
  @IsIn(['VOIE_BASSE', 'CESARIENNE'])
  voie?: string;

  @IsOptional()
  @IsString()
  termeSA?: string;

  @IsOptional()
  @IsIn(['M', 'F'])
  sexeEnfant?: string;

  @IsOptional()
  @IsNumber()
  poidsEnfant?: number;

  @IsOptional()
  @IsString()
  apgar?: string;

  @IsOptional()
  @IsString()
  issueMere?: string;

  @IsOptional()
  @IsString()
  issueEnfant?: string;

  @IsOptional()
  @IsString()
  complications?: string;

  @IsOptional()
  @IsString()
  lieu?: string;

  // ── Registre d'accouchement — rapport SIG (T7 à T10) ──
  @IsOptional()
  @IsIn(['CORRECTEMENT_VACCINEE', 'INCOMPLETEMENT_VACCINEE', 'NON_VACCINEE'])
  vatStatut?: string;

  @IsOptional()
  @IsIn(['FRAIS', 'MACERE'])
  mortNeType?: string;

  @IsOptional()
  @IsBoolean()
  declarationNaissanceRenseignee?: boolean;

  @IsOptional()
  @IsBoolean()
  declarationNaissanceComplete?: boolean;

  @IsOptional()
  @IsBoolean()
  evacueeAvant?: boolean;

  @IsOptional()
  @IsBoolean()
  evacueeApres?: boolean;

  @IsOptional()
  @IsBoolean()
  nouveauNeEvacue?: boolean;

  @IsOptional()
  @IsBoolean()
  nouveauNeProtegeTetanos?: boolean;

  @IsOptional()
  @IsBoolean()
  accouchementMultiple?: boolean;

  // ── Registre d'accouchement officiel ──
  @IsOptional()
  @IsString()
  modeEntree?: string;

  @IsOptional()
  @IsInt()
  numeroAccouchement?: number;

  @IsOptional()
  @IsDateString()
  heureArrivee?: string;

  @IsOptional()
  @IsString()
  motifAdmission?: string;

  @IsOptional()
  @IsBoolean()
  enTravail?: boolean;

  @IsOptional()
  @IsString()
  contractions?: string;

  @IsOptional()
  @IsBoolean()
  pocheEauxIntacte?: boolean;

  @IsOptional()
  @IsInt()
  ruptureHeures?: number;

  @IsOptional()
  @IsIn(['CLAIR', 'TEINTE', 'MECONIAL'])
  liquideAspect?: string;

  @IsOptional()
  @IsString()
  antecedentsMedicaux?: string;

  @IsOptional()
  @IsBoolean()
  htaConnue?: boolean;

  @IsOptional()
  @IsBoolean()
  diabeteConnu?: boolean;

  @IsOptional()
  @IsString()
  antecedentsChirurgicaux?: string;

  @IsOptional()
  @IsInt()
  gemellite?: number;

  @IsOptional()
  @IsInt()
  prematurite?: number;

  @IsOptional()
  @IsInt()
  enfantsVivants?: number;

  @IsOptional()
  @IsInt()
  enfantsDecedes?: number;

  @IsOptional()
  @IsInt()
  cesariennes?: number;

  @IsOptional()
  @IsInt()
  avortements?: number;

  @IsOptional()
  @IsString()
  toxemie?: string;

  @IsOptional()
  @IsIn(['POSITIF', 'NEGATIF', 'INCONNU'])
  statutVihAccueil?: string;

  @IsOptional()
  @IsBoolean()
  sousTarvCpn?: boolean;

  @IsOptional()
  @IsString()
  numeroPec?: string;

  @IsOptional()
  @IsString()
  ageGrossessePremiereCpn?: string;

  @IsOptional()
  @IsInt()
  nombreCpn?: number;

  @IsOptional()
  @IsBoolean()
  offreTestVih?: boolean;

  @IsOptional()
  @IsIn(['POSITIF', 'NEGATIF'])
  resultatTestVih?: string;

  @IsOptional()
  @IsDateString()
  delivranceLe?: string;

  @IsOptional()
  @IsBoolean()
  revisionUterine?: boolean;

  @IsOptional()
  @IsBoolean()
  ubt?: boolean;

  @IsOptional()
  @IsBoolean()
  hppi?: boolean;

  @IsOptional()
  @IsString()
  perimetreCranienEnfant?: string;

  @IsOptional()
  @IsBoolean()
  reanimationNn?: boolean;

  @IsOptional()
  @IsBoolean()
  decedeMaternite?: boolean;

  @IsOptional()
  @IsString()
  interventionMedecin?: string;

  @IsOptional()
  @IsDateString()
  sortieMereLe?: string;

  @IsOptional()
  @IsString()
  sortieMereMode?: string;
}

export class UpdateAccouchementDto {
  @IsOptional()
  @IsDateString()
  dateHeure?: string;

  @IsOptional()
  @IsIn(['VOIE_BASSE', 'CESARIENNE'])
  voie?: string;

  @IsOptional()
  @IsString()
  termeSA?: string;

  @IsOptional()
  @IsIn(['M', 'F'])
  sexeEnfant?: string;

  @IsOptional()
  @IsNumber()
  poidsEnfant?: number;

  @IsOptional()
  @IsString()
  apgar?: string;

  @IsOptional()
  @IsString()
  issueMere?: string;

  @IsOptional()
  @IsString()
  issueEnfant?: string;

  @IsOptional()
  @IsString()
  complications?: string;

  @IsOptional()
  @IsString()
  lieu?: string;

  // ── Registre d'accouchement — rapport SIG (T7 à T10) ──
  @IsOptional()
  @IsIn(['CORRECTEMENT_VACCINEE', 'INCOMPLETEMENT_VACCINEE', 'NON_VACCINEE'])
  vatStatut?: string;

  @IsOptional()
  @IsIn(['FRAIS', 'MACERE'])
  mortNeType?: string;

  @IsOptional()
  @IsBoolean()
  declarationNaissanceRenseignee?: boolean;

  @IsOptional()
  @IsBoolean()
  declarationNaissanceComplete?: boolean;

  @IsOptional()
  @IsBoolean()
  evacueeAvant?: boolean;

  @IsOptional()
  @IsBoolean()
  evacueeApres?: boolean;

  @IsOptional()
  @IsBoolean()
  nouveauNeEvacue?: boolean;

  @IsOptional()
  @IsBoolean()
  nouveauNeProtegeTetanos?: boolean;

  @IsOptional()
  @IsBoolean()
  accouchementMultiple?: boolean;

  // ── Registre d'accouchement officiel ──
  @IsOptional()
  @IsString()
  modeEntree?: string;

  @IsOptional()
  @IsInt()
  numeroAccouchement?: number;

  @IsOptional()
  @IsDateString()
  heureArrivee?: string;

  @IsOptional()
  @IsString()
  motifAdmission?: string;

  @IsOptional()
  @IsBoolean()
  enTravail?: boolean;

  @IsOptional()
  @IsString()
  contractions?: string;

  @IsOptional()
  @IsBoolean()
  pocheEauxIntacte?: boolean;

  @IsOptional()
  @IsInt()
  ruptureHeures?: number;

  @IsOptional()
  @IsIn(['CLAIR', 'TEINTE', 'MECONIAL'])
  liquideAspect?: string;

  @IsOptional()
  @IsString()
  antecedentsMedicaux?: string;

  @IsOptional()
  @IsBoolean()
  htaConnue?: boolean;

  @IsOptional()
  @IsBoolean()
  diabeteConnu?: boolean;

  @IsOptional()
  @IsString()
  antecedentsChirurgicaux?: string;

  @IsOptional()
  @IsInt()
  gemellite?: number;

  @IsOptional()
  @IsInt()
  prematurite?: number;

  @IsOptional()
  @IsInt()
  enfantsVivants?: number;

  @IsOptional()
  @IsInt()
  enfantsDecedes?: number;

  @IsOptional()
  @IsInt()
  cesariennes?: number;

  @IsOptional()
  @IsInt()
  avortements?: number;

  @IsOptional()
  @IsString()
  toxemie?: string;

  @IsOptional()
  @IsIn(['POSITIF', 'NEGATIF', 'INCONNU'])
  statutVihAccueil?: string;

  @IsOptional()
  @IsBoolean()
  sousTarvCpn?: boolean;

  @IsOptional()
  @IsString()
  numeroPec?: string;

  @IsOptional()
  @IsString()
  ageGrossessePremiereCpn?: string;

  @IsOptional()
  @IsInt()
  nombreCpn?: number;

  @IsOptional()
  @IsBoolean()
  offreTestVih?: boolean;

  @IsOptional()
  @IsIn(['POSITIF', 'NEGATIF'])
  resultatTestVih?: string;

  @IsOptional()
  @IsDateString()
  delivranceLe?: string;

  @IsOptional()
  @IsBoolean()
  revisionUterine?: boolean;

  @IsOptional()
  @IsBoolean()
  ubt?: boolean;

  @IsOptional()
  @IsBoolean()
  hppi?: boolean;

  @IsOptional()
  @IsString()
  perimetreCranienEnfant?: string;

  @IsOptional()
  @IsBoolean()
  reanimationNn?: boolean;

  @IsOptional()
  @IsBoolean()
  decedeMaternite?: boolean;

  @IsOptional()
  @IsString()
  interventionMedecin?: string;

  @IsOptional()
  @IsDateString()
  sortieMereLe?: string;

  @IsOptional()
  @IsString()
  sortieMereMode?: string;
}

// ── Registre CPoN (consultations postnatales) ──

export class CreateCponDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  modeEntree?: string;

  @IsOptional()
  @IsInt()
  grossesseId?: number;

  @IsOptional()
  @IsString()
  numeroGestanteReport?: string;

  @IsOptional()
  @IsIn(['IMMEDIATE_6_72H', '6_10_JOURS', 'AUTRES_PERIODES', '6_8_SEMAINES'])
  typeCpon?: string;

  @IsOptional()
  @IsDateString()
  dateAccouchement?: string;

  @IsOptional()
  @IsIn(['ETABLISSEMENT', 'DOMICILE'])
  lieuAccouchement?: string;

  @IsOptional()
  @IsIn(['VOIE_BASSE', 'CESARIENNE'])
  modeAccouchement?: string;

  @IsOptional()
  @IsString()
  numeroDepistagePec?: string;

  @IsOptional()
  @IsIn(['POSITIF', 'NEGATIF', 'INCONNU'])
  statutVih?: string;

  @IsOptional()
  @IsString()
  examenMere?: string;

  @IsOptional()
  @IsString()
  examenEnfant?: string;

  @IsOptional()
  @IsString()
  conseils?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class UpdateCponDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  modeEntree?: string;

  @IsOptional()
  @IsInt()
  grossesseId?: number;

  @IsOptional()
  @IsString()
  numeroGestanteReport?: string;

  @IsOptional()
  @IsIn(['IMMEDIATE_6_72H', '6_10_JOURS', 'AUTRES_PERIODES', '6_8_SEMAINES'])
  typeCpon?: string;

  @IsOptional()
  @IsDateString()
  dateAccouchement?: string;

  @IsOptional()
  @IsIn(['ETABLISSEMENT', 'DOMICILE'])
  lieuAccouchement?: string;

  @IsOptional()
  @IsIn(['VOIE_BASSE', 'CESARIENNE'])
  modeAccouchement?: string;

  @IsOptional()
  @IsString()
  numeroDepistagePec?: string;

  @IsOptional()
  @IsIn(['POSITIF', 'NEGATIF', 'INCONNU'])
  statutVih?: string;

  @IsOptional()
  @IsString()
  examenMere?: string;

  @IsOptional()
  @IsString()
  examenEnfant?: string;

  @IsOptional()
  @IsString()
  conseils?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}

// ── Registre PF (planification familiale) ──

export class CreatePfDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  methode: string;

  @IsOptional()
  @IsBoolean()
  nouvelleUtilisatrice?: boolean;

  @IsOptional()
  @IsBoolean()
  protégée?: boolean;

  @IsOptional()
  @IsBoolean()
  perdueDeVue?: boolean;

  @IsOptional()
  @IsBoolean()
  abandon?: boolean;

  @IsOptional()
  @IsBoolean()
  arretRetrait?: boolean;

  @IsOptional()
  @IsBoolean()
  conseilPostpartum?: boolean;

  @IsOptional()
  @IsBoolean()
  produitPostpartumImmediat?: boolean;

  @IsOptional()
  @IsBoolean()
  produitPostAbortum?: boolean;

  @IsOptional()
  @IsBoolean()
  femmesFormeesAutoInjection?: boolean;

  @IsOptional()
  @IsBoolean()
  istPresente?: boolean;

  @IsOptional()
  @IsBoolean()
  seropositive?: boolean;

  @IsOptional()
  @IsBoolean()
  nourrisson0_6?: boolean;

  @IsOptional()
  @IsBoolean()
  nourrisson6?: boolean;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class UpdatePfDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  methode?: string;

  @IsOptional()
  @IsBoolean()
  nouvelleUtilisatrice?: boolean;

  @IsOptional()
  @IsBoolean()
  protégée?: boolean;

  @IsOptional()
  @IsBoolean()
  perdueDeVue?: boolean;

  @IsOptional()
  @IsBoolean()
  abandon?: boolean;

  @IsOptional()
  @IsBoolean()
  arretRetrait?: boolean;

  @IsOptional()
  @IsBoolean()
  conseilPostpartum?: boolean;

  @IsOptional()
  @IsBoolean()
  produitPostpartumImmediat?: boolean;

  @IsOptional()
  @IsBoolean()
  produitPostAbortum?: boolean;

  @IsOptional()
  @IsBoolean()
  femmesFormeesAutoInjection?: boolean;

  @IsOptional()
  @IsBoolean()
  istPresente?: boolean;

  @IsOptional()
  @IsBoolean()
  seropositive?: boolean;

  @IsOptional()
  @IsBoolean()
  nourrisson0_6?: boolean;

  @IsOptional()
  @IsBoolean()
  nourrisson6?: boolean;

  @IsOptional()
  @IsString()
  observations?: string;
}
