import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  /** Âge : accepte chaîne ou nombre (le frontend envoie un nombre). */
  @IsOptional()
  age?: string | number;

  @IsOptional()
  @IsIn(['M', 'F'])
  sexe?: string;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsString()
  quartier?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  telephone?: string;
}

export class UpdatePassageDto {
  @IsOptional()
  @IsInt()
  serviceId?: number;

  @IsOptional()
  @IsIn(['INTERNE', 'EXTERNE'])
  typePatient?: string;

  @IsOptional()
  @IsString()
  motif?: string;

  @IsOptional()
  @IsString()
  referent?: string;

  @IsOptional()
  @IsString()
  prestationDemandee?: string;

  @IsOptional()
  @IsString()
  taille?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsInt()
  pouls?: number;

  @IsOptional()
  @IsString()
  tensionGauche?: string;

  @IsOptional()
  @IsString()
  tensionDroite?: string;

  @IsOptional()
  @IsNumber()
  poids?: number;

  /** Champs du patient à mettre à jour. */
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePatientDto)
  patient?: UpdatePatientDto;
}

export class NouveauPatientDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  /** Âge : accepte chaîne ou nombre (le frontend envoie un nombre). */
  @IsOptional()
  age?: string | number;

  @IsOptional()
  @IsIn(['M', 'F'])
  sexe?: string;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsString()
  quartier?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  telephone?: string;
}

export class CreatePassageDto {
  @IsInt()
  cliniqueId: number;

  /** Patient déjà enregistré à la clinique. */
  @IsOptional()
  @IsInt()
  patientId?: number;

  /** Données d'un nouveau patient (sinon patientId requis). */
  @IsOptional()
  @ValidateNested()
  @Type(() => NouveauPatientDto)
  nouveauPatient?: NouveauPatientDto;

  @IsInt()
  serviceId: number;

  @IsOptional()
  @IsIn(['INTERNE', 'EXTERNE'])
  typePatient?: string;

  @IsOptional()
  @IsString()
  motif?: string;

  // Patient externe (§15)
  @IsOptional()
  @IsString()
  referent?: string;

  @IsOptional()
  @IsString()
  prestationDemandee?: string;

  /** Si le service propose plusieurs tarifs de consultation, l'accueil précise laquelle retenir. */
  @IsOptional()
  @IsInt()
  consultationPrestationId?: number;

  // Constantes (§5.1)
  @IsOptional()
  @IsString()
  taille?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsInt()
  pouls?: number;

  @IsOptional()
  @IsString()
  tensionGauche?: string;

  @IsOptional()
  @IsString()
  tensionDroite?: string;

  @IsOptional()
  @IsNumber()
  poids?: number;
}
