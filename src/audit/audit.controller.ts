import { bornesJourOptionnel } from '../common/filtre-periode';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

/** Consultation du journal d'actions (traçabilité des écritures). */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('journal')
export class AuditController {
  constructor(private prisma: PrismaService) {}

  @Roles('ADMINISTRATEUR')
  @Get()
  async lister(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('utilisateurId') utilisateurId?: string,
    @Query('cliniqueId') cliniqueId?: string,
    @Query('jour') jour?: string,
    @Query('entite') entite?: string,
    @Query('heureDebut') heureDebut?: string,
    @Query('heureFin') heureFin?: string,
  ) {
    const p = page ? Number(page) : 1;
    const pp = perPage ? Number(perPage) : 50;
    const uid = utilisateurId ? Number(utilisateurId) : undefined;
    const cid = cliniqueId ? Number(cliniqueId) : undefined;
    const periode = bornesJourOptionnel(jour, heureDebut, heureFin);
    const where: any = {
      ...(cid ? { cliniqueId: cid } : {}),
      ...(uid ? { utilisateurId: uid } : {}),
      ...(entite && entite.trim() ? { entite: entite.trim() } : {}),
      // Jour vide = tous les jours ; heures facultatives (heure seule = aujourd'hui)
      ...(periode ? { createdAt: periode } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.journalAction.findMany({
        where,
        include: {
          utilisateur: {
            select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (p - 1) * pp,
        take: pp,
      }),
      this.prisma.journalAction.count({ where }),
    ]);
    return { data, total, page: p, perPage: pp, totalPages: Math.ceil(total / pp) };
  }
}
