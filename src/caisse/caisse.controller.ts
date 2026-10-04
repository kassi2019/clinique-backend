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

  /** File de la caisse : patients en attente de paiement (ordre d'arrivée, jour courant par défaut). */
  @Get('file-attente')
  fileAttente(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('jour') jour?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.caisseService.fileAttente(
      cliniqueId,
      page ? Number(page) : 1,
      perPage ? Number(perPage) : 100,
      jour,
    );
  }

  /** Paiements valides du jour (reçus émis). */
  @Get('payes')
  payesDuJour(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.caisseService.payesDuJour(
      cliniqueId,
      page ? Number(page) : 1,
      perPage ? Number(perPage) : 100,
    );
  }

  /** Détail d'un passage : prestations à régler + historique des paiements. */
  @Get('passages/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.caisseService.detailPassage(id);
  }

  /** Détail complet d'un paiement (reçu A4 : clinique, patient, lignes, caissier). */
  @Get('paiements/:id')
  detailPaiement(@Param('id', ParseIntPipe) id: number) {
    return this.caisseService.detailPaiement(id);
  }

  /** Ajout manuel d'une prestation à régler. */
  @Post('passages/:id/prestations')
  ajouterPrestation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AjouterPrestationDto,
    @Req() req,
  ) {
    return this.caisseService.ajouterPrestation(id, dto.prestationId, req.user?.id);
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

  // ─── Tickets de crédit / cas sociaux ───

  /** Crée un ticket de crédit ou cas social (prise en charge sans paiement). */
  @Post('passages/:id/credits')
  creerCredit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { lignesIds: number[]; type: 'CREDIT' | 'CAS_SOCIAL'; motif?: string },
    @Req() req,
  ) {
    return this.caisseService.creerCredit(id, dto, req.user.id);
  }

  /** Tickets en cours (impayés) de la clinique. */
  @Get('credits')
  credits(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.caisseService.credits(
      cliniqueId,
      page ? Number(page) : 1,
      perPage ? Number(perPage) : 20,
    );
  }

  /** Annule un ticket : les lignes repassent en attente de paiement. */
  @Post('credits/:id/annuler')
  annulerCredit(@Param('id', ParseIntPipe) id: number) {
    return this.caisseService.annulerCredit(id);
  }
}
