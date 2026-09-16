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

  /** Recherche d'une ordonnance par code patient ou N° d'ordre. */
  async rechercherOrdonnances(reference: string, cliniqueId: number) {
    const ref = reference.trim().toUpperCase();
    const refSans = ref.replace(/[\s-]/g, '');
    if (!ref) return [];

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
        id: p.id,
        numeroOrdre: p.numeroOrdre,
        createdAt: p.createdAt,
        patient: p.patient,
        consultations: p.consultations.map((c) => ({
          id: c.id,
          statut: c.statut,
          valideeLe: c.valideeLe,
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

      const prixUnitaire = medicament.prixVente ? N(medicament.prixVente) : 0;
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

    // Impression automatique du reçu pharmacie
    let impression = null;
    if (this.impressionService.getConfig().autoPrint) {
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
    return medicaments.map((m) => ({
      ...m,
      prixVente: m.prixVente ? N(m.prixVente) : null,
      lots: m.lots.map((l) => ({
        ...l,
        datePeremption: l.datePeremption,
        perime: new Date(l.datePeremption).getTime() < Date.now(),
        peremptionProche: new Date(l.datePeremption).getTime() < dans90Jours.getTime(),
      })),
      alerteStock: m.seuilAlerte > 0 && m.stock <= m.seuilAlerte,
    }));
  }

  /** Entrée de stock avec lot + péremption. */
  async entrerStock(
    dto: {
      medicamentId: number;
      numeroLot: string;
      quantite: number;
      datePeremption: string;
      prixAchat?: number;
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
}
