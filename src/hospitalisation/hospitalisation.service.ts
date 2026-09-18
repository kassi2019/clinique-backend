import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdmissionDto, CreerChambreDto, CreerLitDto, CreerTypeChambreDto, SortieDto, SuiviDto } from './dto/hospitalisation.dto';

const N = (x: any) => Number(x);

const includeSejour = {
  lit: { include: { chambre: { include: { typeChambre: true } } } },
  patient: { select: { id: true, nom: true, prenom: true, code: true, sexe: true, age: true } },
  passage: { select: { numeroOrdre: true, createdAt: true } },
  sortiePar: {
    select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
  },
  ligneCaisse: { select: { id: true, statut: true, montant: true, libelle: true } },
} satisfies Prisma.HospitalisationInclude;

@Injectable()
export class HospitalisationService {
  constructor(private prisma: PrismaService) {}

  // ─────────── Types de chambres (référentiel) ───────────

  async listerTypes(cliniqueId: number) {
    return this.prisma.typeChambre.findMany({
      where: { cliniqueId },
      include: { _count: { select: { chambres: true } } },
      orderBy: { libelle: 'asc' },
    });
  }

  async creerType(cliniqueId: number, dto: CreerTypeChambreDto) {
    try {
      return await this.prisma.typeChambre.create({
        data: { cliniqueId, libelle: dto.libelle.trim() },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Le type « ${dto.libelle} » existe déjà.`);
      }
      throw e;
    }
  }

  async modifierType(id: number, dto: CreerTypeChambreDto) {
    const type = await this.prisma.typeChambre.findUnique({ where: { id } });
    if (!type) throw new NotFoundException('Type de chambre introuvable.');
    try {
      return await this.prisma.typeChambre.update({
        where: { id },
        data: { libelle: dto.libelle.trim() },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Le type « ${dto.libelle} » existe déjà.`);
      }
      throw e;
    }
  }

  async desactiverType(id: number) {
    const type = await this.prisma.typeChambre.findUnique({ where: { id } });
    if (!type) throw new NotFoundException('Type de chambre introuvable.');
    return this.prisma.typeChambre.update({
      where: { id },
      data: { actif: !type.actif },
    });
  }

  // ─────────── Chambres & lits (Paramétrage) ───────────

  async listerChambres(cliniqueId: number) {
    const chambres = await this.prisma.chambre.findMany({
      where: { cliniqueId },
      include: {
        lits: { orderBy: { numero: 'asc' } },
        typeChambre: true,
      },
      orderBy: { numero: 'asc' },
    });
    return chambres;
  }

