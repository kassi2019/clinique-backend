import {
  Body,
  Controller,
  Delete,
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
import { CaisseService } from './caisse.service';
import {
  AjouterPrestationDto,
  AnnulerPaiementDto,
  EncaisserDto,
} from './dto/encaisser.dto';

@UseGuards(JwtAuthGuard)
@Controller('caisse')
export class CaisseController {
  constructor(private caisseService: CaisseService) {}

  /** Recherche unique (§6.1) : code patient, nom, prénom ou N° d'ordre. */
  @Get('recherche')
  rechercher(
    @Query('search') search?: string,
    @Query('cliniqueId', ParseIntPipe) cliniqueId?: number,
  ) {
    if (!cliniqueId) return [];
    return this.caisseService.rechercher(search ?? '', cliniqueId);
  }

  /** Détail d'un passage : prestations à régler + historique des paiements. */
  @Get('passages/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.caisseService.detailPassage(id);
  }

  /** Ajout manuel d'une prestation à régler. */
  @Post('passages/:id/prestations')
  ajouterPrestation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AjouterPrestationDto,
  ) {
    return this.caisseService.ajouterPrestation(id, dto.prestationId);
  }

  /** Retire une prestation non payée. */
  @Delete('prestations/:id')
  retirerPrestation(@Param('id', ParseIntPipe) id: number) {
    return this.caisseService.retirerPrestation(id);
  }

  /** Encaissement des prestations cochées + impression du reçu. */
  @Post('passages/:id/encaisser')
  encaisser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EncaisserDto,
    @Req() req,
  ) {
    return this.caisseService.encaisser(id, dto, req.user.id);
  }

  /** Annulation d'un paiement (réservée à l'administrateur, §6.2). */
  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('paiements/:id/annuler')
  annuler(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AnnulerPaiementDto,
  ) {
    return this.caisseService.annulerPaiement(id, dto.motif);
  }
}
