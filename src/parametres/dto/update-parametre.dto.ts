import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateParametreDto {
  /**
   * Image de la page de connexion (data URL base64).
   * null permet de réinitialiser vers le visuel par défaut.
   */
  @IsOptional()
  @ValidateIf((o) => o.loginImage !== null && o.loginImage !== undefined)
  @IsString()
  loginImage?: string | null;
}
