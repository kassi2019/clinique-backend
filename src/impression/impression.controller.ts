import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ImpressionService } from './impression.service';

@Controller('impression')
export class ImpressionController {
  constructor(private impressionService: ImpressionService) {}

  /** Configurations des imprimantes par poste (tous les utilisateurs connectés). */
  @UseGuards(JwtAuthGuard)
  @Get('config')
  async getConfig(@Query('cliniqueId') cliniqueId?: string) {
    if (!cliniqueId) return { printers: [] };
    const printers = await this.impressionService.getConfigs(Number(cliniqueId));
    return { printers };
  }

  /** Imprime le ticket de passage sur l'imprimante de tickets. */
  @UseGuards(JwtAuthGuard)
  @Post('passages/:id')
  imprimerTicket(@Param('id', ParseIntPipe) id: number) {
    return this.impressionService.imprimerTicketPassage(id);
  }

  /** Imprime le reçu d'un paiement sur l'imprimante de la caisse. */
  @UseGuards(JwtAuthGuard)
  @Post('paiements/:id')
  imprimerRecu(@Param('id', ParseIntPipe) id: number) {
    return this.impressionService.imprimerRecuPaiement(id);
  }

  /** Imprime l'ordonnance d'une consultation sur l'imprimante des ordonnances. */
  @UseGuards(JwtAuthGuard)
  @Post('consultations/:id')
  imprimerOrdonnance(@Param('id', ParseIntPipe) id: number) {
    return this.impressionService.imprimerOrdonnance(id);
  }

  /** Imprime le reçu de la caisse pharmacie. */
  @UseGuards(JwtAuthGuard)
  @Post('pharmacie-paiements/:id')
  imprimerRecuPharmacie(@Param('id', ParseIntPipe) id: number) {
    return this.impressionService.imprimerRecuPharmacie(id);
  }

  /** Liste les imprimantes installées sur le serveur. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Get('printers')
  async listPrinters() {
    const printers = await this.impressionService.listWindowsPrinters();
    return { printers };
  }

  /** File d'attente d'impression — consommée par l'agent local de la clinique. */
  @UseGuards(JwtAuthGuard)
  @Get('file')
  getFile(@Query('poste') poste?: string, @Query('cliniqueId') cliniqueId?: string) {
    return this.impressionService.getFileAttente(
      poste ?? 'TICKET',
      cliniqueId ? Number(cliniqueId) : undefined,
    );
  }

  /** L'agent local confirme le résultat d'une impression (IMPRIMEE / ECHEC). */
  @UseGuards(JwtAuthGuard)
  @Post('file/:id/statut')
  updateStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { statut: 'IMPRIMEE' | 'ECHEC'; erreur?: string },
  ) {
    return this.impressionService.updateStatutFile(id, body.statut, body.erreur);
  }

  /** Enregistre la configuration d'une imprimante (par poste, en base). */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Put('config')
  updateConfig(@Body() body: any) {
    return this.impressionService.updateConfig(
      Number(body.cliniqueId),
      body.poste,
      {
        type: body.type,
        nom: body.nom,
        partage: body.partage,
        ip: body.ip,
        port: body.port != null ? Number(body.port) : undefined,
        largeur: body.largeur != null ? Number(body.largeur) : undefined,
        autoPrint: body.autoPrint,
      },
    );
  }

  /** Teste la connexion à l'imprimante d'un poste. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('test')
  test(@Body() body: any) {
    return this.impressionService.testPrinter(Number(body.cliniqueId), body.poste ?? 'TICKET');
  }
}
