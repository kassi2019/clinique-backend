import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Liste légère des utilisateurs d'une clinique (id + nom) pour le filtre
 * « Utilisateur » des listes et rapports. Ouverte à tout utilisateur connecté
 * (la gestion complète /utilisateurs reste réservée à l'administrateur).
 */
@UseGuards(JwtAuthGuard)
@Controller('utilisateurs-options')
export class UtilisateursOptionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async lister(@Query('cliniqueId') cliniqueId?: string) {
    const id = Number(cliniqueId);
    const utilisateurs = await this.prisma.utilisateur.findMany({
      where: Number.isInteger(id) && id > 0 ? { personnel: { cliniqueId: id } } : {},
      select: { id: true, matricule: true, personnel: { select: { nom: true, prenom: true } } },
    });
    return utilisateurs
      .map((u) => ({
        id: u.id,
        nom: `${u.personnel.nom} ${u.personnel.prenom}`.trim() || u.matricule,
      }))
      .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  }
}
