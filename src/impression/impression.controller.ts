import {
  Body,
  Controller,
  Delete,
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
  imprimerOrdonnance(@Param('id', ParseIntPipe) id: number, @Query('ordonnanceId') ordonnanceId?: string) {
    // ordonnanceId : n'imprime que cette ordonnance (une consultation peut en porter plusieurs)
    return this.impressionService.imprimerOrdonnance(id, ordonnanceId ? Number(ordonnanceId) : undefined);
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

  /** Signal de vie de l'agent local : renvoie les postes qu'il doit imprimer. */
  @UseGuards(JwtAuthGuard)
  @Post('agents/signal')
  signalAgent(@Body() body: { nom: string; postes?: string[] }) {
    return this.impressionService.signalAgent(body.nom, body.postes);
  }

  /** Liste des agents d'impression (PC de la clinique) et de leurs postes. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Get('agents')
  listAgents() {
    return this.impressionService.listAgents();
  }

  /** Modifie les postes imprimés par un agent. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Put('agents/:id')
  updateAgent(@Param('id', ParseIntPipe) id: number, @Body() body: { postes: string[] }) {
    return this.impressionService.updateAgentPostes(id, body.postes);
  }

  /** Retire un agent de la liste (PC désinstallé). */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Delete('agents/:id')
  deleteAgent(@Param('id', ParseIntPipe) id: number) {
    return this.impressionService.deleteAgent(id);
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
