import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Onglet } from '../auth/onglet.decorator';
import { OngletGuard } from '../auth/onglet.guard';
import { ReferenceDto, ReferencesService } from './references.service';

// Droits par onglet : @Onglet(...) sur les routes propres à un onglet (cf. src/auth/onglets.ts)
@UseGuards(JwtAuthGuard, OngletGuard)
@Controller('references')
export class ReferencesController {
  constructor(private referencesService: ReferencesService) {}

  /** Crée la fiche de référence d'un passage (patient non externe). */
  @Onglet('CONSULTATION.REFERENCE', 'MATERNITE.REFERENCE')
  @Post('passages/:id')
  creer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReferenceDto,
    @Req() req,
  ) {
    return this.referencesService.creer(id, dto, req.user?.id);
  }

  /** Fiches de référence d'un passage. */
  @Get('passages/:id')
  parPassage(@Param('id', ParseIntPipe) id: number) {
    return this.referencesService.parPassage(id);
  }

  /** Toutes les fiches d'un patient (dossier du malade). */
  @Get('patient/:patientId')
  parPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.referencesService.parPatient(patientId);
  }

  /** Complète / corrige une fiche (contre-référence au retour). */
  @Onglet('CONSULTATION.REFERENCE', 'MATERNITE.REFERENCE')
  @Patch(':id')
  modifier(@Param('id', ParseIntPipe) id: number, @Body() dto: ReferenceDto) {
    return this.referencesService.modifier(id, dto);
  }

  /** Impression A4 (agent du poste). */
  @Onglet('CONSULTATION.REFERENCE', 'MATERNITE.REFERENCE')
  @Post(':id/imprimer')
  imprimer(@Param('id', ParseIntPipe) id: number) {
    return this.referencesService.imprimer(id);
  }
}
