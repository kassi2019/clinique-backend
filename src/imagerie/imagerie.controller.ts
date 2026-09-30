import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { EnregistrerCrDto } from './dto/imagerie.dto';
import { ImagerieService } from './imagerie.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('imagerie')
export class ImagerieController {
  constructor(private imagerieService: ImagerieService) {}

  /** Recherche des passages au code actif portant des examens IMA payés (§12). */
  @Get('recherche')
  rechercher(@Query('code') code?: string, @Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.imagerieService.rechercher(code ?? '', Number(cliniqueId));
  }

  /** File d'attente : passages à examiner, triés par ordre d'arrivée. */
  @Get('file')
  fileAttente(@Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.imagerieService.fileAttente(Number(cliniqueId));
  }

  /** Détail d'un passage : fiche patient, prestations, examens et historique. */
  @Get('passages/:id')
  detailPassage(@Param('id', ParseIntPipe) id: number) {
    return this.imagerieService.detailPassage(id);
  }

  /** Enregistre le compte rendu (4 sections) d'un examen IMA payé. */
  @Post('passages/:id/examens')
  enregistrerCr(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EnregistrerCrDto,
  ) {
    return this.imagerieService.enregistrerCr(id, dto);
  }

  /** Valide le compte rendu. */
  @Post('examens/:id/valider')
  valider(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.imagerieService.valider(id, req.user.id);
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
    return this.imagerieService.historique({
      jour,
      recherche,
      page: page ? Number(page) : 1,
      perPage: perPage ? Number(perPage) : 10,
      cliniqueId: Number(cliniqueId),
    });
  }

  // ─── Fiches d'échographie (types paramétrés + fiches enregistrées) ──────────

/** Types de fiches actifs (liste déroulante du module Imagerie). */
@Get('fiches-types')
fichesTypes(@Query('cliniqueId', ParseIntPipe) cliniqueId: number) {
  return this.imagerieService.fichesTypes(cliniqueId);
}

/** CRUD des types (administrateur). */
@Roles('ADMINISTRATEUR')
@Post('fiches-types')
creerFicheType(@Body() dto: { cliniqueId: number; libelle: string; titre?: string; texte: string; champs?: string }) {
  return this.imagerieService.creerFicheType(dto);
}

@Roles('ADMINISTRATEUR')
@Patch('fiches-types/:id')
modifierFicheType(@Param('id', ParseIntPipe) id: number, @Body() dto: { libelle?: string; titre?: string; texte?: string; champs?: string; actif?: boolean }) {
  return this.imagerieService.modifierFicheType(id, dto);
}

@Roles('ADMINISTRATEUR')
@Delete('fiches-types/:id')
basculerFicheType(@Param('id', ParseIntPipe) id: number) {
  return this.imagerieService.basculerFicheType(id);
}

/** Fiches enregistrées d'un passage. */
@Get('passages/:id/fiches')
fichesPassage(@Param('id', ParseIntPipe) id: number) {
  return this.imagerieService.fichesPassage(id);
}

/** Enregistre une fiche d'échographie (valeurs saisies + texte généré, ou texte libre). */
@Post('passages/:id/fiches')
creerFiche(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: { typeFicheId: number; texte?: string; valeurs?: Record<string, any>; indication?: string; prescripteur?: string },
  @Req() req,
) {
  return this.imagerieService.creerFiche(id, dto, req.user.id);
}

@Patch('fiches/:id')
modifierFiche(@Param('id', ParseIntPipe) id: number, @Body() dto: { texte?: string; valeurs?: Record<string, any>; indication?: string; prescripteur?: string }) {
  return this.imagerieService.modifierFiche(id, dto);
}

/** Imprime la fiche en A4 sur l'imprimante du poste (agent local). */
@Post('fiches/:id/imprimer')
imprimerFiche(@Param('id', ParseIntPipe) id: number) {
  return this.imagerieService.imprimerFiche(id);
}
}
