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
import {
  AdmissionDto,
  CreerChambreDto,
  CreerLitDto,
  CreerTypeChambreDto,
  SortieDto,
  SuiviDto,
} from './dto/hospitalisation.dto';
import { HospitalisationService } from './hospitalisation.service';

@UseGuards(JwtAuthGuard)
@Controller('hospitalisation')
export class HospitalisationController {
  constructor(private hospitalisationService: HospitalisationService) {}

  // ── Types de chambres (référentiel) ──
  @Get('types-chambres')
  listerTypes(@Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.hospitalisationService.listerTypes(Number(cliniqueId));
  }

  @Post('types-chambres')
  creerType(@Query('cliniqueId') cliniqueId: string, @Body() dto: CreerTypeChambreDto) {
    return this.hospitalisationService.creerType(Number(cliniqueId), dto);
  }

  @Patch('types-chambres/:id')
  modifierType(@Param('id', ParseIntPipe) id: number, @Body() dto: CreerTypeChambreDto) {
    return this.hospitalisationService.modifierType(id, dto);
  }

  @Delete('types-chambres/:id')
  desactiverType(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalisationService.desactiverType(id);
  }

  // ── Chambres (Paramétrage) ──
  @Get('chambres')
  listerChambres(@Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.hospitalisationService.listerChambres(Number(cliniqueId));
  }

  @Post('chambres')
  creerChambre(@Query('cliniqueId') cliniqueId: string, @Body() dto: CreerChambreDto) {
    return this.hospitalisationService.creerChambre(Number(cliniqueId), dto);
  }

  @Patch('chambres/:id')
  modifierChambre(@Param('id', ParseIntPipe) id: number, @Body() dto: CreerChambreDto) {
    return this.hospitalisationService.modifierChambre(id, dto);
  }

  @Delete('chambres/:id')
  desactiverChambre(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalisationService.desactiverChambre(id);
  }

  // ── Lits ──
  @Post('chambres/:id/lits')
  creerLit(@Param('id', ParseIntPipe) id: number, @Body() dto: CreerLitDto) {
    return this.hospitalisationService.creerLit(id, dto);
  }

  @Delete('lits/:id')
  desactiverLit(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalisationService.desactiverLit(id);
  }

  /** Grille d'occupation temps réel (lits + occupant). */
  @Get('lits')
  listerLits(@Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.hospitalisationService.listerLits(Number(cliniqueId));
  }

  // ── Admissions / séjours ──
  /** Recherche des passages actifs avec prescription d'hospitalisation. */
  @Get('recherche')
  rechercher(@Query('code') code?: string, @Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.hospitalisationService.rechercher(code ?? '', Number(cliniqueId));
  }

  /** Détail d'un passage : patient, prescription, séjour, historique. */
  @Get('passages/:id')
  detailPassage(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalisationService.detailPassage(id);
  }

  /** Enregistre l'entrée du patient (attribution chambre + lit). */
  @Post('passages/:id/admissions')
  admettre(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdmissionDto,
  ) {
    return this.hospitalisationService.admettre(id, dto);
  }

  /** Suivi du séjour (observations). */
  @Patch('sejours/:id')
  suivi(@Param('id', ParseIntPipe) id: number, @Body() dto: SuiviDto) {
    return this.hospitalisationService.suivi(id, dto);
  }

  /** Sortie du patient : facture (tarif × jours) + ligne payable à la caisse. */
  @Post('sejours/:id/sortie')
  sortie(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SortieDto,
    @Req() req,
  ) {
    return this.hospitalisationService.sortie(id, dto, req.user.id);
  }

  /** Historique des séjours, paginé (défaut : jour courant). */
  @Get('sejours')
  historique(
    @Query('jour') jour?: string,
    @Query('recherche') recherche?: string,
    @Query('statut') statut?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return { data: [], total: 0, page: 1, perPage: 10, totalPages: 0 };
    return this.hospitalisationService.historique({
      jour,
      recherche,
      statut,
      page: page ? Number(page) : 1,
      perPage: perPage ? Number(perPage) : 10,
      cliniqueId: Number(cliniqueId),
    });
  }
}
