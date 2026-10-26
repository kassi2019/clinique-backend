import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AccueilService } from '../accueil/accueil.service';
import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
import { critereNomPrenoms } from '../common/recherche-patient';

const N = (x: any) => Number(x);

/** Dispensations d'une clinique : circuit normal (consultation) ou ordonnance externe. */
const dispensationsDeLaClinique = (cliniqueId: number) => ({
  OR: [
    { consultation: { passage: { cliniqueId } } },
    { ordonnanceExterne: { cliniqueId } },
  ],
});

/** Saisie d'une ordonnance externe à la pharmacie. */
export interface OrdonnanceExterneDto {
  cliniqueId: number;
  avecAssurance?: boolean;
  // Avec assurance : patient existant OU création express, + rattachement si besoin
  patientId?: number;
  nouveauPatient?: { nom: string; prenom: string; sexe?: string; telephone?: string };
  assurance?: { assuranceId: number; formuleId: number; numeroAssure?: string };
  // Sans assurance : nom du client (facultatif, imprimé sur le reçu)
  clientNom?: string;
  prescripteur?: string;
  etablissement?: string;
  dateOrdonnance?: string; // date de prescription (AAAA-MM-JJ)
  lignes: { medicamentId: number; quantite: number }[];
  // Règlement : COMPTANT (défaut), CREDIT ou CAS_SOCIAL (ces deux derniers : patient assuré)
  type?: string;
  modePaiement?: string;
  motif?: string;
}

/** Quantité demandée par le médecin (nombre entier) ; null pour une ancienne saisie libre. */
function quantiteDemandee(q?: string | null): number | null {
  const t = (q ?? '').trim();
  return /^\d+$/.test(t) ? Number(t) : null;
}

@Injectable()
export class PharmacieService {
  private readonly logger = new Logger(PharmacieService.name);

