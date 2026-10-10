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
import { AssurancesService } from './assurances.service';

@UseGuards(JwtAuthGuard)
@Controller('assurances')
export class AssurancesController {
  constructor(private assurancesService: AssurancesService) {}

  /** Liste des assurances avec formules et couvertures (tous les postes). */
  @Get()
  lister(@Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.assurancesService.listerAssurances(Number(cliniqueId));
  }

  /** Facturation des assurances : prises en charge + totaux par assurance. */
  @Get('facturation')
  facturation(
    @Query('cliniqueId') cliniqueId?: string,
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('assuranceId') assuranceId?: string,
    @Query('patientId') patientId?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    if (!cliniqueId) return { lignes: [], total: 0, parAssurance: [] };
    return this.assurancesService.facturation(Number(cliniqueId), {
      debut,
      fin,
      assuranceId: assuranceId ? Number(assuranceId) : undefined,
      patientId: patientId ? Number(patientId) : undefined,
      page: page ? Number(page) : 1,
      perPage: perPage !== undefined && perPage !== '' ? Number(perPage) : 20,
    });
  }

  // ── Recouvrement ──
  /** Facturé / reçu / reste à recouvrer par assurance + règlements reçus. */
  @Get('recouvrement')
  recouvrement(@Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return { parAssurance: [], totaux: { facture: 0, recu: 0, reste: 0 }, reglements: [] };
    return this.assurancesService.recouvrement(Number(cliniqueId));
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('reglements')
  creerReglement(@Body() dto: any, @Req() req) {
    return this.assurancesService.creerReglement(dto, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Delete('reglements/:id')
  supprimerReglement(@Param('id', ParseIntPipe) id: number) {
    return this.assurancesService.supprimerReglement(id);
  }

  /** Liste des patients assurés (filtre par compagnie, recherche par nom ou code). */
  @Get('assures')
  assures(
    @Query('cliniqueId') cliniqueId?: string,
    @Query('assuranceId') assuranceId?: string,
    @Query('search') search?: string,
  ) {
    if (!cliniqueId) return { assures: [], total: 0, parAssurance: [] };
    return this.assurancesService.assures(Number(cliniqueId), {
      assuranceId: assuranceId ? Number(assuranceId) : undefined,
      search,
    });
  }

  // ── Assurances (administration) ──
  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post()
  creer(@Query('cliniqueId') cliniqueId: string, @Body() dto: any) {
    return this.assurancesService.creerAssurance(Number(cliniqueId), dto);
  }

  /** Import en masse depuis Excel : colonnes Code, Libellé, Téléphone, Email, Adresse, Agrément. */
  @Post('import')
  importer(@Query('cliniqueId') cliniqueId: string, @Body() dto: any) {
    return this.assurancesService.importerAssurances(Number(cliniqueId), dto.lignes ?? []);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Patch(':id')
  modifier(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.assurancesService.modifierAssurance(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Delete(':id')
  desactiver(@Param('id', ParseIntPipe) id: number) {
    return this.assurancesService.desactiverAssurance(id);
  }

  // ── Formules ──
  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('formules')
  creerFormule(@Body() dto: any) {
    return this.assurancesService.creerFormule(Number(dto.assuranceId), dto);
  }

  /** Taux de couverture des médicaments (pharmacie) d'une formule. */
  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Patch('formules/:id/taux-pharmacie')
  definirTauxPharmacie(@Param('id', ParseIntPipe) id: number, @Body() dto: { tauxPharmacie: any }) {
    return this.assurancesService.definirTauxPharmacie(id, dto.tauxPharmacie);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Patch('formules/:id')
  modifierFormule(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.assurancesService.modifierFormule(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Delete('formules/:id')
  desactiverFormule(@Param('id', ParseIntPipe) id: number) {
    return this.assurancesService.desactiverFormule(id);
  }

  // ── Couvertures (formule × prestation) ──
  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('couvertures')
  creerCouverture(@Body() dto: any) {
    return this.assurancesService.creerCouverture(Number(dto.formuleId), dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Patch('couvertures/:id')
  modifierCouverture(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.assurancesService.modifierCouverture(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Delete('couvertures/:id')
  desactiverCouverture(@Param('id', ParseIntPipe) id: number) {
    return this.assurancesService.desactiverCouverture(id);
  }

  // ── Rattachement patient → assurance ──
  @Get('patients/:patientId')
  assurancesDuPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.assurancesService.assurancesDuPatient(patientId);
  }

  @Post('patients/:patientId')
  ajouterPatientAssurance(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() dto: any,
  ) {
    return this.assurancesService.ajouterPatientAssurance(patientId, dto);
  }

  @Delete('patients/rattachements/:id')
  desactiverPatientAssurance(@Param('id', ParseIntPipe) id: number) {
    return this.assurancesService.desactiverPatientAssurance(id);
  }
}
