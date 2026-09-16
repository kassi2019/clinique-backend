import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ImpressionService } from './impression.service';

@Controller('impression')
export class ImpressionController {
  constructor(private impressionService: ImpressionService) {}

  /** Configuration courante de l'imprimante (tous les utilisateurs connectés). */
  @UseGuards(JwtAuthGuard)
  @Get('config')
  getConfig() {
    return this.impressionService.getConfig();
  }

  /** Imprime le ticket de passage sur l'imprimante configurée. */
  @UseGuards(JwtAuthGuard)
  @Post('passages/:id')
  imprimerTicket(@Param('id', ParseIntPipe) id: number) {
    return this.impressionService.imprimerTicketPassage(id);
  }

  /** Imprime le reçu d'un paiement sur l'imprimante configurée. */
  @UseGuards(JwtAuthGuard)
  @Post('paiements/:id')
  imprimerRecu(@Param('id', ParseIntPipe) id: number) {
    return this.impressionService.imprimerRecuPaiement(id);
  }

  /** Imprime l'ordonnance d'une consultation. */
  @UseGuards(JwtAuthGuard)
  @Post('consultations/:id')
  imprimerOrdonnance(@Param('id', ParseIntPipe) id: number) {
    return this.impressionService.imprimerOrdonnance(id);
  }

  /** Liste les imprimantes installées sur le serveur. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Get('printers')
  async listPrinters() {
    const printers = await this.impressionService.listWindowsPrinters();
    return { printers };
  }

  /** Met à jour la configuration imprimante (fichier .env). */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('config')
  updateConfig(@Body() updates: any) {
    const message = this.impressionService.updateConfigEnv(updates);
    return { message, config: this.impressionService.getConfig() };
  }

  /** Teste la connexion à l'imprimante et imprime un ticket de test. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('test')
  async test() {
    return this.impressionService.testPrinter();
  }
}