  constructor(
    private prisma: PrismaService,
    private impressionService: ImpressionService,
    private accueilService: AccueilService,
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

      // Une ligne par ORDONNANCE (une consultation peut en porter plusieurs)
      const where: any = {
        cliniqueId,
        medicaments: { some: {} },
        createdAt: { gte: debut, lte: fin },
        statut: filtres.statut === 'TRAITEE' ? 'TRAITEE' : 'EN_ATTENTE',
      };
      if (filtres.medecinId) where.consultation = { medecinId: filtres.medecinId };

      const ordonnances = await this.prisma.ordonnance.findMany({
        where,
        include: {
          consultation: {
            select: {
              id: true,
              medecin: {
                select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
              },
              patient: { select: { nom: true, prenom: true, code: true } },
              passage: { select: { numeroOrdre: true } },
            },
          },
          _count: { select: { medicaments: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return {
        liste: true,
        ordonnances: ordonnances.map((o) => ({
          id: o.id,
          consultationId: o.consultation.id,
          numeroOrdonnance: o.numero,
          ordonnanceType: o.type,
          ordonnanceStatut: o.statut,
          createdAt: o.createdAt,
          patient: o.consultation.patient,
          passage: o.consultation.passage,
          medecin: o.consultation.medecin,
          nbMedicaments: o._count.medicaments,
        })),
      };
    }

    // N° d'ordonnance : « ORD-00012 », « ORD00012 », « ord 12 » ou simplement « 12 »
    const chiffresOrdo = refSans.match(/^(?:ORD)?(\d+)$/)?.[1];
    const numerosOrdo = [ref, ...(chiffresOrdo ? [`ORD-${chiffresOrdo.padStart(5, '0')}`] : [])];
    const correspondOrdo = (numero: string) =>
      numerosOrdo.some((n) => numero.toUpperCase().includes(n));

    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        OR: [
          { numeroOrdre: { contains: ref } },
          { patient: { is: { code: refSans } } },
          { patient: { is: critereNomPrenoms(ref) } },
          {
            consultations: {
              some: { ordonnances: { some: { OR: numerosOrdo.map((n) => ({ numero: { contains: n } })) } } },
            },
          },
        ],
      },
      include: {
        patient: true,
        consultations: {
          include: {
            ordonnances: {
              include: {
                medicaments: true,
                dispensations: { include: { lignes: true, paiement: true } },
              },
              orderBy: { id: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Saisie « ORD… » : seules les ordonnances de ce numéro sont listées. Un nombre
    // seul (« 12 ») peut aussi être un N° d'ordre : on garde alors tout le passage.
    const parNumero =
      refSans.startsWith('ORD') &&
      passages.some((p) =>
        p.consultations.some((c) => c.ordonnances.some((o) => correspondOrdo(o.numero))),
      );

    // Une entrée par ordonnance (les ordonnances vides sont ignorées)
    return passages
      .map((p) => ({
        liste: false,
        id: p.id,
        numeroOrdre: p.numeroOrdre,
        createdAt: p.createdAt,
        patient: p.patient,
        ordonnances: p.consultations.flatMap((c) =>
          c.ordonnances
            .filter((o) => o.medicaments.length > 0 && (!parNumero || correspondOrdo(o.numero)))
            .map((o) => ({
              id: o.id,
              consultationId: c.id,
              statut: c.statut,
              valideeLe: c.valideeLe,
              createdAt: o.createdAt,
              numeroOrdonnance: o.numero,
              ordonnanceType: o.type,
              ordonnanceStatut: o.statut,
              medicaments: o.medicaments,
              dispensations: o.dispensations.map((d) => ({
                ...d,
                montantTotal: N(d.montantTotal),
                lignes: d.lignes.map((l) => ({ ...l, montant: N(l.montant), prixUnitaire: N(l.prixUnitaire) })),
                paiement: d.paiement ? { ...d.paiement, montantTotal: N(d.paiement.montantTotal) } : null,
              })),
            })),
        ),
      }))
      .filter((p) => p.ordonnances.length > 0);
  }

  /**
   * Anciennes routes (par consultation) : renvoie l'ordonnance à traiter —
   * la plus ancienne encore EN_ATTENTE, sinon la dernière.
   */
  async ordonnanceDeConsultation(consultationId: number) {
    const ordonnance =
      (await this.prisma.ordonnance.findFirst({
        where: { consultationId, statut: 'EN_ATTENTE', medicaments: { some: {} } },
        orderBy: { id: 'asc' },
      })) ??
      (await this.prisma.ordonnance.findFirst({
        where: { consultationId },
        orderBy: { id: 'desc' },
      }));
    if (!ordonnance) throw new NotFoundException('Ordonnance introuvable.');
    return ordonnance.id;
  }

  /** Détail d'UNE ordonnance : ses prescriptions + stocks disponibles + ses dispensations. */
  async detailOrdonnance(ordonnanceId: number) {
    const ordonnance = await this.prisma.ordonnance.findUnique({
      where: { id: ordonnanceId },
      include: {
        consultation: {
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
    if (!ordonnance) throw new NotFoundException('Ordonnance introuvable.');
    if (ordonnance.medicaments.length === 0) {
      throw new BadRequestException('Cette ordonnance ne contient aucun médicament.');
    }
    // Même forme de réponse qu'avant : `consultation` + ses prescriptions/dispensations
    const consultation = {
      ...ordonnance.consultation,
      medicaments: ordonnance.medicaments,
      dispensations: ordonnance.dispensations,
    };

    const couverture = await this.couverturePharmacie(consultation.patientId);

    return {
      ordonnance: {
        id: ordonnance.id,
        numero: ordonnance.numero,
        type: ordonnance.type,
        statut: ordonnance.statut,
        createdAt: ordonnance.createdAt,
      },
      // Assurance active du patient et taux applicable aux médicaments (null = non assuré)
      assurance: couverture
        ? {
            assurance: couverture.assurance.libelle,
            formule: couverture.formule.libelle,
            numeroAssure: couverture.numeroAssure,
            taux: couverture.formule.tauxPharmacie ?? 0,
          }
        : null,
      consultation: {
        id: consultation.id,
        statut: consultation.statut,
        valideeLe: consultation.valideeLe,
        patient: consultation.passage.patient,
        service: consultation.passage.service,
        medecin: consultation.medecin,
      },
      prescriptions: consultation.medicaments.map((p) => {
        const demandee = quantiteDemandee(p.quantite);
        const dejaDelivree = consultation.dispensations
          .flatMap((d) => d.lignes)
          .filter((l) => l.prescriptionId === p.id)
          .reduce((s, l) => s + l.quantiteDelivree, 0);
        return {
        id: p.id,
        medicamentNom: p.medicamentNom,
        forme: p.forme,
        posologie: p.posologie,
        quantite: p.quantite,
        duree: p.duree,
        dejaDelivree,
        // Maximum encore délivrable (null : ancienne saisie libre, non contrôlée)
        quantiteMax: demandee == null ? null : Math.max(0, demandee - dejaDelivree),
        medicament: p.medicament
          ? {
              id: p.medicament.id,
              stock: p.medicament.stock,
              consommable: p.medicament.consommable,
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
        };
      }),
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
    ordonnanceId: number,
    lignes: { prescriptionId: number; quantiteDelivree: number }[],
    pharmacienId: number,
  ) {
    const ordonnance = await this.prisma.ordonnance.findUnique({
      where: { id: ordonnanceId },
      include: { consultation: { include: { passage: true } } },
    });
    if (!ordonnance) throw new NotFoundException('Ordonnance introuvable.');
    const consultation = ordonnance.consultation;
    const consultationId = consultation.id;

    // La quantité délivrée ne peut pas dépasser la quantité demandée par le médecin
    // (déduction faite de ce qui a déjà été délivré). Contrôle avant toute écriture.
    for (const ligne of lignes) {
      if (!ligne.quantiteDelivree || ligne.quantiteDelivree <= 0) continue;
      const p = await this.prisma.prescription.findUnique({
        where: { id: ligne.prescriptionId },
        include: { medicament: { select: { uniteVente: true } } },
      });
      const demandee = quantiteDemandee(p?.quantite);
      if (!p || demandee == null) continue;
      const deja = await this.prisma.ligneDispensation.aggregate({
        where: { prescriptionId: p.id },
        _sum: { quantiteDelivree: true },
      });
      const reste = Math.max(0, demandee - (deja._sum.quantiteDelivree ?? 0));
      if (ligne.quantiteDelivree > reste) {
        const unite = p.medicament?.uniteVente === 'PLAQUE' ? 'plaquette(s)' : 'boîte(s)';
        throw new BadRequestException(
          `« ${p.medicamentNom} » : la quantité délivrée (${ligne.quantiteDelivree}) dépasse la quantité demandée par le médecin (${reste} ${unite} restant à délivrer).`,
        );
      }
    }

    // Chaque ordonnance a sa propre dispensation (et donc son propre paiement)
    let dispensation = await this.prisma.dispensation.findFirst({
      where: { ordonnanceId, statut: 'EN_COURS' },
    });
    if (!dispensation) {
      dispensation = await this.prisma.dispensation.create({
        data: { consultationId, ordonnanceId, pharmacienId },
      });
    }

    let total = 0;
    for (const ligne of lignes) {
      if (!ligne.quantiteDelivree || ligne.quantiteDelivree <= 0) continue;
      const prescription = await this.prisma.prescription.findUnique({
        where: { id: ligne.prescriptionId },
        include: { medicament: true },
      });
      if (!prescription || prescription.ordonnanceId !== ordonnanceId) {
        throw new BadRequestException('Prescription invalide.');
      }
      if (!prescription.medicamentId) {
        throw new BadRequestException(
          `« ${prescription.medicamentNom} » n'est pas au catalogue : impossible de le délivrer depuis le stock.`,
        );
      }
      const medicament = prescription.medicament;
      await this.sortirDuStock(
        medicament,
        ligne.quantiteDelivree,
        consultation.passage.numeroOrdre,
        pharmacienId,
        `Dispensation ${prescription.medicamentNom}`,
      );

      const prixUnitaire = this.prixDeVente(medicament);
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

  /**
   * Sortie de stock FEFO (péremption la plus proche d'abord) : décrémente les
   * lots et le stock du médicament, trace les mouvements, recalcule le seuil.
   */
  private async sortirDuStock(
    medicament: { id: number; nom: string; stock: number },
    quantite: number,
    reference: string,
    utilisateurId: number,
    commentaire: string,
  ) {
    if (medicament.stock < quantite) {
      throw new BadRequestException(
        `Stock insuffisant pour « ${medicament.nom} » (disponible : ${medicament.stock}).`,
      );
    }
    let restant = quantite;
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
          reference,
          utilisateurId,
          commentaire,
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
      data: { stock: { decrement: quantite } },
    });

    // Seuil automatique : consommation des 30 derniers jours ÷ 30
    this.recalculerSeuil(medicament.id).catch(() => undefined);
  }

  /** Prix facturé : les consommables ne sont pas facturés en caisse pharmacie (montant = 0). */
  private prixDeVente(medicament: { consommable: boolean; prixVente: any }) {
    if (medicament.consommable) return 0;
    return medicament.prixVente ? N(medicament.prixVente) : 0;
  }

  // ═══════════════ ORDONNANCES EXTERNES ═══════════════

  /**
   * Ordonnance prescrite hors du centre : saisie des médicaments, sortie de
   * stock et règlement en une seule validation.
   * - avec assurance : patient existant ou créé rapidement, rattaché à son
   *   assurance → taux « médicaments » appliqué ; comptant, crédit ou cas social ;
   * - sans assurance : aucun dossier patient, paiement comptant uniquement.
   */
  async creerOrdonnanceExterne(dto: OrdonnanceExterneDto, utilisateurId: number) {
    const cliniqueId = Number(dto.cliniqueId);
    if (!cliniqueId) throw new BadRequestException('Clinique non précisée.');
    const avecAssurance = !!dto.avecAssurance;
    const type = ['CREDIT', 'CAS_SOCIAL'].includes(dto.type ?? '') ? (dto.type as string) : 'COMPTANT';
    if (!avecAssurance && type !== 'COMPTANT') {
      throw new BadRequestException(
        'Sans assurance, une ordonnance externe se règle uniquement au comptant.',
      );
    }

    // Lignes : regroupées par médicament, quantités entières positives
    const quantites = new Map<number, number>();
    for (const l of dto.lignes ?? []) {
      const q = Math.floor(Number(l.quantite));
      if (!l.medicamentId || !(q > 0)) continue;
      quantites.set(Number(l.medicamentId), (quantites.get(Number(l.medicamentId)) ?? 0) + q);
    }
    if (quantites.size === 0) {
      throw new BadRequestException('Ajoutez au moins un médicament avec sa quantité.');
    }
    const medicaments = await this.prisma.medicament.findMany({
      where: { id: { in: [...quantites.keys()] }, cliniqueId },
    });
    if (medicaments.length !== quantites.size) {
      throw new BadRequestException('Médicament introuvable dans le catalogue de la clinique.');
    }
    // Contrôle du stock AVANT toute écriture
    for (const m of medicaments) {
      if (m.stock < quantites.get(m.id)!) {
        throw new BadRequestException(
          `Stock insuffisant pour « ${m.nom} » (disponible : ${m.stock}).`,
        );
      }
    }

    // Patient assuré : existant ou créé, avec une assurance active
    let patientId: number | null = null;
    if (avecAssurance) {
      if (dto.patientId) {
        const patient = await this.prisma.patient.findFirst({
          where: { id: Number(dto.patientId), cliniqueId },
        });
        if (!patient) throw new NotFoundException('Patient introuvable.');
        patientId = patient.id;
      } else if (!dto.nouveauPatient) {
        throw new BadRequestException('Choisissez le patient ou créez-le.');
      }
      const dejaCouvert = patientId ? await this.couverturePharmacie(patientId) : null;
      if (!dejaCouvert) {
        const a = dto.assurance;
        if (!a?.assuranceId || !a?.formuleId) {
          throw new BadRequestException("Choisissez l'assurance et la formule du patient.");
        }
        const formule = await this.prisma.formuleAssurance.findFirst({
          where: {
            id: Number(a.formuleId),
            assuranceId: Number(a.assuranceId),
            statut: 'ACTIF',
            assurance: { cliniqueId, statut: 'ACTIF' },
          },
        });
        if (!formule) throw new BadRequestException('Assurance ou formule invalide (ou inactive).');
        if (!patientId) {
          const cree = await this.accueilService.creerPatientExpress(
            cliniqueId,
            dto.nouveauPatient!,
            utilisateurId,
          );
          patientId = cree.id;
        }
        await this.prisma.patientAssurance.create({
          data: {
            patientId,
            assuranceId: formule.assuranceId,
            formuleId: formule.id,
            numeroAssure: a.numeroAssure?.trim() || null,
          },
        });
      }
    }

    // N° EXT-00001 : plus grand numéro de la clinique + 1
    const dernier = await this.prisma.ordonnanceExterne.findFirst({
      where: { cliniqueId },
      orderBy: { id: 'desc' },
      select: { numero: true },
    });
    const suivant = dernier ? parseInt(dernier.numero.replace(/\D/g, ''), 10) + 1 : 1;
    const numero = `EXT-${String(suivant).padStart(5, '0')}`;

    const ordonnanceExterne = await this.prisma.ordonnanceExterne.create({
      data: {
        cliniqueId,
        numero,
        patientId,
        clientNom: avecAssurance ? null : dto.clientNom?.trim().toUpperCase() || null,
        prescripteur: dto.prescripteur?.trim() || null,
        etablissement: dto.etablissement?.trim() || null,
        // Date écrite sur l'ordonnance ; date du jour si elle n'est pas précisée
        dateOrdonnance: dto.dateOrdonnance ? new Date(dto.dateOrdonnance) : new Date(),
        creeParId: utilisateurId,
      },
    });
    const dispensation = await this.prisma.dispensation.create({
      data: { ordonnanceExterneId: ordonnanceExterne.id, pharmacienId: utilisateurId },
    });

    // Sortie de stock à la validation (même règle FEFO que le circuit normal)
    let total = 0;
    for (const m of medicaments) {
      const quantite = quantites.get(m.id)!;
      await this.sortirDuStock(m, quantite, numero, utilisateurId, `Ordonnance externe ${m.nom}`);
      const prixUnitaire = this.prixDeVente(m);
      const montant = prixUnitaire * quantite;
      await this.prisma.ligneDispensation.create({
        data: {
          dispensationId: dispensation.id,
          medicamentId: m.id,
          medicamentNom: m.nom,
          quantitePrescrite: String(quantite),
          quantiteDelivree: quantite,
          uniteVente: m.uniteVente,
          prixUnitaire,
          montant,
        },
      });
      total += montant;
    }
    await this.prisma.dispensation.update({
      where: { id: dispensation.id },
      data: { montantTotal: total },
    });

    const reglement = await this.payer(dispensation.id, dto.modePaiement || 'ESPECES', utilisateurId, {
      type,
      motif: dto.motif,
    });
    return { ordonnanceExterne, ...reglement };
  }

  /** Rapport dédié des ordonnances externes servies (défaut : aujourd'hui). */
  async ordonnancesExternes(cliniqueId: number, debut?: string, fin?: string) {
    const d = debut && /^\d{4}-\d{2}-\d{2}$/.test(debut)
      ? new Date(`${debut}T00:00:00`)
      : new Date(new Date().setHours(0, 0, 0, 0));
    const f = fin && /^\d{4}-\d{2}-\d{2}$/.test(fin)
      ? new Date(`${fin}T23:59:59.999`)
      : new Date(new Date().setHours(23, 59, 59, 999));

    const liste = await this.prisma.ordonnanceExterne.findMany({
      where: { cliniqueId, createdAt: { gte: d, lte: f } },
      include: {
        patient: { select: { nom: true, prenom: true, code: true, telephone: true } },
        creePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
        dispensations: {
          include: {
            lignes: { orderBy: { id: 'asc' } },
            paiement: { include: { assurance: { select: { libelle: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const lignes = liste.map((o) => {
      const disp = o.dispensations[0];
      const p = disp?.paiement;
      const valide = p && p.statut === 'VALIDE';
      return {
        id: o.id,
        numero: o.numero,
        createdAt: o.createdAt,
        avecAssurance: !!o.patientId,
        patient: o.patient,
        client: o.patient ? `${o.patient.nom} ${o.patient.prenom}` : o.clientNom || 'Client de passage',
        prescripteur: o.prescripteur,
        etablissement: o.etablissement,
        dateOrdonnance: o.dateOrdonnance,
        medicaments: (disp?.lignes ?? []).map((l) => ({
          nom: l.medicamentNom,
          quantite: l.quantiteDelivree,
          prixUnitaire: N(l.prixUnitaire),
          montant: N(l.montant),
        })),
        montantTotal: N(disp?.montantTotal ?? 0),
        montantAssurance: valide ? N(p.montantAssurance) : 0,
        montantPatient: valide ? N(p.montantPatient ?? p.montantTotal) : 0,
        montantEncaisse: valide ? N(p.montantEncaisse ?? 0) : 0,
        assurance: p?.assurance?.libelle ?? null,
        tauxAssurance: p?.tauxAssurance ?? null,
        type: p?.type ?? null,
        modePaiement: p?.modePaiement ?? null,
        statutPaiement: p?.statut ?? null,
        regleLe: p?.regleLe ?? null,
        numeroRecu: p?.numeroRecu ?? null,
        paiementId: p?.id ?? null,
        par: o.creePar?.personnel ? `${o.creePar.personnel.nom} ${o.creePar.personnel.prenom}` : '—',
      };
    });

    const valides = lignes.filter((l) => l.statutPaiement === 'VALIDE');
    return {
      periode: { debut: d, fin: f },
      lignes,
      totaux: {
        nombre: valides.length,
        avecAssurance: valides.filter((l) => l.avecAssurance).length,
        sansAssurance: valides.filter((l) => !l.avecAssurance).length,
        montantTotal: valides.reduce((s, l) => s + l.montantTotal, 0),
        montantAssurance: valides.reduce((s, l) => s + l.montantAssurance, 0),
        montantEncaisse: valides.reduce((s, l) => s + l.montantEncaisse, 0),
        resteCredits: valides
          .filter((l) => l.type === 'CREDIT' && !l.regleLe)
          .reduce((s, l) => s + l.montantPatient, 0),
      },
    };
  }

  /** Recherche rapide d'un patient (ordonnance externe avec assurance) + son assurance active. */
  async rechercherPatientsExterne(cliniqueId: number, saisie: string) {
    const ref = (saisie ?? '').trim();
    if (ref.length < 2) return [];
    const chiffres = ref.replace(/[\s.-]/g, '');
    const patients = await this.prisma.patient.findMany({
      where: {
        cliniqueId,
        OR: [
          { code: ref.toUpperCase() },
          critereNomPrenoms(ref),
          ...(/^\d{4,}$/.test(chiffres) ? [{ telephone: { contains: chiffres } }] : []),
        ],
      },
      select: { id: true, nom: true, prenom: true, code: true, telephone: true, sexe: true },
      orderBy: { nom: 'asc' },
      take: 10,
    });
    return Promise.all(
      patients.map(async (p) => {
        const c = await this.couverturePharmacie(p.id);
        return {
          ...p,
          assurance: c
            ? {
                assurance: c.assurance.libelle,
                formule: c.formule.libelle,
                numeroAssure: c.numeroAssure,
                taux: c.formule.tauxPharmacie ?? 0,
              }
            : null,
        };
      }),
    );
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

  /** Assurance active du patient (avec le taux « médicaments » de sa formule). */
  private async couverturePharmacie(patientId: number) {
    const aujourdHui = new Date();
    const actifs = await this.prisma.patientAssurance.findMany({
      where: {
        patientId,
        statut: 'ACTIF',
        assurance: { statut: 'ACTIF' },
        formule: { statut: 'ACTIF' },
        OR: [{ dateDebut: null }, { dateDebut: { lte: aujourdHui } }],
      },
      include: { assurance: true, formule: true },
      orderBy: { createdAt: 'desc' },
    });
    return actifs.find((a) => !a.dateFin || new Date(a.dateFin) >= aujourdHui) ?? null;
  }

  /**
   * Règlement d'une dispensation + reçu imprimé.
   * - Assurance : la part couverte (taux « médicaments » de la formule) est
   *   facturée à l'assurance, le patient ne doit que le reste.
   * - COMPTANT : le patient paie sa part tout de suite.
   * - CREDIT : les médicaments sont remis, la part du patient est encaissée plus tard.
   * - CAS_SOCIAL : la part du patient est prise en charge par la clinique (rien à encaisser).
   */
  async payer(
    dispensationId: number,
    modePaiement: string,
    caissierId: number,
    options: { type?: string; motif?: string } = {},
  ) {
    const dispensation = await this.prisma.dispensation.findUnique({
      where: { id: dispensationId },
      include: {
        paiement: true,
        consultation: { include: { passage: true } },
        ordonnanceExterne: true,
      },
    });
    if (!dispensation) throw new NotFoundException('Dispensation introuvable.');
    if (dispensation.paiement && dispensation.paiement.statut === 'VALIDE') {
      throw new BadRequestException('Cette dispensation est déjà payée.');
    }
    const type = ['CREDIT', 'CAS_SOCIAL'].includes(options.type ?? '') ? (options.type as string) : 'COMPTANT';
    if (type !== 'COMPTANT' && !options.motif?.trim()) {
      throw new BadRequestException('Indiquez le motif du crédit ou du cas social.');
    }
    // Patient : celui de la consultation, ou celui de l'ordonnance externe (null = client de passage)
    const patientId =
      dispensation.consultation?.patientId ?? dispensation.ordonnanceExterne?.patientId ?? null;
    if (!patientId && type !== 'COMPTANT') {
      throw new BadRequestException('Crédit et cas social sont réservés à un patient identifié.');
    }
    const cliniqueId =
      dispensation.consultation?.passage.cliniqueId ?? dispensation.ordonnanceExterne!.cliniqueId;

    const total = N(dispensation.montantTotal);
    const couverture = patientId ? await this.couverturePharmacie(patientId) : null;
    const taux = Math.min(100, Math.max(0, couverture?.formule.tauxPharmacie ?? 0));
    const montantAssurance = Math.round((total * taux) / 100);
    // Cas social : la clinique prend en charge ce que l'assurance ne couvre pas
    const montantPatient = type === 'CAS_SOCIAL' ? 0 : total - montantAssurance;
    const montantEncaisse = type === 'COMPTANT' ? montantPatient : 0;

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
        modePaiement: type === 'COMPTANT' ? modePaiement : type,
        type,
        montantAssurance,
        montantPatient,
        montantEncaisse,
        assuranceId: taux > 0 ? couverture!.assuranceId : null,
        formuleId: taux > 0 ? couverture!.formuleId : null,
        tauxAssurance: taux > 0 ? taux : null,
        motif: options.motif?.trim() || null,
        regleLe: type === 'CREDIT' ? null : new Date(),
      },
    });
    await this.prisma.dispensation.update({
      where: { id: dispensationId },
      data: { statut: 'CLOTUREE', clotureeLe: new Date() },
    });

    // L'ordonnance passe au statut TRAITEE (disparaît de la liste des ordonnances en attente)
    if (dispensation.ordonnanceId) {
      await this.prisma.ordonnance.update({
        where: { id: dispensation.ordonnanceId },
        data: { statut: 'TRAITEE' },
      });
    }
    // Statut global de la consultation (compatibilité) : traitée quand plus rien n'attend
    if (dispensation.consultationId) {
      const enAttente = await this.prisma.ordonnance.count({
        where: {
          consultationId: dispensation.consultationId,
          statut: 'EN_ATTENTE',
          medicaments: { some: {} },
        },
      });
      await this.prisma.consultation.update({
        where: { id: dispensation.consultationId },
        data: { ordonnanceStatut: enAttente === 0 ? 'TRAITEE' : 'EN_ATTENTE' },
      });
    }

    // Impression automatique du reçu pharmacie
    let impression = null;
    if ((await this.impressionService.getConfigPoste(cliniqueId, 'PHARMACIE')).autoPrint) {
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
      paiement: {
        ...paiement,
        montantTotal: N(paiement.montantTotal),
        montantAssurance: N(paiement.montantAssurance),
        montantPatient: N(paiement.montantPatient ?? paiement.montantTotal),
        montantEncaisse: N(paiement.montantEncaisse ?? paiement.montantTotal),
        assurance: couverture && taux > 0 ? couverture.assurance.libelle : null,
      },
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

  /** Crédits pharmacie non réglés + cas sociaux récents de la clinique. */
  async credits(cliniqueId: number) {
    const paiements = await this.prisma.pharmaciePaiement.findMany({
      where: {
        statut: 'VALIDE',
        dispensation: dispensationsDeLaClinique(cliniqueId),
        OR: [{ type: 'CREDIT', regleLe: null }, { type: 'CAS_SOCIAL' }],
      },
      include: {
        dispensation: {
          select: {
            ordonnance: { select: { numero: true } },
            consultation: {
              select: {
                patient: { select: { nom: true, prenom: true, code: true, telephone: true } },
                passage: { select: { numeroOrdre: true } },
              },
            },
            ordonnanceExterne: {
              select: {
                numero: true,
                patient: { select: { nom: true, prenom: true, code: true, telephone: true } },
              },
            },
          },
        },
        caissier: { select: { personnel: { select: { nom: true, prenom: true } } } },
        assurance: { select: { libelle: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    const lignes = paiements.map((p) => ({
      id: p.id,
      type: p.type,
      numeroRecu: p.numeroRecu,
      createdAt: p.createdAt,
      motif: p.motif,
      montantTotal: N(p.montantTotal),
      montantAssurance: N(p.montantAssurance),
      montantPatient: N(p.montantPatient ?? 0),
      assurance: p.assurance?.libelle ?? null,
      numeroOrdonnance:
        p.dispensation.ordonnance?.numero ?? p.dispensation.ordonnanceExterne?.numero ?? null,
      externe: !!p.dispensation.ordonnanceExterne,
      numeroOrdre: p.dispensation.consultation?.passage.numeroOrdre ?? null,
      // Crédit / cas social externes : toujours un patient assuré (jamais un client de passage)
      patient: p.dispensation.consultation?.patient ?? p.dispensation.ordonnanceExterne?.patient!,
      par: p.caissier?.personnel ? `${p.caissier.personnel.nom} ${p.caissier.personnel.prenom}` : '—',
    }));
    const credits = lignes.filter((l) => l.type === 'CREDIT');
    return {
      credits,
      casSociaux: lignes.filter((l) => l.type === 'CAS_SOCIAL'),
      totalCredits: credits.reduce((s, l) => s + l.montantPatient, 0),
    };
  }

  /** Encaissement d'un crédit pharmacie (le patient revient payer sa part). */
  async reglerCredit(paiementId: number, modePaiement: string) {
    const paiement = await this.prisma.pharmaciePaiement.findUnique({ where: { id: paiementId } });
    if (!paiement) throw new NotFoundException('Paiement introuvable.');
    if (paiement.type !== 'CREDIT' || paiement.statut !== 'VALIDE') {
      throw new BadRequestException("Ce reçu n'est pas un crédit en cours.");
    }
    if (paiement.regleLe) throw new BadRequestException('Ce crédit est déjà réglé.');
    const maj = await this.prisma.pharmaciePaiement.update({
      where: { id: paiementId },
      data: {
        montantEncaisse: paiement.montantPatient ?? paiement.montantTotal,
        modePaiement: modePaiement || 'ESPECES',
        regleLe: new Date(),
      },
    });
    return { ...maj, montantTotal: N(maj.montantTotal), montantEncaisse: N(maj.montantEncaisse) };
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
    // Tracé même sans écart : la fiche d'inventaire liste tout ce qui a été compté
    await this.prisma.mouvementStock.create({
      data: {
        medicamentId: dto.medicamentId,
        type: 'INVENTAIRE',
        quantite: ecart,
        stockAvant: medicament.stock,
        stockApres: dto.quantiteReelle,
        reference: 'Inventaire',
        utilisateurId,
        commentaire: dto.commentaire,
      },
    });
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

  /**
   * Corrections constatées pendant l'inventaire : numéro de lot et date de péremption
   * lus sur la boîte. Renvoie les données à enregistrer et le texte tracé dans le mouvement.
   */
  private correctionLot(
    lot: { numeroLot: string; datePeremption: Date },
    correction: { numeroLot?: string; datePeremption?: string },
  ) {
    const data: { numeroLot?: string; datePeremption?: Date } = {};
    const notes: string[] = [];
    const numero = correction.numeroLot?.trim();
    if (correction.numeroLot !== undefined && !numero) {
      throw new BadRequestException('Le numéro de lot ne peut pas être vide.');
    }
    if (numero && numero !== lot.numeroLot) {
      data.numeroLot = numero;
      notes.push(`N° de lot : ${lot.numeroLot} → ${numero}`);
    }
    if (correction.datePeremption) {
      const date = new Date(`${correction.datePeremption.slice(0, 10)}T00:00:00Z`);
      if (isNaN(date.getTime())) throw new BadRequestException('Date de péremption invalide.');
      const avant = lot.datePeremption.toISOString().slice(0, 10);
      const apres = date.toISOString().slice(0, 10);
      if (apres !== avant) {
        data.datePeremption = date;
        const jour = (iso: string) => iso.split('-').reverse().join('/');
        notes.push(`Péremption : ${jour(avant)} → ${jour(apres)}`);
      }
    }
    return { data, note: notes.join(' ; ') };
  }

  /** Inventaire PAR LOT : le stock réel saisi devient le stock du lot (n° de lot et péremption corrigeables). */
  async inventaireLot(
    lotId: number,
    quantiteReelle: number,
    commentaire: string | undefined,
    utilisateurId: number,
    correction: { numeroLot?: string; datePeremption?: string } = {},
  ) {
    const lot = await this.prisma.lot.findUnique({ where: { id: lotId } });
    if (!lot) throw new NotFoundException('Lot introuvable.');
    const { data: corrige, note } = this.correctionLot(lot, correction);
    const ecart = quantiteReelle - lot.quantiteRestante;
    // Tracé même sans écart : la fiche d'inventaire liste tout ce qui a été compté
    await this.prisma.mouvementStock.create({
      data: {
        medicamentId: lot.medicamentId,
        type: 'INVENTAIRE',
        quantite: ecart,
        stockAvant: lot.quantiteRestante,
        stockApres: quantiteReelle,
        lotId,
        reference: `Inventaire lot ${corrige.numeroLot ?? lot.numeroLot}`,
        utilisateurId,
        commentaire: [commentaire, note].filter(Boolean).join(' ; ') || undefined,
      },
    });
    await this.prisma.lot.update({
      where: { id: lotId },
      data: { quantiteRestante: quantiteReelle, ...corrige },
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
    lignes: { lotId: number; quantiteReelle: number; numeroLot?: string; datePeremption?: string }[],
    utilisateurId: number,
  ) {
    let ajustes = 0;
    const medicaments = new Set<number>();
    for (const l of lignes) {
      const lot = await this.prisma.lot.findUnique({ where: { id: l.lotId } });
      if (!lot) continue;
      const { data: corrige, note } = this.correctionLot(lot, l);
      const quantiteReelle = Number(l.quantiteReelle) || 0;
      const ecart = quantiteReelle - lot.quantiteRestante;
      // Tracé même sans écart : la fiche d'inventaire liste tout ce qui a été compté
      await this.prisma.mouvementStock.create({
        data: {
          medicamentId: lot.medicamentId,
          type: 'INVENTAIRE',
          quantite: ecart,
          stockAvant: lot.quantiteRestante,
          stockApres: quantiteReelle,
          lotId: lot.id,
          reference: `Inventaire lot ${corrige.numeroLot ?? lot.numeroLot}`,
          utilisateurId,
          commentaire: note || undefined,
        },
      });
      if (ecart !== 0 || note) {
        await this.prisma.lot.update({
          where: { id: lot.id },
          data: { quantiteRestante: quantiteReelle, ...corrige },
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

  /**
   * Fiche d'inventaire : tout ce qui a été compté sur la période (un jour par
   * défaut), avec stock théorique, stock réel, écart et valeur de l'écart.
   */
  async ficheInventaire(cliniqueId: number, debut?: string, fin?: string) {
    const jourDebut = debut
      ? new Date(`${debut}T00:00:00`)
      : new Date(new Date().setHours(0, 0, 0, 0));
    const dernierJour = fin ?? debut;
    const jourFin = dernierJour
      ? new Date(`${dernierJour}T23:59:59.999`)
      : new Date(new Date().setHours(23, 59, 59, 999));
    const mouvements = await this.prisma.mouvementStock.findMany({
      where: {
        type: 'INVENTAIRE',
        medicament: { cliniqueId },
        createdAt: { gte: jourDebut, lte: jourFin },
      },
      include: {
        medicament: { select: { nom: true, dosage: true, forme: true, prixVente: true } },
        lot: { select: { numeroLot: true, datePeremption: true, prixAchat: true } },
        utilisateur: {
          select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
        },
      },
      orderBy: [{ medicament: { nom: 'asc' } }, { createdAt: 'asc' }],
    });
    const lignes = mouvements.map((m) => {
      const prix = Number(m.lot?.prixAchat ?? m.medicament.prixVente ?? 0);
      return {
        id: m.id,
        date: m.createdAt,
        medicament: `${m.medicament.nom} ${m.medicament.dosage ?? ''}`.trim(),
        forme: m.medicament.forme,
        lot: m.lot?.numeroLot ?? '—',
        peremption: m.lot?.datePeremption ?? null,
        stockAvant: m.stockAvant,
        stockApres: m.stockApres,
        ecart: m.quantite,
        prixUnitaire: prix,
        valeurEcart: m.quantite * prix,
        par: m.utilisateur?.personnel
          ? `${m.utilisateur.personnel.nom} ${m.utilisateur.personnel.prenom}`
          : 'Système',
        commentaire: m.commentaire ?? '',
      };
    });
    const avecEcart = lignes.filter((l) => l.ecart !== 0);
    return {
      lignes,
      resume: {
        lotsComptes: lignes.length,
        lotsAvecEcart: avecEcart.length,
        lotsConformes: lignes.length - avecEcart.length,
        manquants: avecEcart.filter((l) => l.ecart < 0).reduce((s, l) => s + l.ecart, 0),
        excedents: avecEcart.filter((l) => l.ecart > 0).reduce((s, l) => s + l.ecart, 0),
        valeurEcarts: lignes.reduce((s, l) => s + l.valeurEcart, 0),
        agents: [...new Set(lignes.map((l) => l.par))],
      },
    };
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
          ...dispensationsDeLaClinique(cliniqueId),
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
          ordonnanceExterne: {
            select: {
              numero: true,
              clientNom: true,
              patient: { select: { nom: true, prenom: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return ds.map((d) => {
        const ext = d.ordonnanceExterne;
        const patient = d.consultation?.passage?.patient ?? ext?.patient;
        return {
          date: d.createdAt,
          patient: patient
            ? `${patient.nom} ${patient.prenom}`.trim()
            : ext?.clientNom || 'Client de passage',
          // Ordonnance externe : son N° EXT-… tient lieu de N° d'ordre
          numeroOrdre: d.consultation?.passage?.numeroOrdre ?? ext?.numero ?? '—',
          montant: Number(d.montantTotal),
        };
      });
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
        where: {
          type: 'INVENTAIRE',
          quantite: { not: 0 },
          medicament: { cliniqueId },
          ...dansPeriode('createdAt'),
        },
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
        ...dispensationsDeLaClinique(cliniqueId),
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
