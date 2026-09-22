import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export const MODES_PAIEMENT = ['ESPECES', 'MOBILE_MONEY', 'CARTE'] as const;

export class EncaisserDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  lignesIds: number[];

  @IsIn(MODES_PAIEMENT)
  modePaiement: string;

  /** Assurance : modification exceptionnelle du taux (sinon le taux paramétré s'applique). */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  tauxApplique?: number;

  @IsOptional()
  @IsString()
  motifTaux?: string;
}

export class AnnulerPaiementDto {
  @IsString()
  @IsNotEmpty()
  motif: string;
}

export class AjouterPrestationDto {
  @IsInt()
  prestationId: number;
}
