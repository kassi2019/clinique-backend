import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePersonnelDto {
  @IsInt()
  cliniqueId: number;

  @IsString()
  @IsNotEmpty()
  matricule: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsOptional()
  @IsIn(['M', 'F'])
  sexe?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsString()
  @IsNotEmpty()
  fonction: string;

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
