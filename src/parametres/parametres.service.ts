import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateParametreDto } from './dto/update-parametre.dto';

@Injectable()
export class ParametresService {
  constructor(private prisma: PrismaService) {}

  /** Récupère les paramètres d'une clinique (créés à la volée si absents). */
  getOrCreate(cliniqueId: number) {
    return this.prisma.parametre.upsert({
      where: { cliniqueId },
      update: {},
      create: { cliniqueId },
    });
  }

  async update(cliniqueId: number, dto: UpdateParametreDto) {
    await this.getOrCreate(cliniqueId);
    return this.prisma.parametre.update({
      where: { cliniqueId },
      data: {
        loginImage: dto.loginImage,
        logoRapportGauche: dto.logoRapportGauche,
        logoRapportCentre: dto.logoRapportCentre,
        logoRapportDroit: dto.logoRapportDroit,
        sigVersion: dto.sigVersion,
      },
    });
  }
}
