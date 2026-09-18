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
import { EnregistrerCrDto } from './dto/imagerie.dto';
import { ImagerieService } from './imagerie.service';

@UseGuards(JwtAuthGuard)
@Controller('imagerie')
export class ImagerieController {
  constructor(private imagerieService: ImagerieService) {}

  /** Recherche des passages au code actif portant des examens IMA payés (§12). */
  @Get('recherche')
  rechercher(@Query('code') code?: string, @Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return [];
    return this.imagerieService.rechercher(code ?? '', Number(cliniqueId));
  }

  /** Détail d'un passage : fiche patient, prestations, examens et historique. */
  @Get('passages/:id')
  detailPassage(@Param('id', ParseIntPipe) id: number) {
    return this.imagerieService.detailPassage(id);
  }

  /** Enregistre le compte rendu (4 sections) d'un examen IMA payé. */
  @Post('passages/:id/examens')
  enregistrerCr(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EnregistrerCrDto,
  ) {
    return this.imagerieService.enregistrerCr(id, dto);
  }

  /** Valide le compte rendu. */
  @Post('examens/:id/valider')
  valider(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.imagerieService.valider(id, req.user.id);
  }

  /** Historique des examens réalisés, paginé (défaut : jour courant). */
  @Get('examens')
  historique(
    @Query('jour') jour?: string,
    @Query('recherche') recherche?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('cliniqueId') cliniqueId?: string,
  ) {
    if (!cliniqueId) return { data: [], total: 0, page: 1, perPage: 10, totalPages: 0 };
    return this.imagerieService.historique({
      jour,
      recherche,
      page: page ? Number(page) : 1,
      perPage: perPage ? Number(perPage) : 10,
      cliniqueId: Number(cliniqueId),
    });
  }
}
