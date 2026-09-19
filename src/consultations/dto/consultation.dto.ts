import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PatientAdminDto {
  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  nationalite?: string;

  @IsOptional()
  @IsString()
  scolarisation?: string;

  @IsOptional()
  @IsString()
  statutConjugal?: string;

  @IsOptional()
  @IsString()
  typePopulation?: string;

  @IsOptional()
  @IsString()
  populationsRisque?: string;

  @IsOptional()
  @IsString()
  protectionSociale?: string;

  @IsOptional()
  @IsString()
  residenceHabituelle?: string;

  @IsOptional()
  @IsString()
  residenceActuelle?: string;
}

export class CreerConsultationDto {
  @IsOptional()
  @IsString()
  motif?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  diagnostic?: string;

  @IsOptional()
  @IsBoolean()
  hospitalisation?: boolean;

  @IsOptional()
  @IsString()
  hospitalisationDuree?: string;

  /** Type d'hospitalisation : MISE_EN_OBSERVATION / MOYENNE / LONGUE (§13). */
  @IsOptional()
  @IsString()
  typeHospitalisation?: string;

  /** Durée prévue en jours (sert à la facturation à l'entrée). */
  @IsOptional()
  @IsInt()
  hospitalisationDureeJours?: number;

  /** Chambre/lit choisi par le médecin. */
  @IsOptional()
  @IsInt()
  litId?: number;

  // ── Fiche de consultation curative ──
  @IsOptional()
  @IsString()
  modeEntree?: string;

  @IsOptional()
  @IsString()
  modeEntreeAutre?: string;

  @IsOptional()
  @IsString()
  traitementAnterieur?: string;

  @IsOptional()
  @IsBoolean()
  hta?: boolean;

  @IsOptional()
  @IsBoolean()
  diabete?: boolean;

  @IsOptional()
  @IsString()
  antecedentsMedicaux?: string;

  @IsOptional()
  @IsString()
  antecedentsChirurgicaux?: string;

  @IsOptional()
  @IsString()
  ddr?: string;

  @IsOptional()
  @IsBoolean()
  grossesseEnCours?: boolean;

  @IsOptional()
  @IsBoolean()
  tabac?: boolean;

  @IsOptional()
  @IsBoolean()
  alcool?: boolean;

  @IsOptional()
  @IsString()
  typeSuivi?: string;

  @IsOptional()
  @IsString()
  consultantType?: string;

  @IsOptional()
  @IsString()
  imc?: string;

  @IsOptional()
  @IsString()
  zscore?: string;

  @IsOptional()
  @IsString()
  frequenceRespiratoire?: string;

  @IsOptional()
  @IsString()
  perimetreBrachial?: string;

  @IsOptional()
  @IsString()
  perimetreCranien?: string;

  @IsOptional()
  @IsString()
  rechercheTB?: string;

  @IsOptional()
  @IsString()
  pathologiesAssociees?: string;

  @IsOptional()
  @IsString()
  tdrPaludisme?: string;

  @IsOptional()
  @IsString()
  goutteEpaisse?: string;

  @IsOptional()
  @IsString()
  mildaEligible?: string;

  @IsOptional()
  @IsString()
  mildaRemise?: string;

  @IsOptional()
  @IsBoolean()
  cdipPropose?: boolean;

  @IsOptional()
  @IsBoolean()
  cdipRealise?: boolean;

  @IsOptional()
  @IsString()
  codeDepistage?: string;

  @IsOptional()
  @IsString()
  glycemieAjeun?: string;

  @IsOptional()
  @IsString()
  glycemieNonAjeun?: string;

  @IsOptional()
  @IsString()
  autresExamens?: string;

  @IsOptional()
  @IsString()
  conduiteTenir?: string;

  @IsOptional()
  @IsString()
  issueSortie?: string;

  @IsOptional()
  @IsString()
  casPresumeTB?: string;

  @IsOptional()
  @IsInt()
  moDureeHeures?: number;

  @IsOptional()
  @IsInt()
  moDureeMinutes?: number;

  @IsOptional()
  @IsString()
  moDebut?: string;

  @IsOptional()
  @IsString()
  moFin?: string;

  /** Données administratives à reporter sur la fiche patient. */
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientAdminDto)
  patient?: PatientAdminDto;
}

export class PrescriptionDto {
  @IsOptional()
  @IsInt()
  medicamentId?: number;

  /** Nom saisi librement si le médicament n'est pas au catalogue. */
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  forme?: string;

  @IsOptional()
  @IsString()
  posologie?: string;

  @IsOptional()
  @IsString()
  quantite?: string;

  @IsOptional()
  @IsString()
  duree?: string;
}

export class PrescrireExamensDto {
  @IsArray()
  @IsInt({ each: true })
  lignesIds: number[];
}

export class PrescrireExamenDto {
  @IsOptional()
  @IsInt()
  prestationId?: number;

  /** Saisie libre : examen non réalisé dans la clinique (non facturable, statut EXTERNE). */
  @IsOptional()
  @IsString()
  libelle?: string;
}
