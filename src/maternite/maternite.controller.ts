import {
  Body,
  Controller,
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
  CreateAccouchementDto,
  CreateCponDto,
  CreateGrossesseDto,
  CreatePfDto,
  CreateVisiteCpnDto,
  UpdateAccouchementDto,
  UpdateCponDto,
  UpdateGrossesseDto,
  UpdatePfDto,
  UpdateVisiteCpnDto,
} from './dto/maternite.dto';
import { MaterniteService } from './maternite.service';

@UseGuards(JwtAuthGuard)
@Controller('maternite')
export class MaterniteController {
  constructor(private materniteService: MaterniteService) {}

  /** File d'attente : patientes avec prestation MATERNITE payée, non traitées. */
  @Get('file')
  fileAttente(@Query('cliniqueId', ParseIntPipe) cliniqueId: number) {
    return this.materniteService.fileAttente(cliniqueId);
  }

  /** Recherche d'une patiente (code patient, N° d'ordre, nom ou prénom). */
  @Get('recherche')
  rechercher(
    @Query('code') code?: string,
    @Query('cliniqueId', ParseIntPipe) cliniqueId?: number,
  ) {
    if (!cliniqueId) return [];
    return this.materniteService.rechercher(code ?? '', cliniqueId);
  }

  /** Patientes traitées (prise en charge terminée), filtrables par jour. */
  @Get('traites')
  traites(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('jour') jour?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.materniteService.traites(
      cliniqueId,
      jour,
      page ? Number(page) : 1,
      perPage ? Number(perPage) : 10,
    );
  }

  /** Détail complet d'un passage maternité (dossier, CPON, PF, consultation…). */
  @Get('passages/:id')
  detailPassage(@Param('id', ParseIntPipe) id: number) {
    return this.materniteService.detailPassage(id);
  }

  /** Termine la prise en charge (la patiente passe dans « terminés »). */
  @Patch('passages/:id/terminer')
  terminer(@Param('id', ParseIntPipe) id: number) {
    return this.materniteService.terminerPassage(id);
  }

  /**
   * Consultation du passage (pour les onglets Ordonnance et Examens) :
   * créée à la volée par le module Maternité, sans passer par la garde du
   * module Consultation (qui n'accepte que les prestations CONSULTATION).
   */
  @Post('passages/:id/consultation')
  assurerConsultation(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.materniteService.assurerConsultation(id, req.user.id);
  }

  /** Dernier dossier grossesse de la patiente (CPN1 crée le dossier sinon). */
  @Get('grossesses/patient/:patientId')
  dossierPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.materniteService.dossierPatient(patientId);
  }

  /** Consultation postnatale (registre CPoN). */
  @Post('passages/:id/cpon')
  creerCpon(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCponDto,
    @Req() req,
  ) {
    return this.materniteService.creerCpon(id, dto, req.user.id);
  }

  @Patch('cpon/:id')
  modifierCpon(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCponDto) {
    return this.materniteService.modifierCpon(id, dto);
  }

  /** Consultation de planification familiale (registre PF). */
  @Post('passages/:id/pf')
  creerPf(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePfDto,
    @Req() req,
  ) {
    return this.materniteService.creerPf(id, dto, req.user.id);
  }

  @Patch('pf/:id')
  modifierPf(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePfDto) {
    return this.materniteService.modifierPf(id, dto);
  }

  /** Liste des grossesses (recherche par nom, code patient ou numéro). */
  @Get('grossesses')
  grossesses(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('search') search?: string,
    @Query('statut') statut?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.materniteService.grossesses({
      cliniqueId,
      search,
      statut,
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
    });
  }

  /** Détail d'une grossesse : patiente, visites CPN, accouchement. */
  @Get('grossesses/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.materniteService.detailGrossesse(id);
  }

  /** Crée une grossesse (DPA = DDR + 280 jours, numéro GRO-0001 généré). */
  @Post('grossesses')
  creer(@Body() dto: CreateGrossesseDto) {
    return this.materniteService.creerGrossesse(dto);
  }

  @Patch('grossesses/:id')
  modifier(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGrossesseDto) {
    return this.materniteService.modifierGrossesse(id, dto);
  }

  /** Nouvelle visite CPN (CPN1, CPN2… numérotées automatiquement). */
  @Post('grossesses/:id/cpn')
  creerVisite(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateVisiteCpnDto,
    @Req() req,
  ) {
    return this.materniteService.creerVisite(id, dto, req.user.id);
  }

  @Patch('cpn/:id')
  modifierVisite(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVisiteCpnDto) {
    return this.materniteService.modifierVisite(id, dto);
  }

  /** Enregistre (ou met à jour) l'accouchement d'une grossesse. */
  @Post('grossesses/:id/accouchement')
  creerAccouchement(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAccouchementDto,
    @Req() req,
  ) {
    return this.materniteService.creerAccouchement(id, dto, req.user.id);
  }

  @Patch('accouchements/:id')
  modifierAccouchement(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccouchementDto) {
    return this.materniteService.modifierAccouchement(id, dto);
  }

  /** Liste des accouchements enregistrés. */
  @Get('accouchements')
  accouchements(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.materniteService.accouchements({
      cliniqueId,
      search,
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
    });
  }
}
