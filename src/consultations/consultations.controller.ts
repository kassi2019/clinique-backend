import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConsultationsService } from './consultations.service';
import {
  CreerConsultationDto,
  PrescriptionDto,
  PrescrireExamenDto,
  PrescrireExamensDto,
} from './dto/consultation.dto';

@UseGuards(JwtAuthGuard)
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
  @Post(':id/medicaments')
  ajouterMedicament(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PrescriptionDto,
  ) {
    return this.consultationsService.ajouterMedicament(id, dto);
  }

  @Delete('medicaments/:id')
  retirerMedicament(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.retirerMedicament(id);
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
  ) {
    return this.consultationsService.ajouterExamen(id, dto);
  }

  @Delete('examens/:id')
  retirerExamen(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.retirerExamen(id);
  }

  /** Sauvegarde l'ordonnance (horodatée). */
  @Post(':id/ordonnance-sauvegarder')
  sauvegarderOrdonnance(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.sauvegarderOrdonnance(id);
  }

  /** Valide la consultation. */
  @Post(':id/valider')
  valider(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.valider(id);
  }
}
