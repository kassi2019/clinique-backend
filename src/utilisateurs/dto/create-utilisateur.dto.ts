import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUtilisateurDto {
  @IsInt()
  personnelId: number;

  @IsString()
  @IsNotEmpty()
  matricule: string;

  @IsString()
  @MinLength(6)
  motDePasse: string;

  @IsInt()
  roleId: number;

  @IsOptional()
  @IsIn(['ACTIF', 'SUSPENDU'])
  statut?: string;
}
