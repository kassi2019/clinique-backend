import {
  IsDateString,
  IsIn,
  IsInt,
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
}