  async creerChambre(cliniqueId: number, dto: CreerChambreDto) {
    try {
      return await this.prisma.chambre.create({
        data: {
          cliniqueId,
          numero: dto.numero.trim(),
          typeChambreId: dto.typeChambreId ?? null,
          tarifJournalier: dto.tarifJournalier ?? null,
        },
        include: { lits: true, typeChambre: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Une chambre avec le numéro « ${dto.numero} » existe déjà.`);
      }
      throw e;
    }
  }

  async modifierChambre(id: number, dto: Partial<CreerChambreDto>) {
    const chambre = await this.prisma.chambre.findUnique({ where: { id } });
    if (!chambre) throw new NotFoundException('Chambre introuvable.');
    return this.prisma.chambre.update({
      where: { id },
      data: {
        numero: dto.numero?.trim(),
        typeChambreId: dto.typeChambreId ?? null,
        tarifJournalier: dto.tarifJournalier ?? null,
      },
      include: { lits: true, typeChambre: true },
    });
  }

  async desactiverChambre(id: number) {
    const chambre = await this.prisma.chambre.findUnique({
      where: { id },
      include: { lits: { include: { hospitalisations: { where: { statut: 'EN_COURS' } } } } },
    });
    if (!chambre) throw new NotFoundException('Chambre introuvable.');
    const occupee = chambre.lits.some((l) => l.hospitalisations.length > 0);
    if (occupee) {
      throw new BadRequestException('Chambre occupée : impossible de la désactiver.');
    }
    return this.prisma.chambre.update({
      where: { id },
      data: { actif: !chambre.actif },
    });
  }

  async creerLit(chambreId: number, dto: CreerLitDto) {
    const chambre = await this.prisma.chambre.findUnique({ where: { id: chambreId } });
    if (!chambre) throw new NotFoundException('Chambre introuvable.');
    try {
      return await this.prisma.lit.create({
        data: { chambreId, numero: dto.numero.trim() },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          `Un lit « ${dto.numero} » existe déjà dans cette chambre.`,
        );
      }
      throw e;
    }
  }

  async desactiverLit(id: number) {
    const lit = await this.prisma.lit.findUnique({
      where: { id },
      include: { hospitalisations: { where: { statut: 'EN_COURS' } } },
    });
    if (!lit) throw new NotFoundException('Lit introuvable.');
    if (lit.hospitalisations.length > 0) {
      throw new BadRequestException('Lit occupé : impossible de le désactiver.');
    }
    return this.prisma.lit.update({
      where: { id },
      data: { actif: !lit.actif },
    });
  }

  /** Tous les lits avec occupation (grille temps réel, §13). */
  async listerLits(cliniqueId: number) {
    const lits = await this.prisma.lit.findMany({
      where: { chambre: { cliniqueId } },
      include: {
        chambre: { include: { typeChambre: true } },
        hospitalisations: {
          where: { statut: 'EN_COURS' },
          include: {
            patient: { select: { nom: true, prenom: true, code: true } },
          },
          take: 1,
        },
      },
      orderBy: [{ chambre: { numero: 'asc' } }, { numero: 'asc' }],
    });
    return lits.map((l) => ({
      id: l.id,
      numero: l.numero,
      actif: l.actif,
      chambre: l.chambre,
      label: `${l.chambre.numero}-${l.numero}`,
      occupe: l.hospitalisations.length > 0,
      sejour: l.hospitalisations[0] ?? null,
    }));
  }

  // ─────────── Admissions / séjours ───────────

  /**
   * Recherche des passages au code actif avec une prescription d'hospitalisation
   * (fiche médecin : hospitalisation = true).
   */
  async rechercher(reference: string, cliniqueId: number) {
    const ref = reference.trim().toUpperCase();
    const refSans = ref.replace(/[\s-]/g, '');
    if (!ref) return [];

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
        consultations: { some: { hospitalisation: true } },
      },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
        consultations: { where: { hospitalisation: true }, take: 1 },
        hospitalisation: true,
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
      consultation: p.consultations[0] ?? null,
      sejour: p.hospitalisation,
    }));
  }

  /** Détail d'un passage : patient, prescription, séjour en cours, historique du patient. */
  async detailPassage(passageId: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
        consultations: {
          include: {
            medecin: { select: { personnel: { select: { nom: true, prenom: true } } } },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        hospitalisation: { include: includeSejour },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    const historique = await this.prisma.hospitalisation.findMany({
      where: { patientId: passage.patientId },
      include: {
        lit: { include: { chambre: true } },
        passage: { select: { numeroOrdre: true, createdAt: true } },
      },
      orderBy: { dateEntree: 'desc' },
    });

    return {
      passage: {
        id: passage.id,
        numeroOrdre: passage.numeroOrdre,
        statut: passage.statut,
        typePatient: passage.typePatient,
        createdAt: passage.createdAt,
        patient: passage.patient,
        service: passage.service,
        consultation: passage.consultations[0] ?? null,
        sejour: passage.hospitalisation,
      },
      historique,
    };
  }

  /** Enregistre l'entrée du patient : attribution d'un lit libre (§13). */
  async admettre(passageId: number, dto: AdmissionDto) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: {
        consultations: { orderBy: { createdAt: 'desc' }, take: 1 },
        hospitalisation: true,
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    if (passage.statut !== 'ACTIF') {
      throw new BadRequestException('Code non activé : paiement requis avant admission.');
    }
    if (passage.hospitalisation) {
      throw new BadRequestException('Une hospitalisation existe déjà pour ce passage.');
    }
    const consultation = passage.consultations[0];
    if (!consultation || !consultation.hospitalisation) {
      throw new BadRequestException('Aucune prescription d\'hospitalisation pour ce passage.');
    }

    const lit = await this.prisma.lit.findUnique({
      where: { id: dto.litId },
      include: {
        chambre: true,
        hospitalisations: { where: { statut: 'EN_COURS' } },
      },
    });
    if (!lit || !lit.actif) throw new BadRequestException('Lit introuvable ou désactivé.');
    if (lit.hospitalisations.length > 0) {
      throw new BadRequestException('Ce lit est déjà occupé.');
    }

    // Tarif journalier : celui de la chambre, sinon le tarif HOSP-JOUR.
    // Copié sur le séjour à l'admission (le tarif de la chambre peut changer ensuite).
    let tarif = lit.chambre.tarifJournalier;
    if (!tarif) {
      const prestationHosp = await this.prisma.prestation.findFirst({
        where: {
          cliniqueId: passage.cliniqueId,
          type: 'HOSPITALISATION',
          actif: true,
          service: { code: 'HOS' },
        },
      });
      if (!prestationHosp) {
        throw new BadRequestException(
          'Aucun tarif d\'hospitalisation paramétré (ni sur la chambre, ni en prestation).',
        );
      }
      tarif = prestationHosp.montant;
    }

    return this.prisma.hospitalisation.create({
      data: {
        passageId,
        cliniqueId: passage.cliniqueId,
        patientId: passage.patientId,
        litId: lit.id,
        dateEntree: dto.dateEntree ? new Date(dto.dateEntree) : new Date(),
        dureePrevue: consultation.hospitalisationDuree ?? null,
        motif: dto.motif ?? consultation.motif ?? null,
        statut: 'EN_COURS',
        montantJournalier: tarif,
      },
      include: includeSejour,
    });
  }

  /** Suivi du séjour : observations. */
  async suivi(sejourId: number, dto: SuiviDto) {
    const sejour = await this.prisma.hospitalisation.findUnique({ where: { id: sejourId } });
    if (!sejour) throw new NotFoundException('Séjour introuvable.');
    return this.prisma.hospitalisation.update({
      where: { id: sejourId },
      data: { observations: dto.observations ?? null },
      include: includeSejour,
    });
  }

  /**
   * Sortie du patient : calcule la facture (tarif journalier × jours réels)
   * et crée la ligne payable à la caisse (§6.2).
   */
  async sortie(sejourId: number, dto: SortieDto, utilisateurId: number) {
    const sejour = await this.prisma.hospitalisation.findUnique({
      where: { id: sejourId },
      include: { passage: true },
    });
    if (!sejour) throw new NotFoundException('Séjour introuvable.');
    if (sejour.statut !== 'EN_COURS') {
      throw new BadRequestException('Séjour introuvable ou déjà terminé.');
    }

    const dateSortie = dto.dateSortie ? new Date(dto.dateSortie) : new Date();
    if (dateSortie < sejour.dateEntree) {
      throw new BadRequestException('La date de sortie est antérieure à l\'entrée.');
    }

    // Tarif journalier copié à l'admission (chambre ou prestation HOSP-JOUR)
    if (!sejour.montantJournalier) {
      throw new BadRequestException('Aucun tarif d\'hospitalisation paramétré.');
    }

    const dureeMs = dateSortie.getTime() - sejour.dateEntree.getTime();
    const nbJours = Math.max(1, Math.ceil(dureeMs / (24 * 3600 * 1000)));

    const serviceHos = await this.prisma.service.findFirst({
      where: { cliniqueId: sejour.cliniqueId, code: 'HOS' },
    });

    const ligne = await this.prisma.passagePrestation.create({
      data: {
        passageId: sejour.passageId,
        libelle: `Hospitalisation — ${nbJours} jour(s)`,
        montant: sejour.montantJournalier.mul(nbJours),
        serviceId: serviceHos?.id ?? null,
        source: 'PRESCRIPTION',
        statut: 'EN_ATTENTE',
      },
    });

    return this.prisma.hospitalisation.update({
      where: { id: sejourId },
      data: {
        statut: 'SORTI',
        dateSortie,
        sortieMotif: dto.sortieMotif,
        sortieParId: utilisateurId,
        nbJoursFactures: nbJours,
        passagePrestationId: ligne.id,
      },
      include: includeSejour,
    });
  }

  /** Historique des séjours, paginé (défaut : jour courant par date d'entrée). */
  async historique(params: {
    jour?: string;
    recherche?: string;
    statut?: string;
    page: number;
    perPage: number;
    cliniqueId: number;
  }) {
    const { jour, recherche, statut, page, perPage, cliniqueId } = params;
    const jourRef =
      jour && /^\d{4}-\d{2}-\d{2}$/.test(jour) ? jour : new Date().toISOString().slice(0, 10);
    const debut = new Date(`${jourRef}T00:00:00`);
    const fin = new Date(`${jourRef}T23:59:59.999`);

    const where: Prisma.HospitalisationWhereInput = {
      cliniqueId,
      dateEntree: { gte: debut, lte: fin },
    };
    if (statut === 'EN_COURS' || statut === 'SORTI') where.statut = statut;
    const ref = recherche?.trim().toUpperCase();
    if (ref) {
      where.OR = [
        { passage: { numeroOrdre: { contains: ref } } },
        { patient: { nom: { contains: ref } } },
        { patient: { prenom: { contains: ref } } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.hospitalisation.findMany({
        where,
        include: includeSejour,
        orderBy: { dateEntree: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.hospitalisation.count({ where }),
    ]);

    return {
      data: data.map((s) => ({
        ...s,
        montantJournalier: s.montantJournalier ? N(s.montantJournalier) : null,
      })),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }
}
