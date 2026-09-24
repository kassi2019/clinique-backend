import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const includeRealisation = {
  agent: {
    select: {
      matricule: true,
      personnel: { select: { nom: true, prenom: true } },
    },
  },
} as const;

/**
 * Module Soins : prescription (prestation SOIN payée à la caisse) puis
 * réalisation par l'agent avec traçabilité. Même logique que le laboratoire.
 */
@Injectable()
export class SoinsService {
  constructor(private prisma: PrismaService) {}

  /** Lignes de prestations SOIN d'un passage (payées uniquement). */
  private lignesSoins(passageId: number) {
    return this.prisma.passagePrestation.findMany({
      where: { passageId, statut: 'PAYEE', prestation: { type: 'SOIN' } },
      include: { service: { select: { nom: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** File d'attente : passages ayant des soins payés non encore réalisés, par ordre d'arrivée. */
  async fileAttente(cliniqueId: number) {
    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        statut: 'ACTIF',
        prestations: {
          some: { statut: 'PAYEE', prestation: { type: 'SOIN' } },
        },
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: { statut: 'PAYEE', prestation: { type: 'SOIN' } },
          include: { soin: { select: { statut: true } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return passages
      .filter((p) => p.prestations.some((l) => !l.soin || l.soin.statut !== 'REALISE'))
      .map((p) => ({
        id: p.id,
        numeroOrdre: p.numeroOrdre,
        patient: p.patient,
        service: p.service,
        createdAt: p.createdAt,
        nbSoins: p.prestations.filter((l) => !l.soin || l.soin.statut !== 'REALISE').length,
      }));
  }

  /** Recherche de passages avec soins payés (code patient, N° d'ordre, nom). */
  async rechercher(reference: string, cliniqueId: number) {
    const ref = reference.trim().toUpperCase();
    if (!ref) return [];
    const refSans = ref.replace(/[\s-]/g, '');
    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        statut: 'ACTIF',
        prestations: { some: { statut: 'PAYEE', prestation: { type: 'SOIN' } } },
        OR: [
          { numeroOrdre: { contains: ref } },
          { patient: { is: { code: refSans } } },
          { patient: { is: { nom: { contains: ref } } } },
          { patient: { is: { prenom: { contains: ref } } } },
        ],
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: { statut: 'PAYEE', prestation: { type: 'SOIN' } },
          include: { soin: { select: { statut: true } } },
        },
      },
      take: 20,
    });
    return passages.map((p) => ({
      id: p.id,
      numeroOrdre: p.numeroOrdre,
      patient: p.patient,
      service: p.service,
      nbSoins: p.prestations.filter((l) => !l.soin || l.soin.statut !== 'REALISE').length,
    }));
  }

  /** Détail d'un passage : fiche patient + soins payés + réalisations. */
  async detailPassage(passageId: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: { patient: true, service: { select: { nom: true } } },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    const prestations = await this.lignesSoins(passageId);
    const soins = await this.prisma.soin.findMany({
      where: { passageId },
      include: { realisations: { include: includeRealisation, orderBy: { date: 'desc' } } },
    });
    return { passage, prestations, soins };
  }

  /** Enregistre la réalisation d'un soin (créé à la première réalisation). */
  async realiser(
    passagePrestationId: number,
    date: string,
    observations: string | undefined,
    agentId: number,
  ) {
    const ligne = await this.prisma.passagePrestation.findUnique({
      where: { id: passagePrestationId },
      include: {
        passage: { select: { id: true, cliniqueId: true, patientId: true, statut: true } },
        prestation: true,
      },
    });
    if (!ligne) throw new NotFoundException('Prestation introuvable.');
    if (ligne.statut !== 'PAYEE') {
      throw new BadRequestException('Soin non payé : paiement requis avant réalisation.');
    }
    if (ligne.prestation?.type !== 'SOIN') {
      throw new BadRequestException('Cette prestation ne relève pas du module Soins.');
    }
    if (ligne.passage.statut !== 'ACTIF') {
      throw new BadRequestException('Code non activé : paiement requis avant réalisation.');
    }

    const soin = await this.prisma.soin.upsert({
      where: { passagePrestationId },
      update: { statut: 'REALISE' },
      create: {
        passageId: ligne.passageId,
        passagePrestationId,
        cliniqueId: ligne.passage.cliniqueId,
        patientId: ligne.passage.patientId,
        libelle: ligne.libelle,
        statut: 'REALISE',
      },
    });

    await this.prisma.realisationSoin.create({
      data: {
        soinId: soin.id,
        date: new Date(date),
        observations: observations?.trim() || null,
        agentId,
      },
    });

    return this.prisma.soin.findUnique({
      where: { id: soin.id },
      include: { realisations: { include: includeRealisation, orderBy: { date: 'desc' } } },
    });
  }

  /** Historique des réalisations (paginé, filtre jour et recherche facultatifs). */
  async realisations(
    cliniqueId: number,
    page = 1,
    perPage = 10,
    jour?: string,
    recherche?: string,
  ) {
    const debut = jour ? new Date(`${jour}T00:00:00`) : undefined;
    const fin = jour ? new Date(`${jour}T23:59:59.999`) : undefined;
    const ref = recherche?.trim().toUpperCase();
    const where = {
      soin: { cliniqueId },
      ...(debut ? { date: { gte: debut, lte: fin } } : {}),
      ...(ref
        ? {
            OR: [
              { soin: { libelle: { contains: ref } } },
              { soin: { passage: { numeroOrdre: { contains: ref } } } },
              { soin: { patient: { nom: { contains: ref } } } },
              { soin: { patient: { prenom: { contains: ref } } } },
              { soin: { patient: { code: { contains: ref.replace(/[\s-]/g, '') } } } },
            ],
          }
        : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.realisationSoin.findMany({
        where,
        include: {
          soin: {
            include: {
              patient: { select: { nom: true, prenom: true, code: true } },
              passage: { select: { numeroOrdre: true } },
            },
          },
          agent: { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } },
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.realisationSoin.count({ where }),
    ]);
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }
}
