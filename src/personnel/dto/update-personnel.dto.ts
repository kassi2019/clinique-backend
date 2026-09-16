import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdatePersonnelDto {
  @IsOptional()
  @IsInt()
  cliniqueId?: number;

  @IsOptional()
  @IsString()
  matricule?: string;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsIn(['M', 'F'])
  sexe?: string;

  @IsOptional()
  @ValidateIf((o) => o.photo !== null && o.photo !== undefined)
  @IsString()
  photo?: string | null;

  @IsOptional()
  @IsString()
  fonction?: string;

  @IsOptional()
  @IsInt()
  serviceId?: number;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsIn(['ACTIF', 'INACTIF'])
  statut?: string;

  @IsOptional()
  @IsDateString()
  dateEmbauche?: string;
}
