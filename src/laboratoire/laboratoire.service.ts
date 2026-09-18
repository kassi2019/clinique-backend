import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EnregistrerResultatsDto } from './dto/laboratoire.dto';

const N = (x: any) => Number(x);

const includeExamen = {
  lignes: true,
  prelevePar: {
    select: {
      matricule: true,
      personnel: { select: { nom: true, prenom: true } },
    },
  },
  validePar: {
    select: {
      matricule: true,
      personnel: { select: { nom: true, prenom: true } },
    },
  },
} satisfies Prisma.ExamenLaboInclude;

@Injectable()
export class LaboratoireService {
  constructor(private prisma: PrismaService) {}

  /** Service LAB de la clinique : les examens de laboratoire lui sont rattachés. */
  private async labServiceId(cliniqueId: number) {
    const lab = await this.prisma.service.findFirst({
      where: { cliniqueId, code: 'LAB' },
    });
    return lab?.id ?? null;
  }

  /**
   * Recherche des passages dont le code est actif et qui portent des examens LAB payés (§11).
   * Recherche par N° d'ordre (tirets conservés), code patient (sans séparateurs), nom ou prénom.
   */
  async rechercher(reference: string, cliniqueId: number) {
    const ref = reference.trim().toUpperCase();
    const refSans = ref.replace(/[\s-]/g, '');
    if (!ref) return [];

    const labId = await this.labServiceId(cliniqueId);
    if (!labId) return [];

    const filtreLabPayees = {
      statut: 'PAYEE',
      OR: [{ serviceId: labId }, { prestation: { serviceId: labId } }],
    };

    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        statut: 'ACTIF',
        OR: [
          { numeroOrdre: { contains: ref } },
          { patient: { is: { code: refSans } } },
          { patient: { is: { nom: { contains: ref } } } },
          { patient: { is: { prenom: { contains: ref } } } },
        ],
        prestations: { some: filtreLabPayees },
      },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
        prestations: {
          where: filtreLabPayees,
          include: { service: { select: { nom: true } } },
        },
        examensLabo: { include: { lignes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return passages.map((p) => ({
      id: p.id,
      numeroOrdre: p.numeroOrdre,
      statut: p.statut,
      createdAt: p.createdAt,
      patient: p.patient,
      service: p.service,
      examensPayes: p.prestations.map((l) => ({ ...l, montant: N(l.montant) })),
      nbExamensLab: p.prestations.length,
      nbExamensTraites: p.examensLabo.length,
    }));
  }

  /** Détail d'un passage : fiche patient, prestations, examens et historique du patient. */
  async detailPassage(passageId: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
        prestations: {
          include: {
            service: { select: { id: true, code: true, nom: true } },
            prestation: { select: { type: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        examensLabo: { include: includeExamen, orderBy: { preleveLe: 'asc' } },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    // Historique des examens du patient (tous passages confondus)
    const historique = await this.prisma.examenLabo.findMany({
      where: { patientId: passage.patientId },
      include: {
        lignes: true,
        passage: {
          select: {
            numeroOrdre: true,
            createdAt: true,
            service: { select: { nom: true } },
          },
        },
      },
      orderBy: { preleveLe: 'desc' },
    });

    return {
      passage: {
        id: passage.id,
        numeroOrdre: passage.numeroOrdre,
        statut: passage.statut,
        typePatient: passage.typePatient,
        referent: passage.referent,
        prestationDemandee: passage.prestationDemandee,
        createdAt: passage.createdAt,
        constantes: {
          taille: passage.taille,
          temperature: passage.temperature ? N(passage.temperature) : null,
          pouls: passage.pouls,
          tensionGauche: passage.tensionGauche,
          tensionDroite: passage.tensionDroite,
          poids: passage.poids ? N(passage.poids) : null,
        },
        patient: passage.patient,
        service: passage.service,
        prestations: passage.prestations.map((l) => ({ ...l, montant: N(l.montant) })),
        examens: passage.examensLabo,
      },
      historique,
    };
  }

  /**
   * Enregistre le prélèvement (étape obligatoire §11) pour une prestation LAB payée.
   * Création paresseuse et idempotente de l'examen (statut PRELEVE).
   */
  async enregistrerPrelevement(passageId: number, passagePrestationId: number, utilisateurId: number) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    if (passage.statut !== 'ACTIF') {
      throw new BadRequestException('Code non activé : paiement requis avant prélèvement.');
    }

    const labId = await this.labServiceId(passage.cliniqueId);
    if (!labId) throw new BadRequestException('Aucun service de laboratoire configuré.');

    const ligne = await this.prisma.passagePrestation.findFirst({
      where: { id: passagePrestationId, passageId, statut: 'PAYEE' },
      include: { prestation: true },
    });
    if (!ligne) throw new BadRequestException('Examen non payé ou inexistant.');
    if (ligne.serviceId !== labId && ligne.prestation?.serviceId !== labId) {
      throw new BadRequestException('Cette prestation ne relève pas du laboratoire.');
    }

    return this.prisma.examenLabo.upsert({
      where: { passagePrestationId: ligne.id },
      // Ne touche jamais statut / lignes / conclusion : aucun risque d'écraser des résultats
      update: { preleveParId: utilisateurId, preleveLe: new Date() },
      create: {
        passageId,
        passagePrestationId: ligne.id,
        cliniqueId: passage.cliniqueId,
        patientId: passage.patientId,
        libelle: ligne.libelle,
        preleveParId: utilisateurId,
        preleveLe: new Date(),
      },
      include: includeExamen,
    });
  }

  /** Enregistre les résultats (lignes structurées + conclusion). Verrouillé après validation. */
  async enregistrerResultats(examenId: number, dto: EnregistrerResultatsDto) {
    const examen = await this.prisma.examenLabo.findUnique({ where: { id: examenId } });
    if (!examen) throw new NotFoundException('Examen introuvable.');
    if (examen.statut === 'VALIDE') {
      throw new BadRequestException('Examen déjà validé : résultats verrouillés.');
    }

    await this.prisma.$transaction([
      this.prisma.resultatLigne.deleteMany({ where: { examenLaboId: examenId } }),
      this.prisma.resultatLigne.createMany({
        data: dto.lignes.map((l) => ({
          examenLaboId: examenId,
          parametre: l.parametre,
          valeur: l.valeur ?? null,
          unite: l.unite ?? null,
          normes: l.normes ?? null,
        })),
      }),
      this.prisma.examenLabo.update({
        where: { id: examenId },
        data: { statut: 'RESULTATS', conclusion: dto.conclusion ?? null },
      }),
    ]);

    return this.prisma.examenLabo.findUnique({
      where: { id: examenId },
      include: includeExamen,
    });
  }

  /** Validation du résultat (§11) : les résultats doivent avoir été saisis. */
  async valider(examenId: number, utilisateurId: number) {
    const examen = await this.prisma.examenLabo.findUnique({ where: { id: examenId } });
    if (!examen) throw new NotFoundException('Examen introuvable.');
    if (examen.statut !== 'RESULTATS') {
      throw new BadRequestException('Saisir les résultats avant validation.');
    }
    return this.prisma.examenLabo.update({
      where: { id: examenId },
      data: { statut: 'VALIDE', valideParId: utilisateurId, valideLe: new Date() },
      include: includeExamen,
    });
  }

  /** Historique des examens réalisés, paginé (défaut : jour courant). */
  async historique(params: {
    jour?: string;
    recherche?: string;
    page: number;
    perPage: number;
    cliniqueId: number;
  }) {
    const { jour, recherche, page, perPage, cliniqueId } = params;
    const jourRef =
      jour && /^\d{4}-\d{2}-\d{2}$/.test(jour) ? jour : new Date().toISOString().slice(0, 10);
    const debut = new Date(`${jourRef}T00:00:00`);
    const fin = new Date(`${jourRef}T23:59:59.999`);

    const where: Prisma.ExamenLaboWhereInput = {
      cliniqueId,
      preleveLe: { gte: debut, lte: fin },
    };
    const ref = recherche?.trim().toUpperCase();
    if (ref) {
      where.OR = [
        { passage: { numeroOrdre: { contains: ref } } },
        { patient: { nom: { contains: ref } } },
        { patient: { prenom: { contains: ref } } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.examenLabo.findMany({
        where,
        include: {
          lignes: true,
          passage: { select: { numeroOrdre: true, createdAt: true } },
          patient: { select: { nom: true, prenom: true, code: true, sexe: true, age: true } },
          prelevePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
          validePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
        },
        orderBy: { preleveLe: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.examenLabo.count({ where }),
    ]);

    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }
}
