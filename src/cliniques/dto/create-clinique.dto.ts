import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCliniqueDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsIn(['ACTIF', 'INACTIF'])
  statut?: string;

  // ── Rapport SIG mensuel (en-tête officielle, paramétrable) ──
  @IsOptional()
  @IsString()
  immatriculation?: string;

  @IsOptional()
  @IsString()
  districtNom?: string;

  @IsOptional()
  @IsString()
  districtCode?: string;

  @IsOptional()
  @IsString()
  regionNom?: string;

  @IsOptional()
  @IsString()
  regionCode?: string;

  @IsOptional()
  @IsInt()
  populationDesservie?: number;

  @IsOptional()
  @IsString()
  responsableRapportNom?: string;

  @IsOptional()
  @IsString()
  responsableRapportFonction?: string;

  @IsOptional()
  @IsString()
  responsableRapportContact?: string;
}

export class UpdateCliniqueDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsIn(['ACTIF', 'INACTIF'])
  statut?: string;

  // ── Rapport SIG mensuel (en-tête officielle, paramétrable) ──
  @IsOptional()
  @IsString()
  immatriculation?: string;

  @IsOptional()
  @IsString()
  districtNom?: string;

  @IsOptional()
  @IsString()
  districtCode?: string;

  @IsOptional()
  @IsString()
  regionNom?: string;

  @IsOptional()
  @IsString()
  regionCode?: string;

  @IsOptional()
  @IsInt()
  populationDesservie?: number;

  @IsOptional()
  @IsString()
  responsableRapportNom?: string;

  @IsOptional()
  @IsString()
  responsableRapportFonction?: string;

  @IsOptional()
  @IsString()
  responsableRapportContact?: string;
}
