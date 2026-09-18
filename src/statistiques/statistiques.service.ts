import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const N = (x: any) => Number(x);

@Injectable()
export class StatistiquesService {
  constructor(private prisma: PrismaService) {}

  /** Bornes de la période : défaut aujourd'hui (début = fin). */
  private bornes(debut?: string, fin?: string) {
    const aujourdHui = new Date().toISOString().slice(0, 10);
    const d = debut && /^\d{4}-\d{2}-\d{2}$/.test(debut) ? debut : aujourdHui;
    const f = fin && /^\d{4}-\d{2}-\d{2}$/.test(fin) ? fin : d;
    const fmt = (s: string) =>
      new Date(`${s}T00:00:00`).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    return {
      debut: new Date(`${d}T00:00:00`),
      fin: new Date(`${f}T23:59:59.999`),
      libelle: d === f ? fmt(d) : `${fmt(d)} au ${fmt(f)}`,
    };
  }

  /** Regroupe des enregistrements datés par jour (clé JJ/MM/AAAA). */
  private parJour<T>(lignes: T[], getDate: (l: T) => Date | null) {
    const map = new Map<string, number>();
    for (const l of lignes) {
      const d = getDate(l);
      if (!d) continue;
      const cle = new Date(d).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      map.set(cle, (map.get(cle) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([jour, nombre]) => ({ jour, nombre }))
      .sort((a, b) => a.jour.localeCompare(b.jour));
  }

  // ─────────── Tableau de bord (jour) ───────────
  async tableauBord(cliniqueId: number, jour?: string) {
    const { debut, fin, libelle } = this.bornes(jour);

    const [
      passages,
      consultations,
      externes,
      paiements,
      examensLabo,
      examensImagerie,
      hospitalisations,
      lits,
    ] = await Promise.all([
      this.prisma.passage.count({
        where: { cliniqueId, createdAt: { gte: debut, lte: fin } },
      }),
      this.prisma.consultation.count({
        where: { passage: { cliniqueId }, createdAt: { gte: debut, lte: fin } },
      }),
      this.prisma.passage.count({
        where: { cliniqueId, typePatient: 'EXTERNE', createdAt: { gte: debut, lte: fin } },
      }),
      this.prisma.paiement.findMany({
        where: { cliniqueId, statut: 'VALIDE', createdAt: { gte: debut, lte: fin } },
        select: { montantTotal: true },
      }),
      this.prisma.examenLabo.count({
        where: { cliniqueId, preleveLe: { gte: debut, lte: fin } },
      }),
      this.prisma.examenImagerie.count({
        where: { cliniqueId, createdAt: { gte: debut, lte: fin } },
      }),
      this.prisma.hospitalisation.count({
        where: { cliniqueId, statut: 'EN_COURS' },
      }),
      this.prisma.lit.findMany({
        where: { chambre: { cliniqueId }, actif: true },
        include: {
          hospitalisations: { where: { statut: 'EN_COURS' }, select: { id: true } },
        },
      }),
    ]);

    return {
      periode: libelle,
      passages,
      consultations,
      externes,
      paiements: {
        nombre: paiements.length,
        montant: paiements.reduce((s, p) => s + N(p.montantTotal), 0),
      },
      examensLabo,
      examensImagerie,
      hospitalisationsEnCours: hospitalisations,
      lits: {
        total: lits.length,
        occupes: lits.filter((l) => l.hospitalisations.length > 0).length,
      },
    };
  }

  // ─────────── Fréquentation & activité ───────────
  async frequentation(
    cliniqueId: number,
    debut?: string,
    fin?: string,
    page = 1,
    perPage = 20,
  ) {
    const { debut: d, fin: f, libelle } = this.bornes(debut, fin);

    const passages = await this.prisma.passage.findMany({
      where: { cliniqueId, createdAt: { gte: d, lte: f } },
      include: {
        patient: { select: { nom: true, prenom: true, code: true, sexe: true, age: true } },
        service: { select: { nom: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const consultations = await this.prisma.consultation.count({
      where: { passage: { cliniqueId }, createdAt: { gte: d, lte: f } },
    });

    // Par service (passages)
    const parServiceMap = new Map<string, number>();
    for (const p of passages) {
      const nom = p.service?.nom ?? '—';
      parServiceMap.set(nom, (parServiceMap.get(nom) ?? 0) + 1);
    }
    const parService = [...parServiceMap.entries()]
      .map(([service, nombre]) => ({ service, nombre }))
      .sort((a, b) => b.nombre - a.nombre);

    // Parcours des patients (paginé)
    const total = passages.length;
    const parcours = passages
      .slice((page - 1) * perPage, page * perPage)
      .map((p) => ({
        id: p.id,
        numeroOrdre: p.numeroOrdre,
        patient: p.patient,
        service: p.service?.nom ?? '—',
        typePatient: p.typePatient,
        statut: p.statut,
        createdAt: p.createdAt,
      }));

    return {
      periode: libelle,
      passages: total,
      internes: passages.filter((p) => p.typePatient !== 'EXTERNE').length,
      externes: passages.filter((p) => p.typePatient === 'EXTERNE').length,
      consultations,
      parJour: this.parJour(passages, (p) => p.createdAt),
      parService,
      parcours: { data: parcours, total, page, perPage, totalPages: Math.ceil(total / perPage) },
    };
  }

  // ─────────── Recettes ───────────
  async recettes(cliniqueId: number, debut?: string, fin?: string) {
    const { debut: d, fin: f, libelle } = this.bornes(debut, fin);

    const paiements = await this.prisma.paiement.findMany({
      where: { cliniqueId, statut: 'VALIDE', createdAt: { gte: d, lte: f } },
      select: { montantTotal: true, modePaiement: true, createdAt: true },
    });
    const lignes = await this.prisma.passagePrestation.findMany({
      where: {
        passage: { cliniqueId },
        statut: 'PAYEE',
        updatedAt: { gte: d, lte: f },
      },
      include: {
        service: { select: { nom: true } },
        prestation: { select: { type: true } },
      },
    });

    const total = paiements.reduce((s, p) => s + N(p.montantTotal), 0);
    const parJour = this.parJour(paiements, (p) => p.createdAt);

    const parModeMap = new Map<string, { nombre: number; montant: number }>();
    for (const p of paiements) {
      const e = parModeMap.get(p.modePaiement) ?? { nombre: 0, montant: 0 };
      e.nombre += 1;
      e.montant += N(p.montantTotal);
      parModeMap.set(p.modePaiement, e);
    }
    const parMode = [...parModeMap.entries()].map(([mode, v]) => ({ mode, ...v }));

    const parServiceMap = new Map<string, number>();
    for (const l of lignes) {
      const nom = l.service?.nom ?? '—';
      parServiceMap.set(nom, (parServiceMap.get(nom) ?? 0) + N(l.montant));
    }
    const parService = [...parServiceMap.entries()]
      .map(([service, montant]) => ({ service, montant }))
      .sort((a, b) => b.montant - a.montant);

    const LIBELLES_TYPES: Record<string, string> = {
      CONSULTATION: 'Consultation',
      EXAMEN_LABO: 'Examen de laboratoire',
      IMAGERIE: 'Imagerie',
      SOIN: 'Soin',
      MATERNITE: 'Maternité',
      HOSPITALISATION: 'Hospitalisation',
      MEDICAMENT: 'Médicament',
      AUTRE: 'Autre',
    };
    const parTypeMap = new Map<string, number>();
    for (const l of lignes) {
      const type = l.prestation?.type ?? 'AUTRE';
      parTypeMap.set(type, (parTypeMap.get(type) ?? 0) + N(l.montant));
    }
    const parType = [...parTypeMap.entries()]
      .map(([type, montant]) => ({ type: LIBELLES_TYPES[type] ?? type, montant }))
      .sort((a, b) => b.montant - a.montant);

    return {
      periode: libelle,
      nombre: paiements.length,
      total,
      parJour,
      parMode,
      parService,
      parType,
    };
  }

  // ─────────── Laboratoire ───────────
  async laboratoire(cliniqueId: number, debut?: string, fin?: string) {
    const { debut: d, fin: f, libelle } = this.bornes(debut, fin);
    const examens = await this.prisma.examenLabo.findMany({
      where: { cliniqueId, preleveLe: { gte: d, lte: f } },
      select: { libelle: true, statut: true, preleveLe: true },
    });

    const parLibelleMap = new Map<string, number>();
    const parStatutMap = new Map<string, number>();
    for (const e of examens) {
      parLibelleMap.set(e.libelle, (parLibelleMap.get(e.libelle) ?? 0) + 1);
      parStatutMap.set(e.statut, (parStatutMap.get(e.statut) ?? 0) + 1);
    }
    const LIBELLES_STATUTS: Record<string, string> = {
      PRELEVE: 'Prélèvement fait',
      RESULTATS: 'Résultats saisis',
      VALIDE: 'Validé',
    };
    return {
      periode: libelle,
      total: examens.length,
      parJour: this.parJour(examens, (e) => e.preleveLe),
      parLibelle: [...parLibelleMap.entries()]
        .map(([libelle, nombre]) => ({ libelle, nombre }))
        .sort((a, b) => b.nombre - a.nombre),
      parStatut: [...parStatutMap.entries()].map(([statut, nombre]) => ({
        statut: LIBELLES_STATUTS[statut] ?? statut,
        nombre,
      })),
    };
  }

  // ─────────── Imagerie ───────────
  async imagerie(cliniqueId: number, debut?: string, fin?: string) {
    const { debut: d, fin: f, libelle } = this.bornes(debut, fin);
    const examens = await this.prisma.examenImagerie.findMany({
      where: { cliniqueId, createdAt: { gte: d, lte: f } },
      select: { libelle: true, statut: true, createdAt: true },
    });

    const parLibelleMap = new Map<string, number>();
    const parStatutMap = new Map<string, number>();
    for (const e of examens) {
      parLibelleMap.set(e.libelle, (parLibelleMap.get(e.libelle) ?? 0) + 1);
      parStatutMap.set(e.statut, (parStatutMap.get(e.statut) ?? 0) + 1);
    }
    return {
      periode: libelle,
      total: examens.length,
      parJour: this.parJour(examens, (e) => e.createdAt),
      parLibelle: [...parLibelleMap.entries()]
        .map(([libelle, nombre]) => ({ libelle, nombre }))
        .sort((a, b) => b.nombre - a.nombre),
      parStatut: [...parStatutMap.entries()].map(([statut, nombre]) => ({
        statut: statut === 'RESULTATS' ? 'Résultats saisis' : statut === 'VALIDE' ? 'Validé' : statut,
        nombre,
      })),
    };
  }

  // ─────────── Hospitalisation ───────────
  async hospitalisation(cliniqueId: number, debut?: string, fin?: string) {
    const { debut: d, fin: f, libelle } = this.bornes(debut, fin);
    const sejours = await this.prisma.hospitalisation.findMany({
      where: {
        cliniqueId,
        OR: [{ dateEntree: { gte: d, lte: f } }, { dateSortie: { gte: d, lte: f } }],
      },
      select: {
        dateEntree: true,
        dateSortie: true,
        statut: true,
        nbJoursFactures: true,
        montantJournalier: true,
      },
    });

    const entrees = sejours.filter((s) => s.dateEntree >= d && s.dateEntree <= f);
    const sorties = sejours.filter((s) => s.dateSortie && s.dateSortie >= d && s.dateSortie <= f);
    const joursFactures = sejours.reduce((s, x) => s + (x.nbJoursFactures ?? 0), 0);
    const montantFacture = sejours.reduce(
      (s, x) => s + (x.nbJoursFactures ?? 0) * N(x.montantJournalier ?? 0),
      0,
    );

    return {
      periode: libelle,
      entrees: entrees.length,
      sorties: sorties.length,
      enCours: sejours.filter((s) => s.statut === 'EN_COURS').length,
      joursFactures,
      montantFacture,
      parJour: this.parJour(entrees, (s) => s.dateEntree),
    };
  }

  // ─────────── Pharmacie ───────────
  async pharmacie(cliniqueId: number, debut?: string, fin?: string) {
    const { debut: d, fin: f, libelle } = this.bornes(debut, fin);

    const lignes = await this.prisma.ligneDispensation.findMany({
      where: {
        dispensation: {
          consultation: { passage: { cliniqueId } },
          createdAt: { gte: d, lte: f },
        },
      },
      select: { medicamentNom: true, quantiteDelivree: true, montant: true },
    });

    const totalVentes = lignes.reduce((s, l) => s + N(l.montant), 0);
    const quantites = lignes.reduce((s, l) => s + l.quantiteDelivree, 0);

    const topMap = new Map<string, { montant: number; quantite: number }>();
    for (const l of lignes) {
      const e = topMap.get(l.medicamentNom) ?? { montant: 0, quantite: 0 };
      e.montant += N(l.montant);
      e.quantite += l.quantiteDelivree;
      topMap.set(l.medicamentNom, e);
    }
    const topMedicaments = [...topMap.entries()]
      .map(([medicament, v]) => ({ medicament, ...v }))
      .sort((a, b) => b.montant - a.montant);

    // Stocks faibles : stock ≤ seuil d'alerte
    const medicaments = await this.prisma.medicament.findMany({
      where: { cliniqueId, actif: true },
      select: { nom: true, stock: true, seuilAlerte: true },
    });
    const stocksFaibles = medicaments
      .filter((m) => m.stock <= m.seuilAlerte)
      .map((m) => ({ medicament: m.nom, stock: m.stock, seuilAlerte: m.seuilAlerte }));

    // Péremptions proches : ≤ 30 jours, stock restant > 0
    const limite = new Date(Date.now() + 30 * 24 * 3600 * 1000);
    const lots = await this.prisma.lot.findMany({
      where: {
        medicament: { cliniqueId },
        quantiteRestante: { gt: 0 },
        datePeremption: { lte: limite },
      },
      include: { medicament: { select: { nom: true } } },
      orderBy: { datePeremption: 'asc' },
    });
    const peremptions = lots.map((l) => ({
      medicament: l.medicament.nom,
      lot: l.numeroLot,
      quantite: l.quantiteRestante,
      peremption: l.datePeremption.toISOString().slice(0, 10),
    }));

    return {
      periode: libelle,
      totalVentes,
      quantitesVendues: quantites,
      topMedicaments,
      stocksFaibles,
      peremptions,
    };
  }

  // ─────────── Maternité ───────────
  async maternite(cliniqueId: number, debut?: string, fin?: string) {
    const { debut: d, fin: f, libelle } = this.bornes(debut, fin);
    const lignes = await this.prisma.passagePrestation.findMany({
      where: {
        passage: { cliniqueId },
        statut: 'PAYEE',
        updatedAt: { gte: d, lte: f },
        prestation: { type: 'MATERNITE' },
      },
      include: { prestation: { select: { libelle: true } } },
    });

    const parActeMap = new Map<string, { nombre: number; montant: number }>();
    for (const l of lignes) {
      const lib = l.prestation?.libelle ?? l.libelle;
      const e = parActeMap.get(lib) ?? { nombre: 0, montant: 0 };
      e.nombre += 1;
      e.montant += N(l.montant);
      parActeMap.set(lib, e);
    }
    return {
      periode: libelle,
      total: lignes.length,
      montant: lignes.reduce((s, l) => s + N(l.montant), 0),
      parActe: [...parActeMap.entries()]
        .map(([acte, v]) => ({ acte, ...v }))
        .sort((a, b) => b.nombre - a.nombre),
    };
  }
}
