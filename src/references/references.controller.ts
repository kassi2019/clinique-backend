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
import { ReferenceDto, ReferencesService } from './references.service';

@UseGuards(JwtAuthGuard)
@Controller('references')
export class ReferencesController {
  constructor(private referencesService: ReferencesService) {}

  /** Crée la fiche de référence d'un passage (patient non externe). */
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
  @Patch(':id')
  modifier(@Param('id', ParseIntPipe) id: number, @Body() dto: ReferenceDto) {
    return this.referencesService.modifier(id, dto);
  }

  /** Impression A4 (agent du poste). */
  @Post(':id/imprimer')
  imprimer(@Param('id', ParseIntPipe) id: number) {
    return this.referencesService.imprimer(id);
  }
}
