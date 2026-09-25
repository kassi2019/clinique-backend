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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RapportsService } from './rapports.service';

/**
 * Module Rapports : rapport mensuel officiel SIG (DIIS).
 * Un rapport par clinique et par mois ; l'en-tête est préremplie depuis la
 * fiche clinique (paramétrage) et les tableaux calculables peuvent être
 * préremplis depuis les données de l'application. Tout reste modifiable.
 */
@UseGuards(JwtAuthGuard)
@Controller('rapports')
export class RapportsController {
  constructor(private rapportsService: RapportsService) {}

  /** Liste des rapports du mois existants (historique). */
  @Get('sig/liste')
  lister(@Query('cliniqueId', ParseIntPipe) cliniqueId: number) {
    return this.rapportsService.lister(cliniqueId);
  }

  /** Récupère le rapport du mois (le crée en brouillon s'il n'existe pas). */
  @Get('sig')
  getRapport(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('mois', ParseIntPipe) mois: number,
    @Query('annee', ParseIntPipe) annee: number,
  ) {
    return this.rapportsService.getRapport(cliniqueId, mois, annee);
  }

  /** Met à jour l'en-tête, les observations, les portes Oui/Non ou le statut. */
  @Patch('sig/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, unknown>) {
    return this.rapportsService.update(id, body);
  }

  /** Réimporte l'en-tête depuis la fiche clinique (Paramétrage → Clinique). */
  @Post('sig/:id/reimporter-entete')
  reimporterEntete(@Param('id', ParseIntPipe) id: number) {
    return this.rapportsService.reimporterEntete(id);
  }

  /** Enregistre les valeurs d'un tableau (remplace les valeurs existantes du tableau). */
  @Put('sig/:id/valeurs')
  saveValeurs(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { tableau: string; valeurs: { ligne: number; colonne: number; valeur: number | null }[] },
  ) {
    return this.rapportsService.saveValeurs(id, body.tableau, body.valeurs ?? []);
  }

  /**
   * Préremplit les tableaux calculables depuis les données de l'application
   * (consultations, soins, CPN, accouchements, décès, TDR, recettes).
   */
  @Post('sig/:id/pre-remplir')
  preRemplir(@Param('id', ParseIntPipe) id: number) {
    return this.rapportsService.preRemplir(id);
  }
}
