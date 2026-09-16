import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreerConsultationDto {
  @IsOptional()
  @IsString()
  motif?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  diagnostic?: string;

  @IsOptional()
  @IsBoolean()
  hospitalisation?: boolean;

  @IsOptional()
  @IsString()
  hospitalisationDuree?: string;
}

export class PrescriptionDto {
  @IsOptional()
  @IsInt()
  medicamentId?: number;

  /** Nom saisi librement si le médicament n'est pas au catalogue. */
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  forme?: string;

  @IsOptional()
  @IsString()
  posologie?: string;

  @IsOptional()
  @IsString()
  quantite?: string;

  @IsOptional()
  @IsString()
  duree?: string;
}

export class PrescrireExamensDto {
  @IsArray()
  @IsInt({ each: true })
  lignesIds: number[];
}
