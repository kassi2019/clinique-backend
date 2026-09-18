import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatistiquesService } from './statistiques.service';

@UseGuards(JwtAuthGuard)
@Controller('statistiques')
export class StatistiquesController {
  constructor(private statistiquesService: StatistiquesService) {}

  @Get('tableau-bord')
  tableauBord(@Query('jour') jour?: string, @Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return {};
    return this.statistiquesService.tableauBord(Number(cliniqueId), jour);
  }

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

  @Get('recettes')
  recettes(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.recettes(Number(cliniqueId), debut, fin);
  }

  @Get('laboratoire')
  laboratoire(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.laboratoire(Number(cliniqueId), debut, fin);
  }

  @Get('imagerie')
  imagerie(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.imagerie(Number(cliniqueId), debut, fin);
  }

  @Get('hospitalisation')
  hospitalisation(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.hospitalisation(Number(cliniqueId), debut, fin);
  }

  @Get('pharmacie')
  pharmacie(
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return {};
    return this.statistiquesService.pharmacie(Number(cliniqueId), debut, fin);
  }

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
