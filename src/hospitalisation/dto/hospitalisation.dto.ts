import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreerChambreDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  /** Type paramétrable de la chambre (référentiel). */
  @IsOptional()
  @IsInt()
  typeChambreId?: number;

  /** Tarif par nuit ; sinon le tarif de la prestation HOSP-JOUR s'applique. */
  @IsOptional()
  @IsNumber()
  tarifJournalier?: number;
}

export class CreerTypeChambreDto {
  @IsString()
  @IsNotEmpty()
  libelle: string;
}

export class CreerLitDto {
  @IsString()
  @IsNotEmpty()
  numero: string;
}

export class AdmissionDto {
  @IsInt()
  litId: number;

  @IsOptional()
  @IsString()
  dateEntree?: string;

  @IsOptional()
  @IsString()
  motif?: string;
}

export class SuiviDto {
  @IsOptional()
  @IsString()
  observations?: string;
}

export const MOTIFS_SORTIE = ['EXEAT', 'TRANSFERT', 'DECES', 'AUTRE'] as const;

export class SortieDto {
  @IsOptional()
  @IsString()
  dateSortie?: string;

  @IsIn(MOTIFS_SORTIE)
  sortieMotif: string;
}
