import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EnregistrerCrDto } from './dto/imagerie.dto';

const N = (x: any) => Number(x);

const includeExamen = {
  validePar: {
    select: {
      matricule: true,
      personnel: { select: { nom: true, prenom: true } },
    },
  },
} satisfies Prisma.ExamenImagerieInclude;

@Injectable()
export class ImagerieService {
  constructor(private prisma: PrismaService) {}

  /** Service IMA de la clinique : les examens d'imagerie lui sont rattachés. */
  private async imaServiceId(cliniqueId: number) {
    const ima = await this.prisma.service.findFirst({
      where: { cliniqueId, code: 'IMA' },
    });
    return ima?.id ?? null;
  }

  /**
   * Recherche des passages dont le code est actif et qui portent des examens IMA payés (§12).
   * Recherche par N° d'ordre (tirets conservés), code patient (sans séparateurs), nom ou prénom.
   */
  async fileAttente(cliniqueId: number) {
    const imaId = await this.imaServiceId(cliniqueId);
    if (!imaId) return [];
    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        statut: 'ACTIF',
        prestations: {
          some: {
            statut: 'PAYEE',
            OR: [{ serviceId: imaId }, { prestation: { serviceId: imaId } }],
          },
        },
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: {
            statut: 'PAYEE',
            OR: [{ serviceId: imaId }, { prestation: { serviceId: imaId } }],
          },
        },
        examensImagerie: { select: { passagePrestationId: true, statut: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return passages
      .filter((p) =>
        p.prestations.some((l) => {
          const examen = p.examensImagerie.find((e) => e.passagePrestationId === l.id);
          return !examen || examen.statut !== 'VALIDE';
        }),
      )
      .map((p) => ({
        id: p.id,
        numeroOrdre: p.numeroOrdre,
        patient: p.patient,
        service: p.service,
        createdAt: p.createdAt,
        nbExamens: p.prestations.filter((l) => {
          const examen = p.examensImagerie.find((e) => e.passagePrestationId === l.id);
          return !examen || examen.statut !== 'VALIDE';
        }).length,
      }));
  }

  async rechercher(reference: string, cliniqueId: number) {
    const ref = reference.trim().toUpperCase();
    const refSans = ref.replace(/[\s-]/g, '');
    if (!ref) return [];

    const imaId = await this.imaServiceId(cliniqueId);
    if (!imaId) return [];

    const filtreImaPayes = {
      statut: 'PAYEE',
      OR: [{ serviceId: imaId }, { prestation: { serviceId: imaId } }],
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
        prestations: { some: filtreImaPayes },
      },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
        prestations: {
          where: filtreImaPayes,
          include: { service: { select: { nom: true } } },
        },
        examensImagerie: true,
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
      nbExamensIma: p.prestations.length,
      nbExamensTraites: p.examensImagerie.length,
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
        examensImagerie: { include: includeExamen, orderBy: { createdAt: 'asc' } },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    // Historique des examens du patient (tous passages confondus)
    const historique = await this.prisma.examenImagerie.findMany({
      where: { patientId: passage.patientId },
      include: {
        passage: {
          select: {
            numeroOrdre: true,
            createdAt: true,
            service: { select: { nom: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
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
        patient: passage.patient,
        service: passage.service,
        prestations: passage.prestations.map((l) => ({ ...l, montant: N(l.montant) })),
        examens: passage.examensImagerie,
      },
      historique,
    };
  }

  /**
   * Enregistre le compte rendu d'un examen IMA payé (4 sections).
   * Création paresseuse et idempotente (statut RESULTATS) ; verrouillé après validation.
   */
  async enregistrerCr(passageId: number, dto: EnregistrerCrDto) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    if (passage.statut !== 'ACTIF') {
      throw new BadRequestException('Code non activé : paiement requis.');
    }

    const imaId = await this.imaServiceId(passage.cliniqueId);
    if (!imaId) throw new BadRequestException('Aucun service d\'imagerie configuré.');

    const ligne = await this.prisma.passagePrestation.findFirst({
      where: { id: dto.passagePrestationId, passageId, statut: 'PAYEE' },
      include: { prestation: true },
    });
    if (!ligne) throw new BadRequestException('Examen non payé ou inexistant.');
    if (ligne.serviceId !== imaId && ligne.prestation?.serviceId !== imaId) {
      throw new BadRequestException('Cette prestation ne relève pas de l\'imagerie.');
    }

    const existant = await this.prisma.examenImagerie.findUnique({
      where: { passagePrestationId: ligne.id },
    });
    if (existant && existant.statut === 'VALIDE') {
      throw new BadRequestException('Examen déjà validé : compte rendu verrouillé.');
    }
    if (
      !dto.indication?.trim() &&
      !dto.technique?.trim() &&
      !dto.resultat?.trim() &&
      !dto.conclusion?.trim()
    ) {
      throw new BadRequestException('Renseignez au moins une section du compte rendu.');
    }

    return this.prisma.examenImagerie.upsert({
      where: { passagePrestationId: ligne.id },
      update: {
        indication: dto.indication ?? null,
        technique: dto.technique ?? null,
        resultat: dto.resultat ?? null,
        conclusion: dto.conclusion ?? null,
        // ne touche jamais statut / validation
      },
      create: {
        passageId,
        passagePrestationId: ligne.id,
        cliniqueId: passage.cliniqueId,
        patientId: passage.patientId,
        libelle: ligne.libelle,
        indication: dto.indication ?? null,
        technique: dto.technique ?? null,
        resultat: dto.resultat ?? null,
        conclusion: dto.conclusion ?? null,
      },
      include: includeExamen,
    });
  }

  /** Validation du compte rendu (§12) : le CR doit avoir été saisi. */
  async valider(examenId: number, utilisateurId: number) {
    const examen = await this.prisma.examenImagerie.findUnique({
      where: { id: examenId },
    });
    if (!examen) throw new NotFoundException('Examen introuvable.');
    if (examen.statut !== 'RESULTATS') {
      throw new BadRequestException('Saisir le compte rendu avant validation.');
    }
    return this.prisma.examenImagerie.update({
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

    const where: Prisma.ExamenImagerieWhereInput = {
      cliniqueId,
      createdAt: { gte: debut, lte: fin },
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
      this.prisma.examenImagerie.findMany({
        where,
        include: {
          passage: { select: { numeroOrdre: true, createdAt: true } },
          patient: { select: { nom: true, prenom: true, code: true, sexe: true, age: true } },
          validePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.examenImagerie.count({ where }),
    ]);

    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }
}
