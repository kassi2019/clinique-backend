import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export const MODES_PAIEMENT = ['ESPECES', 'MOBILE_MONEY', 'CARTE'] as const;

export class EncaisserDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  lignesIds: number[];

  @IsIn(MODES_PAIEMENT)
  modePaiement: string;
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
