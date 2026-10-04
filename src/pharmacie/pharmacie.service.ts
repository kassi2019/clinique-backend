import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';

const N = (x: any) => Number(x);

@Injectable()
export class PharmacieService {
  private readonly logger = new Logger(PharmacieService.name);

  constructor(
    private prisma: PrismaService,
    private impressionService: ImpressionService,
  ) {}

  // ═══════════════ ORDONNANCES (§9.1) ═══════════════

  /**
   * Recherche d'une ordonnance par code patient ou N° d'ordre ; sans code,
   * renvoie la liste des ordonnances en attente (avec filtres).
   */
  async rechercherOrdonnances(
    reference: string,
    cliniqueId: number,
    filtres: {
      medecinId?: number;
      statut?: string;
      debut?: string;
      fin?: string;
    } = {},
  ) {
    const ref = reference.trim().toUpperCase();
    const refSans = ref.replace(/[\s-]/g, '');

    // ── Mode liste : ordonnances en attente (pas de code saisi) ──
    if (!ref) {
      const debut = filtres.debut
        ? new Date(`${filtres.debut}T00:00:00`)
        : new Date(new Date().setHours(0, 0, 0, 0));
      const fin = filtres.fin
        ? new Date(`${filtres.fin}T23:59:59.999`)
        : new Date(new Date().setHours(23, 59, 59, 999));

      const where: any = {
        passage: { cliniqueId },
        medicaments: { some: {} },
        createdAt: { gte: debut, lte: fin },
      };
      if (filtres.statut === 'EN_ATTENTE' || filtres.statut === 'TRAITEE') {
        where.ordonnanceStatut = filtres.statut;
      } else {
        where.ordonnanceStatut = 'EN_ATTENTE';
      }
      if (filtres.medecinId) where.medecinId = filtres.medecinId;

      const consultations = await this.prisma.consultation.findMany({
        where,
        include: {
          medecin: {
            select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
          },
          patient: { select: { nom: true, prenom: true, code: true } },
          passage: { select: { numeroOrdre: true } },
          _count: { select: { medicaments: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return {
        liste: true,
        ordonnances: consultations.map((c) => ({
          id: c.id,
          numeroOrdonnance: c.numeroOrdonnance ?? '—',
          ordonnanceStatut: c.ordonnanceStatut,
          createdAt: c.createdAt,
          patient: c.patient,
          passage: c.passage,
          medecin: c.medecin,
          nbMedicaments: c._count.medicaments,
        })),
      };
    }

    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        OR: [
          { numeroOrdre: { contains: ref } },
          { patient: { is: { code: refSans } } },
          { patient: { is: { nom: { contains: ref } } } },
          { patient: { is: { prenom: { contains: ref } } } },
        ],
      },
      include: {
        patient: true,
        consultations: {
          include: {
            medicaments: true,
            dispensations: {
              include: { lignes: true, paiement: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return passages
      .filter((p) => p.consultations.some((c) => c.medicaments.length > 0))
      .map((p) => ({
        liste: false,
        id: p.id,
        numeroOrdre: p.numeroOrdre,
        createdAt: p.createdAt,
        patient: p.patient,
        consultations: p.consultations.map((c) => ({
          id: c.id,
          statut: c.statut,
          valideeLe: c.valideeLe,
          numeroOrdonnance: c.numeroOrdonnance,
          ordonnanceStatut: c.ordonnanceStatut,
          medicaments: c.medicaments,
          dispensations: c.dispensations.map((d) => ({
            ...d,
            montantTotal: N(d.montantTotal),
            lignes: d.lignes.map((l) => ({ ...l, montant: N(l.montant), prixUnitaire: N(l.prixUnitaire) })),
            paiement: d.paiement ? { ...d.paiement, montantTotal: N(d.paiement.montantTotal) } : null,
          })),
        })),
      }));
  }

  /** Détail d'une ordonnance : prescriptions + stocks disponibles. */
  async detailOrdonnance(consultationId: number) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        patient: true,
        passage: {
          include: {
            service: { select: { nom: true } },
            patient: true,
          },
        },
        medecin: {
          select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
          },
        },
        medicaments: {
          include: { medicament: { include: { lots: { where: { quantiteRestante: { gt: 0 } }, orderBy: { datePeremption: 'asc' } } } } },
        },
        dispensations: {
          include: {
            lignes: true,
            paiement: true,
            pharmacien: { select: { personnel: { select: { nom: true, prenom: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!consultation) throw new NotFoundException('Ordonnance introuvable.');
    if (consultation.medicaments.length === 0) {
      throw new BadRequestException('Cette consultation ne contient aucune prescription de médicament.');
    }

    return {
      consultation: {
        id: consultation.id,
        statut: consultation.statut,
        valideeLe: consultation.valideeLe,
        patient: consultation.passage.patient,
        service: consultation.passage.service,
        medecin: consultation.medecin,
      },
      prescriptions: consultation.medicaments.map((p) => ({
        id: p.id,
        medicamentNom: p.medicamentNom,
        forme: p.forme,
        posologie: p.posologie,
        quantite: p.quantite,
        duree: p.duree,
        medicament: p.medicament
          ? {
              id: p.medicament.id,
              stock: p.medicament.stock,
              prixVente: p.medicament.prixVente ? N(p.medicament.prixVente) : null,
              uniteVente: p.medicament.uniteVente,
              lots: p.medicament.lots.map((l) => ({
                id: l.id,
                numeroLot: l.numeroLot,
                quantiteRestante: l.quantiteRestante,
                datePeremption: l.datePeremption,
              })),
            }
          : null,
      })),
      dispensations: consultation.dispensations.map((d) => ({
        ...d,
        montantTotal: N(d.montantTotal),
        lignes: d.lignes.map((l) => ({
          ...l,
          prixUnitaire: N(l.prixUnitaire),
          montant: N(l.montant),
        })),
        paiement: d.paiement ? { ...d.paiement, montantTotal: N(d.paiement.montantTotal) } : null,
      })),
    };
  }

  /**
   * Dispensation : sort les quantités des lots (FEFO : péremption la plus
   * proche d'abord), décrémente le stock et enregistre les mouvements.
   */
  async dispenser(
    consultationId: number,
    lignes: { prescriptionId: number; quantiteDelivree: number }[],
    pharmacienId: number,
  ) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { passage: true },
    });
    if (!consultation) throw new NotFoundException('Ordonnance introuvable.');

    let dispensation = await this.prisma.dispensation.findFirst({
      where: { consultationId, statut: 'EN_COURS' },
    });
    if (!dispensation) {
      dispensation = await this.prisma.dispensation.create({
        data: { consultationId, pharmacienId },
      });
    }

    let total = 0;
    for (const ligne of lignes) {
      if (!ligne.quantiteDelivree || ligne.quantiteDelivree <= 0) continue;
      const prescription = await this.prisma.prescription.findUnique({
        where: { id: ligne.prescriptionId },
        include: { medicament: true },
      });
      if (!prescription || prescription.consultationId !== consultationId) {
        throw new BadRequestException('Prescription invalide.');
      }
      if (!prescription.medicamentId) {
        throw new BadRequestException(
          `« ${prescription.medicamentNom} » n'est pas au catalogue : impossible de le délivrer depuis le stock.`,
        );
      }
      const medicament = prescription.medicament;
      if (medicament.stock < ligne.quantiteDelivree) {
        throw new BadRequestException(
          `Stock insuffisant pour « ${medicament.nom} » (disponible : ${medicament.stock}).`,
        );
      }

      // Sortie FEFO des lots
      let restant = ligne.quantiteDelivree;
      const lots = await this.prisma.lot.findMany({
        where: { medicamentId: medicament.id, quantiteRestante: { gt: 0 } },
        orderBy: { datePeremption: 'asc' },
      });
      for (const lot of lots) {
        if (restant === 0) break;
        const prise = Math.min(lot.quantiteRestante, restant);
        await this.prisma.lot.update({
          where: { id: lot.id },
          data: { quantiteRestante: { decrement: prise } },
        });
        await this.prisma.mouvementStock.create({
          data: {
            medicamentId: medicament.id,
            type: 'SORTIE',
            quantite: -prise,
            lotId: lot.id,
            reference: consultation.passage.numeroOrdre,
            utilisateurId: pharmacienId,
            commentaire: `Dispensation ${prescription.medicamentNom}`,
          },
        });
        restant -= prise;
      }
      if (restant > 0) {
        throw new BadRequestException(
          `Stock insuffisant pour « ${medicament.nom} » (lots vides après FEFO).`,
        );
      }

      await this.prisma.medicament.update({
        where: { id: medicament.id },
        data: { stock: { decrement: ligne.quantiteDelivree } },
      });

      // Seuil automatique : consommation des 60 derniers jours ÷ 120
      this.recalculerSeuil(medicament.id).catch(() => undefined);

      // Les consommables ne sont pas facturés en caisse pharmacie (montant = 0).
      const prixUnitaire = medicament.consommable
        ? 0
        : medicament.prixVente
          ? N(medicament.prixVente)
          : 0;
      const montant = prixUnitaire * ligne.quantiteDelivree;
      await this.prisma.ligneDispensation.create({
        data: {
          dispensationId: dispensation.id,
          prescriptionId: prescription.id,
          medicamentId: medicament.id,
          medicamentNom: medicament.nom,
          quantitePrescrite: prescription.quantite ?? undefined,
          quantiteDelivree: ligne.quantiteDelivree,
          uniteVente: medicament.uniteVente,
          prixUnitaire,
          montant,
        },
      });
      total += montant;
    }

    await this.prisma.dispensation.update({
      where: { id: dispensation.id },
      data: { montantTotal: { increment: total } },
    });

    return this.prisma.dispensation.findUnique({
      where: { id: dispensation.id },
      include: { lignes: true, paiement: true },
    });
  }

  /** Clôture de l'ordonnance servie (§9.1). */
  async cloturer(dispensationId: number) {
    const dispensation = await this.prisma.dispensation.findUnique({
      where: { id: dispensationId },
    });
    if (!dispensation) throw new NotFoundException('Dispensation introuvable.');
    return this.prisma.dispensation.update({
      where: { id: dispensationId },
      data: { statut: 'CLOTUREE', clotureeLe: new Date() },
    });
  }

  /** Encaissement à la caisse pharmacie + reçu imprimé. */
  async payer(dispensationId: number, modePaiement: string, caissierId: number) {
    const dispensation = await this.prisma.dispensation.findUnique({
      where: { id: dispensationId },
      include: { paiement: true, consultation: { include: { passage: true } } },
    });
    if (!dispensation) throw new NotFoundException('Dispensation introuvable.');
    if (dispensation.paiement && dispensation.paiement.statut === 'VALIDE') {
      throw new BadRequestException('Cette dispensation est déjà payée.');
    }

    const annee = new Date().getFullYear();
    const nb = await this.prisma.pharmaciePaiement.count({
      where: { numeroRecu: { contains: `P${annee}-` } },
    });
    const numeroRecu = `P${annee}-${String(nb + 1).padStart(5, '0')}`;

    const paiement = await this.prisma.pharmaciePaiement.create({
      data: {
        dispensationId,
        caissierId,
        numeroRecu,
        montantTotal: dispensation.montantTotal,
        modePaiement,
      },
    });
    await this.prisma.dispensation.update({
      where: { id: dispensationId },
      data: { statut: 'CLOTUREE', clotureeLe: new Date() },
    });

    // L'ordonnance passe au statut TRAITEE (disparaît de la liste des ordonnances en attente)
    await this.prisma.consultation.update({
      where: { id: dispensation.consultationId },
      data: { ordonnanceStatut: 'TRAITEE' },
    });

    // Impression automatique du reçu pharmacie
    let impression = null;
    if (
      (
        await this.impressionService.getConfigPoste(
          dispensation.consultation.passage.cliniqueId,
          'PHARMACIE',
        )
      ).autoPrint
    ) {
      try {
        impression = await this.impressionService.imprimerRecuPharmacie(paiement.id);
      } catch (err: any) {
        this.logger.error(`Impression reçu pharmacie #${paiement.id}: ${err.message}`);
      }
    }

    const lignes = await this.prisma.ligneDispensation.findMany({
      where: { dispensationId },
      orderBy: { id: 'asc' },
    });

    return {
      paiement: { ...paiement, montantTotal: N(paiement.montantTotal) },
      lignes: lignes.map((l) => ({
        id: l.id,
        medicamentNom: l.medicamentNom,
        quantiteDelivree: l.quantiteDelivree,
        prixUnitaire: N(l.prixUnitaire),
        montant: N(l.montant),
      })),
      impression,
    };
  }

  async annulerPaiement(paiementId: number, motif: string) {
    const paiement = await this.prisma.pharmaciePaiement.findUnique({
      where: { id: paiementId },
    });
    if (!paiement) throw new NotFoundException('Paiement introuvable.');
    if (paiement.statut === 'ANNULE') {
      throw new BadRequestException('Ce paiement est déjà annulé.');
    }
    return this.prisma.pharmaciePaiement.update({
      where: { id: paiementId },
      data: { statut: 'ANNULE', motifAnnulation: motif, dateAnnulation: new Date() },
    });
  }

  // ═══════════════ STOCKS (§9.2) ═══════════════

  /** Liste des médicaments avec lots, mouvements et alertes. */
  async stocks(cliniqueId: number, search?: string) {
    const where: any = { cliniqueId };
    if (search) {
      where.OR = [{ nom: { contains: search } }, { dosage: { contains: search } }];
    }
    const medicaments = await this.prisma.medicament.findMany({
      where,
      include: {
        lots: { where: { quantiteRestante: { gt: 0 } }, orderBy: { datePeremption: 'asc' } },
      },
      orderBy: { nom: 'asc' },
    });
    const dans90Jours = new Date(Date.now() + 90 * 24 * 3600 * 1000);
    return medicaments.map((m) => {
      const statut = this.statutStock(m.stock, m.seuilAlerte);
      return {
        ...m,
        prixVente: m.prixVente ? N(m.prixVente) : null,
        lots: m.lots.map((l) => ({
          ...l,
          datePeremption: l.datePeremption,
          perime: new Date(l.datePeremption).getTime() < Date.now(),
          peremptionProche: new Date(l.datePeremption).getTime() < dans90Jours.getTime(),
        })),
        alerteStock: statut.code === 'SOUS_STOCK' || statut.code === 'RUPTURE',
        // État SD/Qs (nouvelle règle) : code, libellé et couleur pour l'affichage
        statutStock: statut,
      };
    });
  }

  /** Entrée de stock avec lot + péremption + fournisseur. */
  async entrerStock(
    dto: {
      medicamentId: number;
      numeroLot: string;
      quantite: number;
      datePeremption: string;
      prixAchat?: number;
      fournisseur?: string;
    },
    utilisateurId: number,
  ) {
    const medicament = await this.prisma.medicament.findUnique({
      where: { id: dto.medicamentId },
    });
    if (!medicament) throw new NotFoundException('Médicament introuvable.');

    const lot = await this.prisma.lot.create({
      data: {
        medicamentId: dto.medicamentId,
        numeroLot: dto.numeroLot,
        quantiteInitiale: dto.quantite,
        quantiteRestante: dto.quantite,
        datePeremption: new Date(dto.datePeremption),
        prixAchat: dto.prixAchat,
        fournisseur: dto.fournisseur?.trim() || null,
      },
    });
    await this.prisma.mouvementStock.create({
      data: {
        medicamentId: dto.medicamentId,
        type: 'ENTREE',
        quantite: dto.quantite,
        lotId: lot.id,
        reference: dto.numeroLot,
        utilisateurId,
        commentaire: 'Entrée de stock',
      },
    });
    await this.prisma.medicament.update({
      where: { id: dto.medicamentId },
      data: { stock: { increment: dto.quantite } },
    });
    return lot;
  }

  /** Inventaire : ajustement du stock à la quantité réelle comptée. */
  async inventaire(
    dto: { medicamentId: number; quantiteReelle: number; commentaire?: string },
    utilisateurId: number,
  ) {
    const medicament = await this.prisma.medicament.findUnique({
      where: { id: dto.medicamentId },
    });
    if (!medicament) throw new NotFoundException('Médicament introuvable.');
    const ecart = dto.quantiteReelle - medicament.stock;
    if (ecart !== 0) {
      await this.prisma.mouvementStock.create({
        data: {
          medicamentId: dto.medicamentId,
          type: 'INVENTAIRE',
          quantite: ecart,
          reference: 'Inventaire',
          utilisateurId,
          commentaire: dto.commentaire,
        },
      });
    }
    return this.prisma.medicament.update({
      where: { id: dto.medicamentId },
      data: { stock: dto.quantiteReelle },
    });
  }

  /**
   * Seuil dynamique PAR PRODUIT (nouvelle formule) :
   *   Qs = (somme des consommations des 30 derniers jours) ÷ 30
   * La consommation = quantités SORTIES (dispensations) sur 30 jours.
   * Qs est stocké dans `seuilAlerte` ; l'état (couleur) se calcule depuis SD/Qs.
   */
  async recalculerSeuil(medicamentId: number) {
    const depuis = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    const agg = await this.prisma.mouvementStock.aggregate({
      where: { medicamentId, type: 'SORTIE', createdAt: { gte: depuis } },
      _sum: { quantite: true },
    });
    const consommation = Math.abs(agg._sum.quantite ?? 0);
    const qs = Math.round(consommation / 30);
    await this.prisma.medicament.update({
      where: { id: medicamentId },
      data: { seuilAlerte: qs },
    });
    return { consommation30j: consommation, qs };
  }

  /**
   * État de stock selon la règle SD/Qs :
   *   Rupture (rouge)         : SD/Qs = 0          (SD = 0)
   *   Sans consommation (noir): Qs = 0 et SD > 0
   *   Surstock (bleu)         : SD/Qs > 20
   *   Bien stocké (vert)      : 5 < SD/Qs ≤ 20
   *   Sous stock (jaune)      : 0 < SD/Qs < 5
   */
  statutStock(stockDisponible: number, qs: number) {
    if (stockDisponible <= 0) return { code: 'RUPTURE', libelle: 'Rupture', couleur: '#dc2626' };
    if (qs === 0) return { code: 'SANS_CONSOMMATION', libelle: 'Sans consommation', couleur: '#111827' };
    const ratio = stockDisponible / qs;
    if (ratio > 20) return { code: 'SURSTOCK', libelle: 'Surstock', couleur: '#2563eb' };
    if (ratio > 5) return { code: 'BIEN_STOCKE', libelle: 'Bien stocké', couleur: '#16a34a' };
    return { code: 'SOUS_STOCK', libelle: 'Sous stock', couleur: '#eab308' };
  }

  /** Recalcule le seuil de tous les médicaments de la clinique. */
  async recalculerTousSeuils(cliniqueId: number) {
    const medicaments = await this.prisma.medicament.findMany({
      where: { cliniqueId },
      select: { id: true },
    });
    for (const m of medicaments) {
      await this.recalculerSeuil(m.id);
    }
    return { recalcules: medicaments.length };
  }

  /** Lots d'un médicament (sous-onglet Inventaire : stock réel par lot). */
  async lots(medicamentId: number) {    return this.prisma.lot.findMany({
      where: { medicamentId },
      orderBy: [{ datePeremption: 'asc' }, { createdAt: 'asc' }],
    });
  }

  /** Tous les lots de la clinique, avec le nom du médicament (liste Inventaire). */
  async lotsClinique(cliniqueId: number) {
    return this.prisma.lot.findMany({
      where: { medicament: { cliniqueId } },
      include: { medicament: { select: { id: true, nom: true, dosage: true } } },
      orderBy: [
        { medicament: { nom: 'asc' } },
        { datePeremption: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  /** Inventaire PAR LOT : le stock réel saisi devient le stock du lot. */
  async inventaireLot(
    lotId: number,
    quantiteReelle: number,
    commentaire: string | undefined,
    utilisateurId: number,
  ) {
    const lot = await this.prisma.lot.findUnique({ where: { id: lotId } });
    if (!lot) throw new NotFoundException('Lot introuvable.');
    const ecart = quantiteReelle - lot.quantiteRestante;
    if (ecart !== 0) {
      await this.prisma.mouvementStock.create({
        data: {
          medicamentId: lot.medicamentId,
          type: 'INVENTAIRE',
          quantite: ecart,
          lotId,
          reference: `Inventaire lot ${lot.numeroLot}`,
          utilisateurId,
          commentaire,
        },
      });
    }
    await this.prisma.lot.update({
      where: { id: lotId },
      data: { quantiteRestante: quantiteReelle },
    });
    // Le stock du médicament reflète la somme des lots
    const total = await this.prisma.lot.aggregate({
      where: { medicamentId: lot.medicamentId },
      _sum: { quantiteRestante: true },
    });
    return this.prisma.medicament.update({
      where: { id: lot.medicamentId },
      data: { stock: total._sum.quantiteRestante ?? 0 },
    });
  }

  /** Inventaire GROUPÉ : valide plusieurs lots en une seule fois. */
  async inventaireMultiple(
    lignes: { lotId: number; quantiteReelle: number }[],
    utilisateurId: number,
  ) {
    let ajustes = 0;
    const medicaments = new Set<number>();
    for (const l of lignes) {
      const lot = await this.prisma.lot.findUnique({ where: { id: l.lotId } });
      if (!lot) continue;
      const quantiteReelle = Number(l.quantiteReelle) || 0;
      const ecart = quantiteReelle - lot.quantiteRestante;
      if (ecart !== 0) {
        await this.prisma.mouvementStock.create({
          data: {
            medicamentId: lot.medicamentId,
            type: 'INVENTAIRE',
            quantite: ecart,
            lotId: lot.id,
            reference: `Inventaire lot ${lot.numeroLot}`,
            utilisateurId,
          },
        });
        await this.prisma.lot.update({
          where: { id: lot.id },
          data: { quantiteRestante: quantiteReelle },
        });
        medicaments.add(lot.medicamentId);
        ajustes++;
      }
    }
    // Le stock de chaque médicament concerné reflète la somme de ses lots
    for (const medicamentId of medicaments) {
      const total = await this.prisma.lot.aggregate({
        where: { medicamentId },
        _sum: { quantiteRestante: true },
      });
      await this.prisma.medicament.update({
        where: { id: medicamentId },
        data: { stock: total._sum.quantiteRestante ?? 0 },
      });
    }
    return { ajustes, total: lignes.length };
  }

  /** Mouvements d'un médicament. */
  async mouvements(medicamentId: number) {
    const mouvements = await this.prisma.mouvementStock.findMany({
      where: { medicamentId },
      include: {
        utilisateur: { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } },
        lot: { select: { numeroLot: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return mouvements.map((m) => ({
      ...m,
      utilisateur: m.utilisateur
        ? {
            matricule: m.utilisateur.matricule,
            nom: m.utilisateur.personnel?.nom ?? '',
            prenom: m.utilisateur.personnel?.prenom ?? '',
          }
        : null,
    }));
  }

  /** Alertes : stock minimum + lots périmés ou proches de la péremption. */
  async alertes(cliniqueId: number) {
    const stocks = await this.stocks(cliniqueId);
    const dans90Jours = Date.now() + 90 * 24 * 3600 * 1000;
    return {
      stockBas: stocks.filter((m) => m.alerteStock),
      peremptions: stocks
        .flatMap((m) => m.lots.map((l) => ({ medicament: m.nom, ...l })))
        .filter((l) => new Date(l.datePeremption).getTime() < dans90Jours),
    };
  }

  // ═══════════════ CONSOMMABLES (§9.3) ═══════════════

  async consommables(cliniqueId: number) {
    const liste = await this.prisma.consommable.findMany({
      where: { cliniqueId },
      orderBy: { nom: 'asc' },
    });
    return liste.map((c) => ({
      ...c,
      alerte: c.seuilAlerte > 0 && c.quantite <= c.seuilAlerte,
    }));
  }

  async creerConsommable(dto: any) {
    return this.prisma.consommable.create({
      data: {
        cliniqueId: dto.cliniqueId,
        nom: dto.nom,
        unite: dto.unite,
        seuilAlerte: dto.seuilAlerte ? Number(dto.seuilAlerte) : 0,
        quantite: dto.quantite ? Number(dto.quantite) : 0,
      },
    });
  }

  async majConsommable(id: number, dto: any) {
    return this.prisma.consommable.update({
      where: { id },
      data: {
        nom: dto.nom,
        unite: dto.unite,
        seuilAlerte: dto.seuilAlerte !== undefined ? Number(dto.seuilAlerte) : undefined,
        actif: dto.actif,
      },
    });
  }

  /** Mouvement de consommable (entrée/sortie/inventaire) — met à jour la quantité. */
  async mouvementConsommable(
    id: number,
    dto: { type: string; quantite: number; commentaire?: string },
    utilisateurId: number,
  ) {
    const consommable = await this.prisma.consommable.findUnique({
      where: { id },
    });
    if (!consommable) throw new NotFoundException('Consommable introuvable.');

    let nouvelleQuantite = consommable.quantite;
    if (dto.type === 'ENTREE') {
      nouvelleQuantite += dto.quantite;
      await this.prisma.consommable.update({
        where: { id },
        data: { quantite: { increment: dto.quantite } },
      });
    } else if (dto.type === 'SORTIE') {
      if (consommable.quantite < dto.quantite) {
        throw new BadRequestException(
          `Quantité insuffisante (disponible : ${consommable.quantite}).`,
        );
      }
      nouvelleQuantite -= dto.quantite;
      await this.prisma.consommable.update({
        where: { id },
        data: { quantite: { decrement: dto.quantite } },
      });
    } else if (dto.type === 'INVENTAIRE') {
      nouvelleQuantite = dto.quantite;
      await this.prisma.consommable.update({
        where: { id },
        data: { quantite: dto.quantite },
      });
    } else {
      throw new BadRequestException("Type de mouvement invalide (ENTREE/SORTIE/INVENTAIRE).");
    }

    await this.prisma.mouvementConsommable.create({
      data: {
        consommableId: id,
        type: dto.type,
        quantite:
          dto.type === 'SORTIE'
            ? -dto.quantite
            : dto.type === 'ENTREE'
              ? dto.quantite
              : nouvelleQuantite - consommable.quantite,
        utilisateurId,
        commentaire: dto.commentaire,
      },
    });

    return this.prisma.consommable.findUnique({ where: { id } });
  }

  async mouvementsConsommable(id: number) {
    return this.prisma.mouvementConsommable.findMany({
      where: { consommableId: id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  // ─────────────────── Retraits / péremptions / financier ───────────────────

  /** Libellés des motifs de retrait de stock. */
  static MOTIFS_RETRAIT: Record<string, string> = {
    RETOUR_FOURNISSEUR: 'Retour fournisseur',
    PERIME: 'Périmé',
    CASSE: 'Casse',
    PERTE: 'Perte',
    AUTRE: 'Autre',
  };

  /** Retire une quantité d'un lot (retour fournisseur, périmé, casse, perte…). */
  async retirerLot(
    lotId: number,
    dto: { quantite: number; motif: string; commentaire?: string },
    utilisateurId: number,
  ) {
    const lot = await this.prisma.lot.findUnique({
      where: { id: lotId },
      include: { medicament: true },
    });
    if (!lot) throw new NotFoundException('Lot introuvable.');
    if (!dto.quantite || dto.quantite <= 0 || dto.quantite > lot.quantiteRestante) {
      throw new BadRequestException(
        `Quantité invalide : le lot contient ${lot.quantiteRestante} unité(s) restante(s).`,
      );
    }
    const libelleMotif =
      PharmacieService.MOTIFS_RETRAIT[dto.motif] ?? dto.motif ?? 'Retrait';

    const [majLot] = await this.prisma.$transaction([
      this.prisma.lot.update({
        where: { id: lotId },
        data: { quantiteRestante: lot.quantiteRestante - dto.quantite },
      }),
      this.prisma.medicament.update({
        where: { id: lot.medicamentId },
        data: { stock: Math.max(0, lot.medicament.stock - dto.quantite) },
      }),
      this.prisma.mouvementStock.create({
        data: {
          medicamentId: lot.medicamentId,
          type: 'RETRAIT',
          quantite: -dto.quantite,
          lotId,
          reference: libelleMotif,
          commentaire: dto.commentaire ?? null,
          utilisateurId,
        },
      }),
    ]);
    return majLot;
  }

  /**
   * Retire automatiquement les lots périmés du stock (tâche nocturne + bouton
   * manuel). Chaque retrait crée un mouvement RETRAIT « Périmé (auto) » qui
   * constitue le rapport consultable dans les points financiers.
   */
  async retirerPerimesAuto(cliniqueId: number) {
    const lots = await this.prisma.lot.findMany({
      where: {
        medicament: { cliniqueId },
        quantiteRestante: { gt: 0 },
        datePeremption: { lt: new Date() },
      },
      include: { medicament: true },
    });
    for (const lot of lots) {
      await this.prisma.$transaction([
        this.prisma.lot.update({
          where: { id: lot.id },
          data: { quantiteRestante: 0 },
        }),
        this.prisma.medicament.update({
          where: { id: lot.medicamentId },
          data: { stock: Math.max(0, lot.medicament.stock - lot.quantiteRestante) },
        }),
        this.prisma.mouvementStock.create({
          data: {
            medicamentId: lot.medicamentId,
            type: 'RETRAIT',
            quantite: -lot.quantiteRestante,
            lotId: lot.id,
            reference: 'Périmé (auto)',
            commentaire: `Retrait automatique — péremption ${lot.datePeremption.toISOString().slice(0, 10)}`,
          },
        }),
      ]);
    }
    const quantiteRetiree = lots.reduce((s, l) => s + l.quantiteRestante, 0);
    return { lotsRetires: lots.length, quantiteRetiree };
  }

  /** Lots dont la péremption arrive dans les N prochains jours (badge d'alerte). */
  async peremptionsProches(cliniqueId: number, jours = 30) {
    const limite = new Date(Date.now() + jours * 24 * 3600 * 1000);
    return this.prisma.lot.findMany({
      where: {
        medicament: { cliniqueId },
        quantiteRestante: { gt: 0 },
        datePeremption: { lte: limite },
      },
      include: { medicament: { select: { id: true, nom: true, dosage: true } } },
      orderBy: [{ datePeremption: 'asc' }, { medicament: { nom: 'asc' } }],
    });
  }

  /** Historique des retraits (rapport des périmés/pertes/casses). */
  async retraits(cliniqueId: number, debut?: string, fin?: string) {
    const where: any = {
      type: 'RETRAIT',
      medicament: { cliniqueId },
    };
    if (debut && /^\d{4}-\d{2}-\d{2}$/.test(debut)) {
      where.createdAt = { gte: new Date(`${debut}T00:00:00`) };
    }
    if (fin && /^\d{4}-\d{2}-\d{2}$/.test(fin)) {
      where.createdAt = { ...(where.createdAt ?? {}), lte: new Date(`${fin}T23:59:59.999`) };
    }
    return this.prisma.mouvementStock.findMany({
      where,
      include: {
        medicament: { select: { nom: true, dosage: true } },
        lot: { select: { numeroLot: true, datePeremption: true, prixAchat: true } },
        utilisateur: {
          select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
  }

  /**
   * Détail d'un bloc des points financiers : liste des lignes qui composent
   * le montant (reçus, vendus, perdus, correctifs ou restants).
   */
  async detailFinancier(
    cliniqueId: number,
    type: string,
    debut?: string,
    fin?: string,
  ) {
    const periode: any = {};
    if (debut && /^\d{4}-\d{2}-\d{2}$/.test(debut)) periode.gte = new Date(`${debut}T00:00:00`);
    if (fin && /^\d{4}-\d{2}-\d{2}$/.test(fin)) periode.lte = new Date(`${fin}T23:59:59.999`);
    const dansPeriode = (champ: string) =>
      Object.keys(periode).length ? { [champ]: periode } : {};

    if (type === 'recus') {
      const lots = await this.prisma.lot.findMany({
        where: { medicament: { cliniqueId }, ...dansPeriode('createdAt') },
        include: { medicament: { select: { nom: true, dosage: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return lots.map((l) => ({
        date: l.createdAt,
        medicament: `${l.medicament?.nom ?? ''} ${l.medicament?.dosage ?? ''}`.trim(),
        lot: l.numeroLot,
        quantite: l.quantiteInitiale,
        prixAchat: Number(l.prixAchat ?? 0),
        montant: l.quantiteInitiale * Number(l.prixAchat ?? 0),
      }));
    }

    if (type === 'vendus') {
      const ds = await this.prisma.dispensation.findMany({
        where: {
          statut: 'CLOTUREE',
          consultation: { passage: { cliniqueId } },
          ...dansPeriode('createdAt'),
        },
        include: {
          consultation: {
            select: {
              passage: {
                select: {
                  numeroOrdre: true,
                  patient: { select: { nom: true, prenom: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return ds.map((d) => ({
        date: d.createdAt,
        patient: `${d.consultation?.passage?.patient?.nom ?? ''} ${d.consultation?.passage?.patient?.prenom ?? ''}`.trim(),
        numeroOrdre: d.consultation?.passage?.numeroOrdre ?? '—',
        montant: Number(d.montantTotal),
      }));
    }

    if (type === 'perdus') {
      const r = await this.retraits(cliniqueId, debut, fin);
      return r.map((m) => ({
        date: m.createdAt,
        medicament: `${m.medicament?.nom ?? ''} ${m.medicament?.dosage ?? ''}`.trim(),
        motif: m.reference ?? 'Retrait',
        quantite: m.quantite,
        lot: m.lot?.numeroLot ?? '—',
        montant: Math.abs(m.quantite) * Number(m.lot?.prixAchat ?? 0),
        par: m.utilisateur?.personnel
          ? `${m.utilisateur.personnel.nom} ${m.utilisateur.personnel.prenom}`
          : 'Système',
        commentaire: m.commentaire ?? '',
      }));
    }

    if (type === 'correctifs') {
      const inv = await this.prisma.mouvementStock.findMany({
        where: { type: 'INVENTAIRE', medicament: { cliniqueId }, ...dansPeriode('createdAt') },
        include: {
          medicament: { select: { nom: true, dosage: true, prixVente: true } },
          lot: { select: { numeroLot: true, prixAchat: true } },
          utilisateur: {
            select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return inv.map((m) => ({
        date: m.createdAt,
        medicament: `${m.medicament?.nom ?? ''} ${m.medicament?.dosage ?? ''}`.trim(),
        lot: m.lot?.numeroLot ?? '—',
        ecart: m.quantite,
        montant: m.quantite * Number(m.lot?.prixAchat ?? m.medicament?.prixVente ?? 0),
        par: m.utilisateur?.personnel
          ? `${m.utilisateur.personnel.nom} ${m.utilisateur.personnel.prenom}`
          : '—',
      }));
    }

    // restants (stock actuel, hors période)
    const lots = await this.prisma.lot.findMany({
      where: { medicament: { cliniqueId }, quantiteRestante: { gt: 0 } },
      include: { medicament: { select: { nom: true, dosage: true } } },
      orderBy: { medicament: { nom: 'asc' } },
    });
    return lots.map((l) => ({
      medicament: `${l.medicament?.nom ?? ''} ${l.medicament?.dosage ?? ''}`.trim(),
      lot: l.numeroLot,
      peremption: l.datePeremption.toISOString().slice(0, 10),
      quantite: l.quantiteRestante,
      prixAchat: Number(l.prixAchat ?? 0),
      montant: l.quantiteRestante * Number(l.prixAchat ?? 0),
    }));
  }

  /**
   * Points financiers de la pharmacie :
   *   - recus : valeur des lots entrés sur la période (quantité initiale × prix d'achat)
   *   - vendus : dispensations clôturées/encaissées de la période
   *   - perdus : retraits (périmés, pertes, casses…) valorisés au prix d'achat
   *   - correctifs : écarts d'inventaire valorisés (signés)
   *   - restants : valeur du stock actuel (lots en stock au prix d'achat)
   */
  async pointsFinanciers(cliniqueId: number, debut?: string, fin?: string) {
    const periode: any = {};
    if (debut && /^\d{4}-\d{2}-\d{2}$/.test(debut)) periode.gte = new Date(`${debut}T00:00:00`);
    if (fin && /^\d{4}-\d{2}-\d{2}$/.test(fin)) periode.lte = new Date(`${fin}T23:59:59.999`);
    const dansPeriode = (champ: string) => ({ ...(Object.keys(periode).length ? { [champ]: periode } : {}) });

    const lotsPeriode = await this.prisma.lot.findMany({
      where: { medicament: { cliniqueId }, ...dansPeriode('createdAt') },
      select: { quantiteInitiale: true, prixAchat: true },
    });
    const recus = lotsPeriode.reduce(
      (s, l) => s + l.quantiteInitiale * Number(l.prixAchat ?? 0),
      0,
    );

    const vendusAgg = await this.prisma.dispensation.aggregate({
      where: {
        statut: 'CLOTUREE',
        consultation: { passage: { cliniqueId } },
        ...dansPeriode('createdAt'),
      },
      _sum: { montantTotal: true },
    });

    const retraitsPeriode = await this.prisma.mouvementStock.findMany({
      where: { type: 'RETRAIT', medicament: { cliniqueId }, ...dansPeriode('createdAt') },
      include: { lot: { select: { prixAchat: true } } },
    });
    const perdus = retraitsPeriode.reduce(
      (s, m) => s + Math.abs(m.quantite) * Number(m.lot?.prixAchat ?? 0),
      0,
    );

    const inventairesPeriode = await this.prisma.mouvementStock.findMany({
      where: { type: 'INVENTAIRE', medicament: { cliniqueId }, ...dansPeriode('createdAt') },
      include: { lot: { select: { prixAchat: true } }, medicament: { select: { prixVente: true } } },
    });
    const correctifs = inventairesPeriode.reduce(
      (s, m) => s + m.quantite * Number(m.lot?.prixAchat ?? m.medicament.prixVente ?? 0),
      0,
    );

    const lotsRestants = await this.prisma.lot.findMany({
      where: { medicament: { cliniqueId }, quantiteRestante: { gt: 0 } },
      select: { quantiteRestante: true, prixAchat: true },
    });
    const restants = lotsRestants.reduce(
      (s, l) => s + l.quantiteRestante * Number(l.prixAchat ?? 0),
      0,
    );

    return {
      periode: { debut: debut ?? null, fin: fin ?? null },
      recus,
      vendus: Number(vendusAgg._sum.montantTotal ?? 0),
      perdus,
      correctifs,
      restants,
    };
  }
}
