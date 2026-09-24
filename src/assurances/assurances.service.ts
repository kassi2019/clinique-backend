import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const N = (x: any) => Number(x);

@Injectable()
export class AssurancesService {
  constructor(private prisma: PrismaService) {}

  // ─────────── Assurances ───────────

  async listerAssurances(cliniqueId: number) {
    return this.prisma.assurance.findMany({
      where: { cliniqueId },
      include: {
        formules: {
          include: {
            couvertures: {
              include: { prestation: { select: { id: true, libelle: true, code: true, montant: true } } },
            },
          },
          orderBy: { libelle: 'asc' },
        },
      },
      orderBy: { libelle: 'asc' },
    });
  }

  async creerAssurance(cliniqueId: number, dto: any) {
    return this.prisma.assurance.create({
      data: {
        cliniqueId,
        code: dto.code.trim().toUpperCase(),
        libelle: dto.libelle.trim(),
        telephone: dto.telephone ?? null,
        email: dto.email ?? null,
        adresse: dto.adresse ?? null,
        numeroAgrement: dto.numeroAgrement ?? null,
      },
    });
  }

  /** Import Excel : ajoute les assurances manquantes (clé = code par clinique). */
  async importerAssurances(
    cliniqueId: number,
    lignes: { code: string; libelle: string; telephone?: string; email?: string; adresse?: string; numeroAgrement?: string }[],
  ) {
    let ajoutes = 0;
    for (const l of lignes) {
      const code = String(l.code ?? '').trim().toUpperCase();
      const libelle = String(l.libelle ?? '').trim();
      if (!code || !libelle) continue;
      const existe = await this.prisma.assurance.findUnique({
        where: { cliniqueId_code: { cliniqueId, code } },
      });
      if (existe) continue;
      await this.prisma.assurance.create({
        data: {
          cliniqueId,
          code,
          libelle,
          telephone: l.telephone ?? null,
          email: l.email ?? null,
          adresse: l.adresse ?? null,
          numeroAgrement: l.numeroAgrement ?? null,
        },
      });
      ajoutes++;
    }
    return { ajoutes, total: lignes.length };
  }

  async modifierAssurance(id: number, dto: any) {
    const a = await this.prisma.assurance.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Assurance introuvable.');
    return this.prisma.assurance.update({
      where: { id },
      data: {
        code: dto.code?.trim().toUpperCase(),
        libelle: dto.libelle?.trim(),
        telephone: dto.telephone ?? null,
        email: dto.email ?? null,
        adresse: dto.adresse ?? null,
        numeroAgrement: dto.numeroAgrement ?? null,
      },
    });
  }

