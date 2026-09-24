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
  CreateGrossesseDto,
  CreateVisiteCpnDto,
  UpdateAccouchementDto,
  UpdateGrossesseDto,
  UpdateVisiteCpnDto,
} from './dto/maternite.dto';
import { MaterniteService } from './maternite.service';

@UseGuards(JwtAuthGuard)
@Controller('maternite')
export class MaterniteController {
  constructor(private materniteService: MaterniteService) {}

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
