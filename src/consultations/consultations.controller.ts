import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Onglet } from '../auth/onglet.decorator';
import { OngletGuard } from '../auth/onglet.guard';
import { ConsultationsService } from './consultations.service';
import {
  CreerConsultationDto,
  PrescriptionDto,
  PrescrireExamenDto,
  PrescrireSoinDto,
  PrescrireExamensDto,
} from './dto/consultation.dto';

// Droits par onglet : @Onglet(...) sur les routes propres à un onglet (cf. src/auth/onglets.ts)
@UseGuards(JwtAuthGuard, OngletGuard)
@Controller('consultations')
export class ConsultationsController {
  constructor(private consultationsService: ConsultationsService) {}

  /** Recherche par code patient ou N° d'ordre (avec vérification d'activation). */
  @Get('recherche')
  rechercher(
    @Query('code') code?: string,
    @Query('cliniqueId', ParseIntPipe) cliniqueId?: number,
  ) {
    if (!cliniqueId) return [];
    return this.consultationsService.rechercher(code ?? '', cliniqueId);
  }

  /** Détail du passage : infos accueil + constantes + historique médical. */
  @Get('passages/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.detailPassage(id);
  }

  /** Crée ou met à jour la consultation du passage. */
  @Post('passages/:id')
  creerOuMaj(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreerConsultationDto,
    @Req() req,
  ) {
    return this.consultationsService.creerOuMaj(id, req.user.id, dto);
  }

  /** Ajoute une prescription de médicament. */
  @Post(':id/medicaments')  ajouterMedicament(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PrescriptionDto,
  ) {
    return this.consultationsService.ajouterMedicament(id, dto);
  }

  @Delete('medicaments/:id')
  retirerMedicament(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.retirerMedicament(id);
  }

  /** Soins prescrits de la consultation (onglet « Soins »). */
  @Get(':id/soins')
  soins(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.soinsPrescrits(id);
  }

  /** Prescrit un soin : visible tout de suite dans le module Soins. */
  @Onglet('CONSULTATION.SOINS')
  @Post(':id/soins')
  prescrireSoin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PrescrireSoinDto,
    @Req() req,
  ) {
    return this.consultationsService.prescrireSoin(id, req.user.id, dto);
  }

  @Onglet('CONSULTATION.SOINS')
  @Delete('soins/:id')
  retirerSoin(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.retirerSoin(id);
  }

  @Onglet('CONSULTATION.SOINS')
  @Post('soins/:id/arreter')
  arreterSoin(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.arreterSoin(id);
  }

  /** Prescrit des examens (lignes NON_PRESCRITE → EN_ATTENTE pour la caisse). */
  @Post(':id/examens')
  prescrireExamens(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PrescrireExamensDto,
  ) {
    return this.consultationsService.prescrireExamens(id, dto.lignesIds);
  }

  /** Ajoute un examen à la prescription (catalogue ou saisie libre hors clinique). */
  @Post(':id/examens/ajouter')
  ajouterExamen(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PrescrireExamenDto,
    @Req() req,
  ) {
    return this.consultationsService.ajouterExamen(id, dto, req.user?.id);
  }

  /** « Le patient fait cet examen hors de la clinique » (case de l'onglet Examens). */
  @Patch('examens/:id/hors-clinique')
  examenHorsClinique(@Param('id', ParseIntPipe) id: number, @Body() dto: { horsClinique: boolean }) {
    return this.consultationsService.examenHorsClinique(id, dto.horsClinique === true);
  }

  @Delete('examens/:id')
  retirerExamen(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.retirerExamen(id);
  }

  // ── Résultat scanné d'un examen réalisé hors clinique ──
  @Post('examens/:id/resultat-externe')
  joindreResultatExterne(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { nomFichier?: string; contenu?: string; dateExamen?: string; lieu?: string; conclusion?: string },
    @Req() req,
  ) {
    return this.consultationsService.joindreResultatExterne(id, dto, req.user?.id);
  }

  @Get('examens/:id/resultat-externe')
  resultatExterne(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.resultatExterne(id);
  }

  @Delete('examens/:id/resultat-externe')
  supprimerResultatExterne(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.supprimerResultatExterne(id);
  }

  /** Nouvelle ordonnance indépendante pour la même consultation. */
  @Post(':id/ordonnances')
  nouvelleOrdonnance(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.nouvelleOrdonnance(id);
  }

  /** « Le patient achète hors de la clinique » (case de l'onglet Prescription). */
  @Patch('ordonnances/:id/hors-clinique')
  ordonnanceHorsClinique(@Param('id', ParseIntPipe) id: number, @Body() dto: { horsClinique: boolean }) {
    return this.consultationsService.ordonnanceHorsClinique(id, dto.horsClinique === true);
  }

  /** Sauvegarde l'ordonnance (horodatée). */
  @Post(':id/ordonnance-sauvegarder')
  sauvegarderOrdonnance(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.sauvegarderOrdonnance(id);
  }

  /** Enregistre un certificat d'arrêt de travail (numéro séquentiel annuel). */
  @Onglet('CONSULTATION.CERTIFICAT')
  @Post(':id/certificat-arret')
  enregistrerCertificat(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: {
      civilite: string;
      nomPatient: string;
      dateNaissance?: string;
      profession?: string;
      dureeJours: number;
      debut: string;
      fin: string;
      medecin: string;
      lieu?: string;
    },
    @Req() req,
  ) {
    return this.consultationsService.enregistrerCertificat(id, dto, req.user.id);
  }

  /** Liste des certificats d'arrêt établis pour une consultation. */
  @Onglet('CONSULTATION.CERTIFICAT')
  @Get(':id/certificats-arret')
  certificatsArret(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.certificatsArret(id);
  }

  /** Valide la consultation. */
  @Post(':id/valider')
  valider(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.valider(id);
  }

  // ─────────── Affectation automatique (file d'attente médecins) ───────────

  /** Change la disponibilité du médecin connecté (DISPONIBLE / INDISPONIBLE). */
  @Put('disponibilite')
  changerDisponibilite(@Body() dto: { disponibilite: string }, @Req() req) {
    return this.consultationsService.changerDisponibilite(
      req.user.id,
      dto.disponibilite === 'DISPONIBLE' ? 'DISPONIBLE' : 'INDISPONIBLE',
    );
  }

  /** Signal de vie du poste (heartbeat, toutes les 60 s). */
  @Post('ping')
  ping(@Req() req) {
    return this.consultationsService.ping(req.user.id);
  }

  /** File d'attente du médecin connecté : patients en attente + terminés (jour courant par défaut). */
  @Get('moi')
  maFile(@Req() req, @Query('jour') jour?: string) {
    return this.consultationsService.maFile(req.user.id, jour);
  }

  /** Le médecin ouvre un dossier de sa file (EN_ATTENTE → EN_CONSULTATION). */
  @Post('affectations/:id/ouvrir')
  ouvrirAffectation(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.ouvrirAffectation(id);
  }

  /** Le médecin quitte le dossier sans valider (EN_CONSULTATION → EN_ATTENTE). */
  @Post('affectations/:id/fermer')
  fermerAffectation(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.fermerAffectation(id);
  }
}
