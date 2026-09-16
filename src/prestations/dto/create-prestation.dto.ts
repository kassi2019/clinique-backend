import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const TYPES_PRESTATION = [
  'CONSULTATION',
  'EXAMEN_LABO',
  'IMAGERIE',
  'SOIN',
  'MATERNITE',
  'HOSPITALISATION',
  'MEDICAMENT',
  'AUTRE',
] as const;

export class CreatePrestationDto {
  @IsInt()
  cliniqueId: number;

  @IsInt()
  serviceId: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  libelle: string;

  @IsIn(TYPES_PRESTATION)
  type: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montant: number;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}

export class UpdatePrestationDto {
  @IsOptional()
  @IsInt()
  cliniqueId?: number;

  @IsOptional()
  @IsInt()
  serviceId?: number;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  libelle?: string;

  @IsOptional()
  @IsIn(TYPES_PRESTATION)
  type?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montant?: number;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
