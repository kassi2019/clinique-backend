import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  EnregistrerPrelevementDto,
  EnregistrerResultatsDto,
} from './dto/laboratoire.dto';
import { LaboratoireService } from './laboratoire.service';

@UseGuards(JwtAuthGuard)
@Controller('laboratoire')
export class LaboratoireController {
  constructor(private laboratoireService: LaboratoireService) {}

  /** Recherche des passages au code actif portant des examens LAB payés (§11). */
  @Get('recherche')
  rechercher(@Query('code') code?: string, @Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.laboratoireService.rechercher(code ?? '', Number(cliniqueId));
  }

  /** File d'attente : passages à examiner, triés par ordre d'arrivée. */
  @Get('file')
  fileAttente(@Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.laboratoireService.fileAttente(Number(cliniqueId));
  }

  /** Détail d'un passage : fiche patient, prestations, examens et historique. */
  @Get('passages/:id')
  detailPassage(@Param('id', ParseIntPipe) id: number) {
    return this.laboratoireService.detailPassage(id);
  }

  /** Enregistre le prélèvement (étape obligatoire avant les résultats). */
  @Post('passages/:id/prelevements')
  enregistrerPrelevement(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EnregistrerPrelevementDto,
    @Req() req,
  ) {
    return this.laboratoireService.enregistrerPrelevement(
      id,
      dto.passagePrestationId,
      req.user.id,
    );
  }

  /** Enregistre les résultats (lignes structurées + conclusion). */
  @Put('examens/:id/resultats')
  enregistrerResultats(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EnregistrerResultatsDto,
  ) {
    return this.laboratoireService.enregistrerResultats(id, dto);
  }

  /** Valide le résultat. */
  @Post('examens/:id/valider')
  valider(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.laboratoireService.valider(id, req.user.id);
  }

  /** Historique des examens réalisés, paginé (défaut : jour courant). */
  @Get('examens')
  historique(
    @Query('jour') jour?: string,
    @Query('recherche') recherche?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return { data: [], total: 0, page: 1, perPage: 10, totalPages: 0 };
    return this.laboratoireService.historique({
      jour,
      recherche,
      page: page ? Number(page) : 1,
      perPage: perPage ? Number(perPage) : 10,
      cliniqueId: Number(cliniqueId),
    });
  }
}