  async desactiverAssurance(id: number) {
    const a = await this.prisma.assurance.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Assurance introuvable.');
    return this.prisma.assurance.update({
      where: { id },
      data: { statut: a.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF' },
    });
  }

  // ─────────── Formules ───────────

  async creerFormule(assuranceId: number, dto: any) {
    const a = await this.prisma.assurance.findUnique({ where: { id: assuranceId } });
    if (!a) throw new NotFoundException('Assurance introuvable.');
    return this.prisma.formuleAssurance.create({
      data: {
        assuranceId,
        code: dto.code.trim().toUpperCase(),
        libelle: dto.libelle.trim(),
        description: dto.description ?? null,
        dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
        dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
      },
    });
  }

  async modifierFormule(id: number, dto: any) {
    const f = await this.prisma.formuleAssurance.findUnique({ where: { id } });
    if (!f) throw new NotFoundException('Formule introuvable.');
    return this.prisma.formuleAssurance.update({
      where: { id },
      data: {
        code: dto.code?.trim().toUpperCase(),
        libelle: dto.libelle?.trim(),
        description: dto.description ?? null,
        dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
        dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
      },
    });
  }

  async desactiverFormule(id: number) {
    const f = await this.prisma.formuleAssurance.findUnique({ where: { id } });
    if (!f) throw new NotFoundException('Formule introuvable.');
    return this.prisma.formuleAssurance.update({
      where: { id },
      data: { statut: f.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF' },
    });
  }

  // ─────────── Couvertures (formule × prestation) ───────────

  async creerCouverture(formuleId: number, dto: any) {
    const f = await this.prisma.formuleAssurance.findUnique({ where: { id: formuleId } });
    if (!f) throw new NotFoundException('Formule introuvable.');
    if (dto.tauxCouverture == null || dto.tauxCouverture < 0 || dto.tauxCouverture > 100) {
      throw new BadRequestException('Le taux de couverture doit être entre 0 et 100.');
    }
    try {
      return await this.prisma.couverturePrestation.create({
        data: {
          formuleId,
          prestationId: dto.prestationId,
          tauxCouverture: dto.tauxCouverture,
          plafond: dto.plafond ?? null,
          dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
          dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Une couverture existe déjà pour cette prestation et cette formule.');
      }
      throw e;
    }
  }

  async modifierCouverture(id: number, dto: any) {
    const c = await this.prisma.couverturePrestation.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Couverture introuvable.');
    if (dto.tauxCouverture != null && (dto.tauxCouverture < 0 || dto.tauxCouverture > 100)) {
      throw new BadRequestException('Le taux de couverture doit être entre 0 et 100.');
    }
    return this.prisma.couverturePrestation.update({
      where: { id },
      data: {
        tauxCouverture: dto.tauxCouverture,
        plafond: dto.plafond ?? null,
        dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
        dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
      },
    });
  }

  async desactiverCouverture(id: number) {
    const c = await this.prisma.couverturePrestation.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Couverture introuvable.');
    return this.prisma.couverturePrestation.update({
      where: { id },
      data: { statut: c.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF' },
    });
  }

  // ─────────── Rattachement patient → assurance ───────────

  async assurancesDuPatient(patientId: number) {
    return this.prisma.patientAssurance.findMany({
      where: { patientId },
      include: {
        assurance: { select: { id: true, code: true, libelle: true } },
        formule: { select: { id: true, code: true, libelle: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Rattachement ACTIF du patient (période valide) : le plus récent. */
  async couvertureActiveDuPatient(patientId: number) {
    const aujourdHui = new Date();
    const actifs = await this.prisma.patientAssurance.findMany({
      where: {
        patientId,
        statut: 'ACTIF',
        OR: [
          { dateDebut: null },
          { dateDebut: { lte: aujourdHui } },
        ],
      },
      include: {
        assurance: true,
        formule: { include: { couvertures: { include: { prestation: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return (
      actifs.find(
        (a) => !a.dateFin || new Date(a.dateFin) >= aujourdHui,
      ) ?? null
    );
  }

  async ajouterPatientAssurance(patientId: number, dto: any) {
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundException('Patient introuvable.');
    return this.prisma.patientAssurance.create({
      data: {
        patientId,
        assuranceId: dto.assuranceId,
        formuleId: dto.formuleId,
        numeroAssure: dto.numeroAssure ?? null,
        numeroCarte: dto.numeroCarte ?? null,
        nomAssurePrincipal: dto.nomAssurePrincipal ?? null,
        typeBeneficiaire: dto.typeBeneficiaire ?? null,
        dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
        dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
      },
    });
  }

  async desactiverPatientAssurance(id: number) {
    const a = await this.prisma.patientAssurance.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Rattachement introuvable.');
    return this.prisma.patientAssurance.update({
      where: { id },
      data: { statut: a.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF' },
    });
  }

  // ─────────── Résolution du taux à la caisse ───────────

  // ─────────── Facturation des assurances (prises en charge) ───────────

  /** Liste des prises en charge (défaut : aujourd'hui) + totaux par assurance. */
  async facturation(
    cliniqueId: number,
    opts: { debut?: string; fin?: string; assuranceId?: number; page?: number; perPage?: number },
  ) {
    const debut = opts.debut
      ? new Date(`${opts.debut}T00:00:00`)
      : new Date(new Date().setHours(0, 0, 0, 0));
    const fin = opts.fin
      ? new Date(`${opts.fin}T23:59:59.999`)
      : new Date(new Date().setHours(23, 59, 59, 999));
    const page = opts.page ?? 1;
    const perPage = opts.perPage ?? 20;

    const where: any = {
      assuranceId: { not: null },
      createdAt: { gte: debut, lte: fin },
    };
    if (opts.assuranceId) where.assuranceId = opts.assuranceId;

    const [lignes, total, toutes] = await this.prisma.$transaction([
      this.prisma.priseEnCharge.findMany({
        where: {
          ...where,
          paiement: { cliniqueId, statut: 'VALIDE' },
        },
        include: {
          paiement: {
            select: {
              numeroRecu: true,
              createdAt: true,
              passage: {
                select: {
                  numeroOrdre: true,
                  patient: { select: { nom: true, prenom: true, code: true } },
                },
              },
            },
          },
          assurance: { select: { id: true, code: true, libelle: true } },
          formule: { select: { id: true, code: true, libelle: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.priseEnCharge.count({
        where: { ...where, paiement: { cliniqueId, statut: 'VALIDE' } },
      }),
      this.prisma.priseEnCharge.findMany({
        where: { ...where, paiement: { cliniqueId, statut: 'VALIDE' } },
        select: {
          montantAssurance: true,
          montantPatient: true,
          montantTotal: true,
          assurance: { select: { id: true, libelle: true, code: true } },
        },
      }),
    ]);

    const parAssuranceMap = new Map<number, { assurance: string; totalAssurance: number; totalPatient: number; totalFacture: number; nbLignes: number }>();
    for (const l of toutes) {
      const key = l.assurance?.id ?? 0;
      const e = parAssuranceMap.get(key) ?? {
        assurance: l.assurance ? `${l.assurance.code} — ${l.assurance.libelle}` : '—',
        totalAssurance: 0,
        totalPatient: 0,
        totalFacture: 0,
        nbLignes: 0,
      };
      e.totalAssurance += N(l.montantAssurance);
      e.totalPatient += N(l.montantPatient);
      e.totalFacture += N(l.montantTotal);
      e.nbLignes += 1;
      parAssuranceMap.set(key, e);
    }

    return {
      periode: {
        debut: debut.toISOString().slice(0, 10),
        fin: fin.toISOString().slice(0, 10),
      },
      lignes: lignes.map((l) => ({
        id: l.id,
        createdAt: l.createdAt,
        numeroRecu: l.paiement.numeroRecu,
        patient: l.paiement.passage.patient,
        numeroOrdre: l.paiement.passage.numeroOrdre,
        assurance: l.assurance,
        formule: l.formule,
        tauxParametre: l.tauxParametre,
        tauxApplique: l.tauxApplique,
        montantTotal: N(l.montantTotal),
        montantAssurance: N(l.montantAssurance),
        montantPatient: N(l.montantPatient),
        motifModification: l.motifModification,
      })),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      parAssurance: [...parAssuranceMap.values()],
    };
  }

  /**
   * Taux applicable : Patient + Assurance + Formule + Prestation + période.
   * Renvoie null si le patient n'a pas de couverture active pour cette prestation.
   */
  async tauxApplicable(patientId: number, prestationId: number) {
    const rattachement = await this.couvertureActiveDuPatient(patientId);
    if (!rattachement) return null;

    const aujourdHui = new Date();
    const couverture = rattachement.formule.couvertures.find(
      (c) =>
        c.prestationId === prestationId &&
        c.statut === 'ACTIF' &&
        (!c.dateDebut || new Date(c.dateDebut) <= aujourdHui) &&
        (!c.dateFin || new Date(c.dateFin) >= aujourdHui),
    );
    if (!couverture) return null;

    return {
      assurance: { id: rattachement.assurance.id, code: rattachement.assurance.code, libelle: rattachement.assurance.libelle },
      formule: { id: rattachement.formule.id, code: rattachement.formule.code, libelle: rattachement.formule.libelle },
      numeroAssure: rattachement.numeroAssure,
      taux: couverture.tauxCouverture,
      plafond: couverture.plafond ? N(couverture.plafond) : null,
    };
  }
}
