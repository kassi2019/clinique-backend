import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AffectationService {
  private readonly logger = new Logger(AffectationService.name);

  /** Un médecin est considéré « vivant » si son poste a émis un signal il y a moins de 2 minutes. */
  static SEUIL_ACTIVITE_MS = 2 * 60 * 1000;

  constructor(private prisma: PrismaService) {}

  /** Médecins éligibles : rôle MEDECIN, compte actif, DISPONIBLE et poste allumé (heartbeat). */
  private async medecinsDisponibles(cliniqueId: number) {
    const limite = new Date(Date.now() - AffectationService.SEUIL_ACTIVITE_MS);
    return this.prisma.utilisateur.findMany({
      where: {
        statut: 'ACTIF',
        disponibilite: 'DISPONIBLE',
        derniereActivite: { gte: limite },
        role: { code: 'MEDECIN' },
        personnel: { cliniqueId },
      },
      select: {
        id: true,
        personnel: { select: { nom: true, prenom: true } },
        _count: {
          select: {
            affectations: {
              where: { statut: { in: ['EN_ATTENTE', 'EN_CONSULTATION'] } },
            },
          },
        },
        affectations: {
          where: { statut: { in: ['EN_ATTENTE', 'EN_CONSULTATION'] } },
          orderBy: { dateAffectation: 'desc' },
          take: 1,
          select: { dateAffectation: true },
        },
      },
    });
  }

  /**
   * Affecte un passage au médecin disponible ayant la file la moins chargée.
   * Égalité → médecin dont la dernière affectation est la plus ancienne.
   * Aucun médecin disponible → affectation sans médecin (file globale).
   */
  async assignerPassage(passageId: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
    });
    if (!passage) return null;

    const existante = await this.prisma.affectation.findUnique({
      where: { passageId },
    });
    if (existante) return existante; // idempotent

    const medecins = await this.medecinsDisponibles(passage.cliniqueId);

    let medecinId: number | null = null;
    if (medecins.length > 0) {
      const minimum = Math.min(...medecins.map((m) => m._count.affectations));
      const candidats = medecins.filter((m) => m._count.affectations === minimum);
      // Égalité : le médecin dont la dernière affectation est la plus ancienne
      candidats.sort(
        (a, b) =>
          (a.affectations[0]?.dateAffectation?.getTime() ?? 0) -
          (b.affectations[0]?.dateAffectation?.getTime() ?? 0),
      );
      medecinId = candidats[0].id;
    }

    return this.prisma.affectation.create({
      data: {
        cliniqueId: passage.cliniqueId,
        passageId,
        medecinId,
        statut: 'EN_ATTENTE',
      },
      include: {
        medecin: {
          select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
        },
        passage: {
          select: { numeroOrdre: true, patient: { select: { nom: true, prenom: true } } },
        },
      },
    });
  }

  /** Redistribue les affectations sans médecin (un médecin vient de se rendre disponible). */
  async redistribuerNonAffectees(cliniqueId: number) {
    const nonAffectees = await this.prisma.affectation.findMany({
      where: { cliniqueId, medecinId: null, statut: 'EN_ATTENTE' },
      orderBy: { dateAffectation: 'asc' },
    });
    let redistribuees = 0;
    for (const a of nonAffectees) {
      const medecins = await this.medecinsDisponibles(cliniqueId);
      if (medecins.length === 0) break;
      const minimum = Math.min(...medecins.map((m) => m._count.affectations));
      const candidats = medecins.filter((m) => m._count.affectations === minimum);
      candidats.sort(
        (x, y) =>
          (x.affectations[0]?.dateAffectation?.getTime() ?? 0) -
          (y.affectations[0]?.dateAffectation?.getTime() ?? 0),
      );
      await this.prisma.affectation.update({
        where: { id: a.id },
        data: { medecinId: candidats[0].id, dateAffectation: new Date() },
      });
      redistribuees += 1;
    }
    return redistribuees;
  }

  /** Annule l'affectation d'un passage (paiement annulé, pas de consultation validée). */
  async annulerAffectation(passageId: number) {
    const affectation = await this.prisma.affectation.findUnique({
      where: { passageId },
    });
    if (!affectation || affectation.statut === 'TERMINE') return null;
    return this.prisma.affectation.update({
      where: { id: affectation.id },
      data: { statut: 'ANNULE' },
    });
  }
}
