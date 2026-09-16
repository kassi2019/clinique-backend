import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUtilisateurDto {
  @IsOptional()
  @IsInt()
  personnelId?: number;

  @IsOptional()
  @IsString()
  matricule?: string;

  @IsOptional()
  @IsInt()
  roleId?: number;

  @IsOptional()
  @IsIn(['ACTIF', 'SUSPENDU'])
  statut?: string;
}

export class ResetMotDePasseDto {
  @IsString()
  @IsOptional()
  motDePasse?: string;
}
