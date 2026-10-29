import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Onglet } from '../auth/onglet.decorator';
import { OngletGuard } from '../auth/onglet.guard';
import { StatistiquesService } from './statistiques.service';

// Droits par onglet : @Onglet(...) sur les routes propres à un onglet (cf. src/auth/onglets.ts)
@UseGuards(JwtAuthGuard, OngletGuard)
@Controller('statistiques')
export class StatistiquesController {
  constructor(private statistiquesService: StatistiquesService) {}

  @Onglet('STATISTIQUES.TABLEAU-BORD')
  @Get('tableau-bord')
  tableauBord(@Query('jour') jour?: string, @Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return {};
    return this.statistiquesService.tableauBord(Number(cliniqueId), jour);
  }

  @Onglet('STATISTIQUES.FREQUENTATION')
  @Get('frequentation')
  frequentation(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.frequentation(
      Number(cliniqueId),
      debut,
      fin,
      page ? Number(page) : 1,
      perPage ? Number(perPage) : 20,
    );
  }

  @Onglet('STATISTIQUES.RECETTES')
  @Get('recettes')
  recettes(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.recettes(Number(cliniqueId), debut, fin);
  }

  @Onglet('STATISTIQUES.LABORATOIRE')
  @Get('laboratoire')
  laboratoire(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.laboratoire(Number(cliniqueId), debut, fin);
  }

  @Onglet('STATISTIQUES.IMAGERIE')
  @Get('imagerie')
  imagerie(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.imagerie(Number(cliniqueId), debut, fin);
  }

  @Onglet('STATISTIQUES.HOSPITALISATION')
  @Get('hospitalisation')
  hospitalisation(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.hospitalisation(Number(cliniqueId), debut, fin);
  }

  @Onglet('STATISTIQUES.PHARMACIE')
  @Get('pharmacie')
  pharmacie(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.pharmacie(Number(cliniqueId), debut, fin);
  }

  @Onglet('STATISTIQUES.MATERNITE')
  @Get('maternite')
  maternite(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.maternite(Number(cliniqueId), debut, fin);
  }
}
