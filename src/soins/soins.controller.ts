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
import { SoinsService } from './soins.service';

@UseGuards(JwtAuthGuard)
@Controller('soins')
export class SoinsController {
  constructor(private soinsService: SoinsService) {}

  /** File d'attente : patients à traiter, triés par ordre d'arrivée. */
  @Get('file')
  fileAttente(@Query('cliniqueId', ParseIntPipe) cliniqueId: number) {
    return this.soinsService.fileAttente(cliniqueId);
  }

  /** Recherche par code patient, N° d'ordre, nom ou prénom. */
  @Get('recherche')
  rechercher(@Query('code') code?: string, @Query('cliniqueId', ParseIntPipe) cliniqueId?: number) {
    if (!cliniqueId) return [];
    return this.soinsService.rechercher(code ?? '', cliniqueId);
  }

  /** Détail d'un passage : patient, soins payés, réalisations. */
  @Get('passages/:id')
  detailPassage(@Param('id', ParseIntPipe) id: number) {
    return this.soinsService.detailPassage(id);
  }

  /** Enregistre la réalisation d'un soin (date + observations, agent tracé). */
  @Post('passages/:id/realiser')
  realiser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { passagePrestationId: number; date: string; observations?: string },
    @Req() req,
  ) {
    return this.soinsService.realiser(
      Number(body.passagePrestationId),
      body.date ?? new Date().toISOString(),
      body.observations,
      req.user.id,
    );
  }

  /** Historique des réalisations de soins. */
  @Get('realisations')
  realisations(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('jour') jour?: string,
    @Query('recherche') recherche?: string,
  ) {
    return this.soinsService.realisations(
      cliniqueId,
      page ? Number(page) : 1,
      perPage ? Number(perPage) : 10,
      jour,
      recherche,
    );
  }
}
