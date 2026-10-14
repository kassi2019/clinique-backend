import {
  Body,
  Controller,
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
import { FinancesGuard } from './finances.guard';
import { FinancesService } from './finances.service';

/**
 * Module Finances : pointage de service des agents, suivi en temps réel,
 * tarifs et fiches de vacation mensuelles.
 * - Le pointage (« Prendre / Terminer mon service ») est ouvert à tout utilisateur connecté.
 * - Le reste est réservé à l'administrateur et aux rôles habilités au module FINANCES.
 */
@UseGuards(JwtAuthGuard)
@Controller('finances')
export class FinancesController {
  constructor(private finances: FinancesService) {}

  // ── Pointage de l'utilisateur connecté ──
  @Get('mon-service')
  monService(@Req() req) {
    return this.finances.monService(req.user.id);
  }

  @Post('mon-service/prendre')
  prendre(@Req() req) {
    return this.finances.prendreService(req.user.id);
  }

  @Post('mon-service/terminer')
  terminer(@Req() req) {
    return this.finances.terminerService(req.user.id);
  }

  /** Signal de présence envoyé chaque minute par le poste de l'agent en service. */
  @Post('mon-service/presence')
  presence(@Req() req) {
    return this.finances.presence(req.user.id);
  }

  // ── Réservé au module Finances ──
  @UseGuards(FinancesGuard)
  @Get('en-service')
  enService(@Query('cliniqueId', ParseIntPipe) cliniqueId: number) {
    return this.finances.enService(cliniqueId);
  }

  @UseGuards(FinancesGuard)
  @Get('services')
  services(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('mois') mois: string,
    @Query('personnelId') personnelId?: string,
  ) {
    return this.finances.services(cliniqueId, mois, personnelId ? Number(personnelId) : undefined);
  }

  @UseGuards(FinancesGuard)
  @Patch('services/:id')
  modifierService(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req) {
    return this.finances.modifierService(id, dto ?? {}, req.user.id);
  }

  @UseGuards(FinancesGuard)
  @Get('remunerations')
  remunerations(@Query('cliniqueId', ParseIntPipe) cliniqueId: number) {
    return this.finances.remunerations(cliniqueId);
  }

  @UseGuards(FinancesGuard)
  @Put('remunerations/:personnelId')
  definirRemuneration(@Param('personnelId', ParseIntPipe) personnelId: number, @Body() dto: any) {
    return this.finances.definirRemuneration(personnelId, dto ?? {});
  }

  @UseGuards(FinancesGuard)
  @Post('fiches/generer')
  genererFiches(@Body() dto: { cliniqueId: number; mois: string }) {
    return this.finances.genererFiches(Number(dto.cliniqueId), dto.mois);
  }

  @UseGuards(FinancesGuard)
  @Get('fiches')
  fiches(@Query('cliniqueId', ParseIntPipe) cliniqueId: number, @Query('mois') mois: string) {
    return this.finances.fiches(cliniqueId, mois);
  }

  @UseGuards(FinancesGuard)
  @Get('fiches/:id')
  detailFiche(@Param('id', ParseIntPipe) id: number) {
    return this.finances.detailFiche(id);
  }

  @UseGuards(FinancesGuard)
  @Patch('fiches/:id')
  modifierFiche(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.finances.modifierFiche(id, dto ?? {});
  }

  @UseGuards(FinancesGuard)
  @Post('fiches/:id/statut')
  statutFiche(@Param('id', ParseIntPipe) id: number, @Body() dto: { statut: any }, @Req() req) {
    return this.finances.changerStatutFiche(id, dto.statut, req.user.id);
  }
}
