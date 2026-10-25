import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { critereNomPrenoms } from '../common/recherche-patient';
import { includeSoinsPrescrits } from '../consultations/consultations.service';

const includeRealisation = {
  agent: {
    select: {
      matricule: true,
      personnel: { select: { nom: true, prenom: true } },
    },
  },
} as const;

/** Lignes de prestations SOIN payées (anciens soins passés par la caisse). */
const prestationsSoinPayees = {
  statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
  prestation: { type: 'SOIN' },
};

/** Passage relevant du module Soins : soin payé à la caisse OU soin prescrit par le médecin. */
const passageAvecSoins = (cliniqueId: number) => ({
  cliniqueId,
  OR: [
    { statut: 'ACTIF', prestations: { some: prestationsSoinPayees } },
    { prescriptionsSoins: { some: {} } },
  ],
});

/**
 * Module Soins :
 * - soins payés à la caisse (prestation SOIN) puis réalisés par l'agent ;
 * - soins prescrits par le médecin (onglet « Soins » de la consultation),
 *   visibles tout de suite, administrés une prise après l'autre.
 */
@Injectable()
export class SoinsService {
  constructor(private prisma: PrismaService) {}

  /** Lignes de prestations SOIN d'un passage (payées uniquement). */
  private lignesSoins(passageId: number) {
    return this.prisma.passagePrestation.findMany({
      where: { passageId, statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] }, prestation: { type: 'SOIN' } },
      include: { service: { select: { nom: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** File d'attente : passages ayant des soins payés non encore réalisés, par ordre d'arrivée. */
  async fileAttente(cliniqueId: number) {
    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        OR: [
          { statut: 'ACTIF', prestations: { some: prestationsSoinPayees } },
          { prescriptionsSoins: { some: { statut: 'EN_COURS' } } },
        ],
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: prestationsSoinPayees,
          include: { soin: { select: { statut: true } } },
        },
        prescriptionsSoins: { where: { statut: 'EN_COURS' }, select: { id: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return passages
      .map((p) => ({
        id: p.id,
        numeroOrdre: p.numeroOrdre,
        patient: p.patient,
        service: p.service,
        createdAt: p.createdAt,
        nbSoins: this.nbSoinsAFaire(p),
      }))
      .filter((p) => p.nbSoins > 0);
  }

  /** Soins restant à faire : prestations payées non réalisées + soins prescrits en cours. */
  private nbSoinsAFaire(p: {
    statut: string;
    prestations: { soin: { statut: string } | null }[];
    prescriptionsSoins: { id: number }[];
  }) {
    const prestations =
      p.statut === 'ACTIF'
        ? p.prestations.filter((l) => !l.soin || l.soin.statut !== 'REALISE').length
        : 0;
    return prestations + p.prescriptionsSoins.length;
  }

  /** Recherche de passages avec soins payés (code patient, N° d'ordre, nom). */
  async rechercher(reference: string, cliniqueId: number) {
    const ref = reference.trim().toUpperCase();
    if (!ref) return [];
    const refSans = ref.replace(/[\s-]/g, '');
    const passages = await this.prisma.passage.findMany({
      where: {
        AND: [
          passageAvecSoins(cliniqueId),
          {
            OR: [
              { numeroOrdre: { contains: ref } },
              { patient: { is: { code: refSans } } },
              { patient: { is: critereNomPrenoms(ref) } },
            ],
          },
        ],
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: prestationsSoinPayees,
          include: { soin: { select: { statut: true } } },
        },
        prescriptionsSoins: { where: { statut: 'EN_COURS' }, select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return passages.map((p) => ({
      id: p.id,
      numeroOrdre: p.numeroOrdre,
      patient: p.patient,
      service: p.service,
      nbSoins: this.nbSoinsAFaire(p),
    }));
  }

  /** Détail d'un passage : fiche patient + soins payés + soins prescrits + réalisations. */
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
    const prescrits = await this.prisma.prescriptionSoin.findMany({
      where: { passageId },
      ...includeSoinsPrescrits,
    });
    return { passage, prestations, soins, prescrits };
  }

  /**
   * Confirme une administration d'un soin prescrit (une prise). Le soin passe
   * à TERMINE à la dernière prise prévue.
   */
  async administrer(
    prescriptionSoinId: number,
    date: string,
    observations: string | undefined,
    agentId: number,
  ) {
    const soin = await this.prisma.prescriptionSoin.findUnique({
      where: { id: prescriptionSoinId },
      include: { _count: { select: { administrations: true } } },
    });
    if (!soin) throw new NotFoundException('Soin introuvable.');
    if (soin.statut !== 'EN_COURS') {
      throw new BadRequestException(
        soin.statut === 'ARRETE' ? 'Ce soin a été arrêté par le médecin.' : 'Ce soin est déjà terminé.',
      );
    }
    const faites = soin._count.administrations + 1;
    await this.prisma.$transaction([
      this.prisma.administrationSoin.create({
        data: {
          prescriptionSoinId,
          date: new Date(date),
          observations: observations?.trim() || null,
          agentId,
        },
      }),
      ...(faites >= soin.nbAdministrations
        ? [this.prisma.prescriptionSoin.update({ where: { id: prescriptionSoinId }, data: { statut: 'TERMINE' } })]
        : []),
    ]);
    return this.prisma.prescriptionSoin.findUnique({
      where: { id: prescriptionSoinId },
      include: includeSoinsPrescrits.include,
    });
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
    // Administrations des soins prescrits : même filtre, même forme de ligne
    const whereAdmin = {
      prescriptionSoin: { cliniqueId },
      ...(debut ? { date: { gte: debut, lte: fin } } : {}),
      ...(ref
        ? {
            OR: [
              { prescriptionSoin: { typeSoin: { contains: ref } } },
              { prescriptionSoin: { lignes: { some: { medicamentNom: { contains: ref } } } } },
              { prescriptionSoin: { passage: { numeroOrdre: { contains: ref } } } },
              { prescriptionSoin: { patient: { nom: { contains: ref } } } },
              { prescriptionSoin: { patient: { prenom: { contains: ref } } } },
              { prescriptionSoin: { patient: { code: { contains: ref.replace(/[\s-]/g, '') } } } },
            ],
          }
        : {}),
    };
    const agent = { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } };
    // Les deux sources sont fusionnées par date : on lit assez de lignes de chacune
    const jusqua = page * perPage;
    const [realisations, administrations, totalR, totalA] = await Promise.all([
      this.prisma.realisationSoin.findMany({
        where,
        include: {
          soin: {
            include: {
              patient: { select: { nom: true, prenom: true, code: true } },
              passage: { select: { numeroOrdre: true } },
            },
          },
          agent,
        },
        orderBy: { date: 'desc' },
        take: jusqua,
      }),
      this.prisma.administrationSoin.findMany({
        where: whereAdmin,
        include: {
          prescriptionSoin: {
            include: {
              patient: { select: { nom: true, prenom: true, code: true } },
              passage: { select: { numeroOrdre: true } },
              lignes: { select: { medicamentNom: true, dose: true, unite: true, voie: true } },
            },
          },
          agent,
        },
        orderBy: { date: 'desc' },
        take: jusqua,
      }),
      this.prisma.realisationSoin.count({ where }),
      this.prisma.administrationSoin.count({ where: whereAdmin }),
    ]);
    const lignes = [
      ...realisations,
      ...administrations.map((a) => ({
        id: `A${a.id}`,
        date: a.date,
        observations: a.observations,
        agent: a.agent,
        soin: {
          libelle: [
            a.prescriptionSoin.typeSoin,
            ...a.prescriptionSoin.lignes.map((l) =>
              [l.medicamentNom, l.dose, l.unite, l.voie].filter(Boolean).join(' '),
            ),
          ].join(' — '),
          patient: a.prescriptionSoin.patient,
          passage: a.prescriptionSoin.passage,
        },
      })),
    ].sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime());
    const total = totalR + totalA;
    const data = lignes.slice((page - 1) * perPage, jusqua);
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }
}
