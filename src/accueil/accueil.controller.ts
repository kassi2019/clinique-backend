import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccueilService } from './accueil.service';
import {
  CreatePassageDto,
  UpdatePassageDto,
} from './dto/create-passage.dto';

@UseGuards(JwtAuthGuard)
@Controller('accueil')
export class AccueilController {
  constructor(private accueilService: AccueilService) {}

  /** Recherche d'un patient existant (nom, prénom ou n° de dossier). */
  @Get('patients')
  rechercherPatients(
    @Query('search') search?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    return this.accueilService.rechercherPatients(
      search ?? '',
      cliniqueId ? Number(cliniqueId) : undefined,
    );
  }

  /**
   * Passages : aujourd'hui par défaut, ou jour précis (date),
   * ou plage (debut/fin), avec filtre constantes (OUI/NON).
   */
  @Get('passages')
  listerPassages(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('date') date?: string,
    @Query('debut') debut?: string,
    @Query('fin') fin?: string,
    @Query('constantes') constantes?: string,
    @Query('search') search?: string,
    @Query('serviceId') serviceId?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.accueilService.listerPassages(cliniqueId, {
      date,
      debut,
      fin,
      constantes:
        constantes === 'OUI' || constantes === 'NON' ? constantes : undefined,
      search,
      serviceId: serviceId ? Number(serviceId) : undefined,
      page: page ? Number(page) : undefined,
      perPage: perPage !== undefined ? Number(perPage) : undefined,
    });
  }

  /**
   * Passage par code de passage OU par N° d'ordre (ex. P-ABCD12, MED-004092026).
   * Attention : la route générique /:id doit rester après.
   */
  @Get('passages/code/:code')
  passageParReference(
    @Param('code') code: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    return this.accueilService.passageParReference(
      code,
      cliniqueId ? Number(cliniqueId) : undefined,
    );
  }

  @Get('passages/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accueilService.findOne(id);
  }

  @Post('passages')
  creerPassage(@Body() dto: CreatePassageDto) {
    return this.accueilService.creerPassage(dto);
  }

  @Patch('passages/:id')
  modifierPassage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePassageDto,
  ) {
    return this.accueilService.modifierPassage(id, dto);
  }
}
