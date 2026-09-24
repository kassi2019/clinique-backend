import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { PharmacieService } from './pharmacie.service';

/**
 * Tâches planifiées de la pharmacie.
 * Seuil automatique : consommation des 60 derniers jours ÷ 120.
 */
@Injectable()
export class TachesSeuilsService {
  private readonly logger = new Logger(TachesSeuilsService.name);

  constructor(
    private prisma: PrismaService,
    private pharmacie: PharmacieService,
  ) {}

  /** Tous les jours à 03:00 : recalcule les seuils de tous les médicaments. */
  @Cron('0 3 * * *')
  async recalculerSeuilsQuotidien() {
    try {
      const cliniques = await this.prisma.clinique.findMany({
        where: { statut: 'ACTIF' },
        select: { id: true },
      });
      let total = 0;
      for (const c of cliniques) {
        const r = await this.pharmacie.recalculerTousSeuils(c.id);
        total += r.recalcules;
      }
      this.logger.log(
        `Seuils automatiques recalculés : ${total} médicament(s) sur ${cliniques.length} clinique(s).`,
      );
    } catch (e) {
      this.logger.error(`Échec du recalcul des seuils : ${e.message}`);
    }
  }
}
