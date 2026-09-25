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

  /** Logos de la page de garde du rapport SIG (data URL base64). */
  @IsOptional()
  @ValidateIf((o) => o.logoRapportGauche !== null && o.logoRapportGauche !== undefined)
  @IsString()
  logoRapportGauche?: string | null;

  @IsOptional()
  @ValidateIf((o) => o.logoRapportCentre !== null && o.logoRapportCentre !== undefined)
  @IsString()
  logoRapportCentre?: string | null;

  @IsOptional()
  @ValidateIf((o) => o.logoRapportDroit !== null && o.logoRapportDroit !== undefined)
  @IsString()
  logoRapportDroit?: string | null;

  /** Lettre de version du rapport SIG (A, B, C…). */
  @IsOptional()
  @IsString()
  sigVersion?: string;
}
