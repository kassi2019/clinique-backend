import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
import { AffectationService } from '../affectation/affectation.service';
import { AssurancesService } from '../assurances/assurances.service';
import { EncaisserDto } from './dto/encaisser.dto';
import { critereNomPrenoms } from '../common/recherche-patient';

const formatMontant = (x: any) => Number(x);

@Injectable()
export class CaisseService {
  private readonly logger = new Logger(CaisseService.name);

  constructor(
    private prisma: PrismaService,
    private impressionService: ImpressionService,
    private affectationService: AffectationService,
    private assurancesService: AssurancesService,
  ) {}

  /**
   * Recherche unique de la caisse (§6.1) : code patient, nom, prénom
   * ou N° d'ordre — renvoie les passages correspondants (les plus récents).
   */
  async rechercher(search: string, cliniqueId: number) {
    if (!search || search.trim().length < 2) return [];
    const s = search.trim().toUpperCase();
    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        OR: [
          { numeroOrdre: { contains: s } },
          { patient: { is: critereNomPrenoms(s) } },
          { patient: { is: { code: { contains: s } } } },
        ],
      },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return passages.map((p) => ({
      id: p.id,
      numeroOrdre: p.numeroOrdre,
      statut: p.statut,
      createdAt: p.createdAt,
      patient: p.patient,
      service: p.service,
    }));
  }

  /** Détail d'un passage : fiche patient, prestations et historique des paiements. */
  async detailPassage(passageId: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
        prestations: {
          include: { service: { select: { nom: true } } },
          orderBy: { createdAt: 'asc' },
        },
        paiements: {
          include: {
            lignes: true,
            caissier: {
              select: {
                matricule: true,
                personnel: { select: { nom: true, prenom: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    // Assurance du patient : rattachement actif (affiché en bandeau à la caisse)
    const rattachement = await this.assurancesService.couvertureActiveDuPatient(
      passage.patientId,
    );

    // Couverture assurance du patient : taux applicable par ligne
    const lignes = passage.prestations;
    const couvertures: Record<number, any> = {};
    for (const l of lignes) {
      if (l.statut === 'EN_ATTENTE' && l.prestationId) {
        const couv = await this.assurancesService.tauxApplicable(
          passage.patientId,
          l.prestationId,
        );
        if (couv) couvertures[l.id] = couv;
      }
    }

    return {
      ...passage,
      assurancePatient: rattachement
        ? {
            assurance: {
              code: rattachement.assurance.code,
              libelle: rattachement.assurance.libelle,
            },
            formule: {
              code: rattachement.formule.code,
              libelle: rattachement.formule.libelle,
            },
            numeroAssure: rattachement.numeroAssure,
            typeBeneficiaire: rattachement.typeBeneficiaire,
          }
        : null,
      prestations: passage.prestations.map((l) => {
        const couv = couvertures[l.id];
        const montant = formatMontant(l.montant);
        let partAssurance = 0;
        let partPatient = montant;
        if (couv) {
          partAssurance = Math.round((montant * couv.taux) / 100);
          if (couv.plafond != null) partAssurance = Math.min(partAssurance, couv.plafond);
          partPatient = Math.max(0, montant - partAssurance);
        }
        return {
          ...l,
          montant,
          couverture: couv
            ? { ...couv, partAssurance, partPatient }
            : null,
        };
      }),
      paiements: passage.paiements.map((p) => ({
        ...p,
        montantTotal: formatMontant(p.montantTotal),
        partAssurance: p.partAssurance ? formatMontant(p.partAssurance) : null,
        partPatient: p.partPatient ? formatMontant(p.partPatient) : null,
        lignes: p.lignes.map((l) => ({ ...l, montant: formatMontant(l.montant) })),
      })),
    };
  }

  /** Ajout manuel d'une prestation à régler (§6.1). */
  async ajouterPrestation(passageId: number, prestationId: number, utilisateurId?: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    const prestation = await this.prisma.prestation.findUnique({
      where: { id: prestationId },
    });
    if (!prestation || !prestation.actif) {
      throw new BadRequestException('Prestation introuvable ou inactive.');
    }

    const ligne = await this.prisma.passagePrestation.create({
      data: {
        passageId,
        prestationId: prestation.id,
        libelle: prestation.libelle,
        montant: prestation.montant,
        serviceId: prestation.serviceId,
        agentId: utilisateurId ?? null,
        source: 'MANUEL',
      },
    });
    return { ...ligne, montant: formatMontant(ligne.montant) };
  }

  /** Retire une prestation non encore payée. */
  async retirerPrestation(ligneId: number) {
    const ligne = await this.prisma.passagePrestation.findUnique({
      where: { id: ligneId },
    });
    if (!ligne) throw new NotFoundException('Ligne introuvable.');
    if (ligne.statut !== 'EN_ATTENTE') {
      throw new BadRequestException('Cette prestation est déjà payée.');
    }
    return this.prisma.passagePrestation.delete({ where: { id: ligneId } });
  }

  /**
   * Encaissement des prestations cochées (§6.1) :
   * reçu numéroté, lignes marquées payées, passage activé, reçu imprimé.
   */
  /** Détail complet d'un paiement — données du reçu A4 (clinique, patient, lignes, caissier). */
  async detailPaiement(paiementId: number) {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id: paiementId },
      include: {
        passage: { include: { patient: true } },
        clinique: true,
        caissier: {
          select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
          },
        },
        lignes: true,
      },
    });
    if (!paiement) throw new NotFoundException('Paiement introuvable.');
    return {
      ...paiement,
      montantTotal: formatMontant(paiement.montantTotal),
      partAssurance: paiement.partAssurance != null ? formatMontant(paiement.partAssurance) : null,
      partPatient: paiement.partPatient != null ? formatMontant(paiement.partPatient) : null,
      lignes: paiement.lignes.map((l) => ({ ...l, montant: formatMontant(l.montant) })),
    };
  }

  async encaisser(passageId: number, dto: EncaisserDto, utilisateurId: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: {
        patient: true,
        service: { select: { nom: true } },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    const lignes = await this.prisma.passagePrestation.findMany({
      where: {
        id: { in: dto.lignesIds },
        passageId,
        // EN_ATTENTE : paiement normal ; CREDIT : règlement d'un ticket de crédit
        statut: { in: ['EN_ATTENTE', 'CREDIT'] },
      },
    });
    if (lignes.length !== dto.lignesIds.length) {
      throw new BadRequestException(
        'Certaines prestations sont déjà payées ou inexistantes.',
      );
    }

    const montantTotal = lignes.reduce(
      (somme, l) => somme + Number(l.montant),
      0,
    );

    // Assurance : validation AVANT tout paiement (sinon les lignes seraient
    // déjà payées quand l'erreur est levée).
    if (dto.tauxApplique != null && !dto.motifTaux) {
      throw new BadRequestException(
        'Indiquez le motif de la modification exceptionnelle du taux.',
      );
    }

    // Numéro de reçu unique par clinique : R<année>-<séquence>
    const annee = new Date().getFullYear();
    const nb = await this.prisma.paiement.count({
      where: {
        cliniqueId: passage.cliniqueId,
        numeroRecu: { contains: `R${annee}-` },
      },
    });
    const numeroRecu = `R${annee}-${String(nb + 1).padStart(5, '0')}`;

    const paiement = await this.prisma.paiement.create({
      data: {
        cliniqueId: passage.cliniqueId,
        passageId: passage.id,
        caissierId: utilisateurId,
        numeroRecu,
        montantTotal,
        modePaiement: dto.modePaiement,
      },
    });

    await this.prisma.passagePrestation.updateMany({
      where: { id: { in: lignes.map((l) => l.id) } },
      data: { statut: 'PAYEE', paiementId: paiement.id, creditId: null },
    });

    // Soldé automatique des tickets de crédit entièrement réglés
    const ticketsIds = [...new Set(lignes.map((l) => l.creditId).filter(Boolean))] as number[];
    for (const tid of ticketsIds) {
      const reste = await this.prisma.passagePrestation.count({
        where: { creditId: tid, statut: 'CREDIT' },
      });
      if (reste === 0) {
        await this.prisma.creditTicket.update({
          where: { id: tid },
          data: { statut: 'SOLDEE' },
        });
      }
    }

    // ── Assurance : prises en charge par ligne + parts sur le paiement ──
    let partAssurance = 0;
    let partPatient = montantTotal;
    let assuranceInfo: any = null;
    for (const l of lignes) {
      if (!l.prestationId) continue;
      const couv = await this.assurancesService.tauxApplicable(
        passage.patientId,
        l.prestationId,
      );
      if (!couv) continue;
      if (!assuranceInfo) assuranceInfo = couv;
      const tauxApplique = dto.tauxApplique ?? couv.taux;
      let montantAss = Math.round((Number(l.montant) * tauxApplique) / 100);
      if (couv.plafond != null) montantAss = Math.min(montantAss, couv.plafond);
      const montantPat = Math.max(0, Number(l.montant) - montantAss);
      partAssurance += montantAss;
      partPatient -= montantAss;
      await this.prisma.priseEnCharge.create({
        data: {
          paiementId: paiement.id,
          ligneId: l.id,
          assuranceId: couv.assurance.id,
          formuleId: couv.formule.id,
          tauxParametre: couv.taux,
          tauxApplique,
          montantTotal: l.montant,
          montantAssurance: montantAss,
          montantPatient: montantPat,
          motifModification: dto.motifTaux ?? null,
          utilisateurId,
        },
      });
    }
    if (assuranceInfo) {
      await this.prisma.paiement.update({
        where: { id: paiement.id },
        data: {
          assuranceId: assuranceInfo.assurance.id,
          formuleLibelle: `${assuranceInfo.assurance.libelle} — ${assuranceInfo.formule.libelle}`,
          tauxParametre: assuranceInfo.taux,
          tauxApplique: dto.tauxApplique ?? assuranceInfo.taux,
          partAssurance,
          partPatient: Math.max(0, partPatient),
          motifTaux: dto.motifTaux ?? null,
        },
      });
    }

    // Activation automatique des actes après règlement (§6.2)
    await this.prisma.passage.update({
      where: { id: passage.id },
      data: { statut: 'ACTIF' },
    });

    // Affectation automatique au médecin quand la consultation est payée
    // (nouveau cahier des charges : file d'attente équilibrée).
    const consultationPayee = await this.prisma.passagePrestation.findFirst({
      where: {
        id: { in: lignes.map((l) => l.id) },
        prestation: { type: 'CONSULTATION' },
      },
    });
    if (consultationPayee) {
      try {
        await this.affectationService.assignerPassage(passage.id);
      } catch (err: any) {
        this.logger.warn(`Affectation auto #${passage.id}: ${err.message}`);
      }
    }

    // Impression automatique du reçu si activée (PRINTER_AUTO_PRINT)
    let impression = null;
    if ((await this.impressionService.getConfigPoste(passage.cliniqueId, 'RECU')).autoPrint) {
      try {
        impression = await this.impressionService.imprimerRecuPaiement(
          paiement.id,
        );
        if (!impression.ok) {
          this.logger.warn(
            `Impression auto reçu #${paiement.id}: ${impression.message}`,
          );
        }
      } catch (err: any) {
        this.logger.error(`Erreur impression auto reçu #${paiement.id}: ${err.message}`);
      }
    }

    return {
      paiement: {
        ...paiement,
        montantTotal: formatMontant(paiement.montantTotal),
      },
      lignes: lignes.map((l) => ({
        id: l.id,
        libelle: l.libelle,
        montant: formatMontant(l.montant),
      })),
      passage: {
        id: passage.id,
        statut: 'ACTIF',
        numeroOrdre: passage.numeroOrdre,
      },
      patient: {
        nom: passage.patient?.nom ?? '',
        prenom: passage.patient?.prenom ?? '',
        code: passage.patient?.code ?? '',
      },
      impression,
    };
  }

  /** Annulation d'un paiement (droits administrateur) : les prestations reviennent en attente. */
  /**
   * File de la caisse : passages ayant des prestations à payer,
   * dans l'ordre d'arrivée. Données du jour par défaut (vide = tout).
   */
  async fileAttente(cliniqueId: number, page = 1, perPage = 100, jour?: string) {
    const where: any = { cliniqueId, prestations: { some: { statut: 'EN_ATTENTE' } } };
    if (jour) {
      const debut = new Date(`${jour}T00:00:00`);
      const fin = new Date(`${jour}T23:59:59.999`);
      where.createdAt = { gte: debut, lte: fin };
    }
    const passages = await this.prisma.passage.findMany({
      where,
      include: {
        patient: { select: { nom: true, prenom: true, code: true } },
        service: { select: { nom: true } },
        prestations: { where: { statut: 'EN_ATTENTE' }, select: { montant: true } },
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });
    const total = await this.prisma.passage.count({ where });
    const data = passages.map((p) => ({
      id: p.id,
      numeroOrdre: p.numeroOrdre,
      patient: p.patient,
      service: p.service,
      totalAPayer: p.prestations.reduce((s, l) => s + Number(l.montant), 0),
      nbLignes: p.prestations.length,
    }));
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }

  /** Paiements valides du jour (reçus émis). */
  async payesDuJour(cliniqueId: number, page = 1, perPage = 100) {
    const debut = new Date();
    debut.setHours(0, 0, 0, 0);
    const [paiements, total] = await this.prisma.$transaction([
      this.prisma.paiement.findMany({
        where: { cliniqueId, statut: 'VALIDE', createdAt: { gte: debut } },
        include: {
          passage: {
            select: {
              numeroOrdre: true,
              patient: { select: { nom: true, prenom: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.paiement.count({
        where: { cliniqueId, statut: 'VALIDE', createdAt: { gte: debut } },
      }),
    ]);
    const data = paiements.map((p) => ({
      id: p.id,
      numeroRecu: p.numeroRecu,
      modePaiement: p.modePaiement,
      montant: Number(p.montantTotal),
      createdAt: p.createdAt,
      numeroOrdre: p.passage.numeroOrdre,
      patient: p.passage.patient,
    }));
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }

  async annulerPaiement(paiementId: number, motif: string) {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id: paiementId },
    });
    if (!paiement) throw new NotFoundException('Paiement introuvable.');
    if (paiement.statut === 'ANNULE') {
      throw new BadRequestException('Ce paiement est déjà annulé.');
    }

    await this.prisma.paiement.update({
      where: { id: paiementId },
      data: {
        statut: 'ANNULE',
        motifAnnulation: motif,
        dateAnnulation: new Date(),
      },
    });
    await this.prisma.passagePrestation.updateMany({
      where: { paiementId },
      data: { statut: 'EN_ATTENTE', paiementId: null },
    });

    // Le passage redevient en attente de paiement s'il n'a plus de paiement valide
    const valides = await this.prisma.paiement.count({
      where: { passageId: paiement.passageId, statut: 'VALIDE' },
    });
    if (valides === 0) {
      await this.prisma.passage.update({
        where: { id: paiement.passageId },
        data: { statut: 'EN_ATTENTE_PAIEMENT' },
      });
    }

    // Si la consultation n'a pas été validée, l'affectation est annulée
    const consultation = await this.prisma.consultation.findUnique({
      where: { passageId: paiement.passageId },
    });
    if (!consultation || consultation.statut !== 'VALIDEE') {
      await this.affectationService.annulerAffectation(paiement.passageId);
    }

    return this.prisma.paiement.findUnique({ where: { id: paiementId } });
  }

  // ─────────────────── Tickets de crédit / cas sociaux ───────────────────
  // Prise en charge sans paiement immédiat : le ticket active le passage
  // (statut ACTIF) pour que les services puissent travailler ; la dette est
  // suivie à la caisse (crédit remboursable) ou marquée cas social.

  /** Crée un ticket de crédit (remboursable) ou cas social sur des lignes EN_ATTENTE. */
  async creerCredit(
    passageId: number,
    dto: { lignesIds: number[]; type: 'CREDIT' | 'CAS_SOCIAL'; motif?: string },
    utilisateurId: number,
  ) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    const lignes = await this.prisma.passagePrestation.findMany({
      where: { id: { in: dto.lignesIds }, passageId, statut: 'EN_ATTENTE' },
    });
    if (lignes.length !== dto.lignesIds.length) {
      throw new BadRequestException('Certaines prestations ne sont pas en attente de paiement.');
    }
    const montantTotal = lignes.reduce((s, l) => s + Number(l.montant), 0);

    // Numéro de ticket par type : CRE-0001… (crédit) ou SOC-0001… (cas social)
    const prefixe = dto.type === 'CAS_SOCIAL' ? 'SOC' : 'CRE';
    const nb = await this.prisma.creditTicket.count({
      where: { cliniqueId: passage.cliniqueId, numero: { contains: `${prefixe}-` } },
    });
    const numero = `${prefixe}-${String(nb + 1).padStart(4, '0')}`;

    const ticket = await this.prisma.creditTicket.create({
      data: {
        cliniqueId: passage.cliniqueId,
        passageId,
        numero,
        type: dto.type,
        motif: dto.motif,
        montantTotal,
        agentId: utilisateurId,
      },
    });

    await this.prisma.passagePrestation.updateMany({
      where: { id: { in: lignes.map((l) => l.id) } },
      data: { statut: dto.type, creditId: ticket.id },
    });

    // Prise en charge : le passage est activé pour les services
    await this.prisma.passage.update({
      where: { id: passage.id },
      data: { statut: 'ACTIF' },
    });

    // Comme pour un paiement : consultation prise en charge → file du médecin
    const consultationPriseEnCharge = await this.prisma.passagePrestation.findFirst({
      where: {
        id: { in: lignes.map((l) => l.id) },
        prestation: { type: 'CONSULTATION' },
      },
    });
    if (consultationPriseEnCharge) {
      try {
        await this.affectationService.assignerPassage(passage.id);
      } catch (err: any) {
        this.logger.warn(`Affectation auto #${passage.id}: ${err.message}`);
      }
    }

    return ticket;
  }

  /** Tickets en cours (impayés) de la clinique, paginés. */
  async credits(cliniqueId: number, page = 1, perPage = 20) {
    const where = { cliniqueId, statut: 'EN_COURS' };
    const [data, total] = await Promise.all([
      this.prisma.creditTicket.findMany({
        where,
        include: {
          passage: {
            select: {
              numeroOrdre: true,
              patient: { select: { nom: true, prenom: true, code: true } },
            },
          },
          agent: {
            select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
          },
          lignes: { select: { libelle: true, montant: true, statut: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.creditTicket.count({ where }),
    ]);
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }

  /** Annule un ticket : les lignes repassent EN_ATTENTE, le ticket devient ANNULEE. */
  async annulerCredit(id: number) {
    const ticket = await this.prisma.creditTicket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket introuvable.');
    if (ticket.statut !== 'EN_COURS') {
      throw new BadRequestException('Seul un ticket en cours peut être annulé.');
    }
    await this.prisma.passagePrestation.updateMany({
      where: { creditId: id, statut: { in: ['CREDIT', 'CAS_SOCIAL'] } },
      data: { statut: 'EN_ATTENTE', creditId: null },
    });

    // Plus aucune consultation réglée ou prise en charge et non validée → retrait de la file
    const consultationCouverte = await this.prisma.passagePrestation.count({
      where: {
        passageId: ticket.passageId,
        prestation: { type: 'CONSULTATION' },
        statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
      },
    });
    const consultation = await this.prisma.consultation.findUnique({
      where: { passageId: ticket.passageId },
    });
    if (consultationCouverte === 0 && consultation?.statut !== 'VALIDEE') {
      await this.affectationService.annulerAffectation(ticket.passageId);
    }

    return this.prisma.creditTicket.update({
      where: { id },
      data: { statut: 'ANNULEE' },
    });
  }
}
