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
        tauxPharmacie: this.tauxValide(dto.tauxPharmacie),
        dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
        dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
      },
    });
  }

  /** Taux 0-100 (null si vide). */
  private tauxValide(v: any): number | null {
    if (v === undefined || v === null || v === '') return null;
    const n = Math.round(Number(v));
    if (isNaN(n) || n < 0 || n > 100) {
      throw new BadRequestException('Le taux doit être compris entre 0 et 100 %.');
    }
    return n;
  }

  /** Taux de couverture des médicaments (pharmacie) d'une formule. */
  async definirTauxPharmacie(id: number, taux: any) {
    const f = await this.prisma.formuleAssurance.findUnique({ where: { id } });
    if (!f) throw new NotFoundException('Formule introuvable.');
    return this.prisma.formuleAssurance.update({
      where: { id },
      data: { tauxPharmacie: this.tauxValide(taux) },
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
  /**
   * Parts assurance facturées sur une période : prises en charge de la caisse
   * (prestations) + médicaments délivrés à la pharmacie. Sans dates : tout l'historique.
   */
  private async lignesAssurance(
    cliniqueId: number,
    opts: { debut?: Date; fin?: Date; assuranceId?: number; patientId?: number },
  ) {
    const periode = opts.debut || opts.fin ? { createdAt: { gte: opts.debut, lte: opts.fin } } : {};
    const filtreAssurance = opts.assuranceId ? opts.assuranceId : { not: null };
    const [caisse, pharmacie] = await Promise.all([
      this.prisma.priseEnCharge.findMany({
        where: {
          assuranceId: filtreAssurance,
          ...periode,
          paiement: {
            cliniqueId,
            statut: 'VALIDE',
            ...(opts.patientId ? { passage: { patientId: opts.patientId } } : {}),
          },
        },
        include: {
          paiement: {
            select: {
              numeroRecu: true,
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
      }),
      this.prisma.pharmaciePaiement.findMany({
        where: {
          statut: 'VALIDE',
          montantAssurance: { gt: 0 },
          assuranceId: filtreAssurance,
          ...periode,
          dispensation: {
            consultation: {
              passage: { cliniqueId },
              ...(opts.patientId ? { patientId: opts.patientId } : {}),
            },
          },
        },
        include: {
          dispensation: {
            select: {
              consultation: {
                select: {
                  patient: { select: { nom: true, prenom: true, code: true } },
                  passage: { select: { numeroOrdre: true } },
                },
              },
            },
          },
          assurance: { select: { id: true, code: true, libelle: true } },
          formule: { select: { id: true, code: true, libelle: true } },
        },
      }),
    ]);
    return [
      ...caisse.map((l) => ({
        id: `C${l.id}`,
        source: 'CAISSE',
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
      ...pharmacie.map((l) => ({
        id: `P${l.id}`,
        source: 'PHARMACIE',
        createdAt: l.createdAt,
        numeroRecu: l.numeroRecu,
        patient: l.dispensation.consultation.patient,
        numeroOrdre: l.dispensation.consultation.passage.numeroOrdre,
        assurance: l.assurance,
        formule: l.formule,
        tauxParametre: l.tauxAssurance ?? 0,
        tauxApplique: l.tauxAssurance ?? 0,
        montantTotal: N(l.montantTotal),
        montantAssurance: N(l.montantAssurance),
        montantPatient: N(l.montantTotal) - N(l.montantAssurance),
        motifModification: null as string | null,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /** Facturation des assurances : prises en charge (caisse + pharmacie) + totaux par assurance. */
  async facturation(
    cliniqueId: number,
    opts: { debut?: string; fin?: string; assuranceId?: number; patientId?: number; page?: number; perPage?: number },
  ) {
    const debut = opts.debut
      ? new Date(`${opts.debut}T00:00:00`)
      : new Date(new Date().setHours(0, 0, 0, 0));
    const fin = opts.fin
      ? new Date(`${opts.fin}T23:59:59.999`)
      : new Date(new Date().setHours(23, 59, 59, 999));
    const page = opts.page ?? 1;
    // perPage = 0 : toutes les lignes (impression / export Excel)
    const perPage = opts.perPage ?? 20;
    const tout = perPage === 0;

    const toutes = await this.lignesAssurance(cliniqueId, {
      debut,
      fin,
      assuranceId: opts.assuranceId,
      patientId: opts.patientId,
    });

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
      e.totalAssurance += l.montantAssurance;
      e.totalPatient += l.montantPatient;
      e.totalFacture += l.montantTotal;
      e.nbLignes += 1;
      parAssuranceMap.set(key, e);
    }

    return {
      periode: {
        debut: debut.toISOString().slice(0, 10),
        fin: fin.toISOString().slice(0, 10),
      },
      lignes: tout ? toutes : toutes.slice((page - 1) * perPage, page * perPage),
      total: toutes.length,
      page,
      perPage,
      totalPages: tout ? 1 : Math.ceil(toutes.length / perPage),
      parAssurance: [...parAssuranceMap.values()],
    };
  }

  // ─────────── Recouvrement ───────────

  /**
   * Suivi du recouvrement : pour chaque assurance, total facturé (caisse +
   * pharmacie, tout l'historique), total des règlements reçus et reste à recouvrer.
   */
  async recouvrement(cliniqueId: number) {
    const [assurances, lignes, reglements] = await Promise.all([
      this.prisma.assurance.findMany({ where: { cliniqueId }, orderBy: { libelle: 'asc' } }),
      this.lignesAssurance(cliniqueId, {}),
      this.prisma.reglementAssurance.findMany({
        where: { cliniqueId },
        include: { assurance: { select: { id: true, code: true, libelle: true } } },
        orderBy: [{ dateReglement: 'desc' }, { id: 'desc' }],
      }),
    ]);
    const parAssurance = assurances
      .map((a) => {
        const facture = lignes
          .filter((l) => l.assurance?.id === a.id)
          .reduce((s, l) => s + l.montantAssurance, 0);
        const recu = reglements
          .filter((r) => r.assuranceId === a.id)
          .reduce((s, r) => s + N(r.montant), 0);
        return {
          assuranceId: a.id,
          assurance: a.libelle,
          code: a.code,
          nbFactures: lignes.filter((l) => l.assurance?.id === a.id).length,
          facture,
          recu,
          reste: facture - recu,
        };
      })
      .filter((a) => a.facture !== 0 || a.recu !== 0);
    return {
      parAssurance,
      totaux: {
        facture: parAssurance.reduce((s, a) => s + a.facture, 0),
        recu: parAssurance.reduce((s, a) => s + a.recu, 0),
        reste: parAssurance.reduce((s, a) => s + a.reste, 0),
      },
      reglements: reglements.map((r) => ({ ...r, montant: N(r.montant) })),
    };
  }

  /** Enregistre un règlement reçu d'une assurance. */
  async creerReglement(dto: any, utilisateurId: number) {
    const assurance = await this.prisma.assurance.findUnique({ where: { id: Number(dto.assuranceId) } });
    if (!assurance) throw new NotFoundException('Assurance introuvable.');
    const montant = Number(dto.montant);
    if (!montant || montant <= 0) throw new BadRequestException('Le montant du règlement doit être supérieur à 0.');
    if (!dto.dateReglement) throw new BadRequestException('La date du règlement est obligatoire.');
    const reglement = await this.prisma.reglementAssurance.create({
      data: {
        cliniqueId: assurance.cliniqueId,
        assuranceId: assurance.id,
        dateReglement: new Date(`${dto.dateReglement}T00:00:00`),
        montant,
        modeReglement: dto.modeReglement || null,
        reference: dto.reference?.trim() || null,
        commentaire: dto.commentaire?.trim() || null,
        utilisateurId,
      },
    });
    return { ...reglement, montant: N(reglement.montant) };
  }

  /** Supprime un règlement saisi par erreur. */
  async supprimerReglement(id: number) {
    const r = await this.prisma.reglementAssurance.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Règlement introuvable.');
    await this.prisma.reglementAssurance.delete({ where: { id } });
    return { ok: true };
  }

  /** Liste des patients assurés de la clinique (filtre par compagnie et recherche). */
  async assures(cliniqueId: number, opts: { assuranceId?: number; search?: string } = {}) {
    const mots = (opts.search ?? '').trim().split(/\s+/).filter(Boolean);
    const rattachements = await this.prisma.patientAssurance.findMany({
      where: {
        statut: 'ACTIF',
        ...(opts.assuranceId ? { assuranceId: opts.assuranceId } : {}),
        patient: {
          cliniqueId,
          ...(mots.length
            ? {
                AND: mots.map((m) => ({
                  OR: [
                    { nom: { contains: m } },
                    { prenom: { contains: m } },
                    { code: { contains: m } },
                  ],
                })),
              }
            : {}),
        },
      },
      include: {
        patient: {
          select: { id: true, nom: true, prenom: true, code: true, sexe: true, age: true, telephone: true },
        },
        assurance: { select: { id: true, code: true, libelle: true } },
        formule: { select: { id: true, code: true, libelle: true } },
      },
      orderBy: [{ assurance: { libelle: 'asc' } }, { patient: { nom: 'asc' } }],
    });
    const parAssuranceMap = new Map<number, { assurance: string; nbAssures: number }>();
    for (const r of rattachements) {
      const e = parAssuranceMap.get(r.assuranceId) ?? { assurance: r.assurance.libelle, nbAssures: 0 };
      e.nbAssures += 1;
      parAssuranceMap.set(r.assuranceId, e);
    }
    return { assures: rattachements, total: rattachements.length, parAssurance: [...parAssuranceMap.values()] };
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
