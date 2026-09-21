import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PharmacieService } from './pharmacie.service';

@UseGuards(JwtAuthGuard)
@Controller('pharmacie')
export class PharmacieController {
  constructor(private pharmacieService: PharmacieService) {}

  // ── Ordonnances (§9.1) ──

  @Get('ordonnances')
  rechercherOrdonnances(
    @Query('code') code?: string,
    @Query('cliniqueId', ParseIntPipe) cliniqueId?: number,
    @Query('medecinId') medecinId?: string,
    @Query('statut') statut?: string,
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
  ) {
    if (!cliniqueId) return { liste: true, ordonnances: [] };
    return this.pharmacieService.rechercherOrdonnances(code ?? '', cliniqueId, {
      medecinId: medecinId ? Number(medecinId) : undefined,
      statut,
      debut,
      fin,
    });
  }

  @Get('consultations/:id')
  detailOrdonnance(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacieService.detailOrdonnance(id);
  }

  /** Dispense des médicaments (sortie de stock FEFO). */
  @Post('dispensations/:consultationId')
  dispenser(
    @Param('consultationId', ParseIntPipe) consultationId: number,
    @Body() dto: { lignes: { prescriptionId: number; quantiteDelivree: number }[] },
    @Req() req,
  ) {
    return this.pharmacieService.dispenser(consultationId, dto.lignes ?? [], req.user.id);
  }

  @Post('dispensations/:id/cloturer')
  cloturer(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacieService.cloturer(id);
  }

  /** Encaissement à la caisse pharmacie + reçu imprimé. */
  @Post('dispensations/:id/payer')
  payer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { modePaiement: string },
    @Req() req,
  ) {
    return this.pharmacieService.payer(id, dto.modePaiement, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('paiements/:id/annuler')
  annulerPaiement(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { motif: string },
  ) {
    return this.pharmacieService.annulerPaiement(id, dto.motif);
  }

  // ── Stocks (§9.2) ──

  @Get('stocks')
  stocks(
    @Query('cliniqueId', ParseIntPipe) cliniqueId?: number,
    @Query('search') search?: string,
  ) {
    if (!cliniqueId) return [];
    return this.pharmacieService.stocks(cliniqueId, search);
  }

  @Post('entrees')
  entrerStock(@Body() dto: any, @Req() req) {
    return this.pharmacieService.entrerStock(dto, req.user.id);
  }

  @Post('inventaire')
  inventaire(@Body() dto: any, @Req() req) {
    return this.pharmacieService.inventaire(dto, req.user.id);
  }

  @Get('mouvements/:medicamentId')
  mouvements(@Param('medicamentId', ParseIntPipe) medicamentId: number) {
    return this.pharmacieService.mouvements(medicamentId);
  }

  @Get('alertes')
  alertes(@Query('cliniqueId', ParseIntPipe) cliniqueId?: number) {
    if (!cliniqueId) return { stockBas: [], peremptions: [] };
    return this.pharmacieService.alertes(cliniqueId);
  }

  // ── Consommables (§9.3) ──

  @Get('consommables')
  consommables(@Query('cliniqueId', ParseIntPipe) cliniqueId?: number) {
    if (!cliniqueId) return [];
    return this.pharmacieService.consommables(cliniqueId);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('consommables')
  creerConsommable(@Body() dto: any) {
    return this.pharmacieService.creerConsommable(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('consommables/:id/maj')
  majConsommable(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.pharmacieService.majConsommable(id, dto);
  }

  @Post('consommables/:id/mouvement')
  mouvementConsommable(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { type: string; quantite: number; commentaire?: string },
    @Req() req,
  ) {
    return this.pharmacieService.mouvementConsommable(id, dto, req.user.id);
  }

  @Get('consommables/:id/mouvements')
  mouvementsConsommable(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacieService.mouvementsConsommable(id);
  }
}
