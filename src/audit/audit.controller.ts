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
  ) {
    const p = page ? Number(page) : 1;
    const pp = perPage ? Number(perPage) : 50;
    const uid = utilisateurId ? Number(utilisateurId) : undefined;
    const cid = cliniqueId ? Number(cliniqueId) : undefined;
    const where: any = {
      ...(cid ? { cliniqueId: cid } : {}),
      ...(uid ? { utilisateurId: uid } : {}),
      ...(jour && /^\d{4}-\d{2}-\d{2}$/.test(jour)
        ? { createdAt: { gte: new Date(`${jour}T00:00:00`), lte: new Date(`${jour}T23:59:59.999`) } }
        : {}),
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
