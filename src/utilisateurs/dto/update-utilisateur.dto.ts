import { IsArray, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

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

  /** Onglets autorisés (remplace la liste ; aucun pour un module = tous ses onglets). */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  onglets?: string[];
}

export class ResetMotDePasseDto {
  @IsString()
  @IsOptional()
  motDePasse?: string;
}
