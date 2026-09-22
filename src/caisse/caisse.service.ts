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
          { patient: { is: { nom: { contains: s } } } },
          { patient: { is: { prenom: { contains: s } } } },
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
  async ajouterPrestation(passageId: number, prestationId: number) {
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
        statut: 'EN_ATTENTE',
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
      data: { statut: 'PAYEE', paiementId: paiement.id },
    });

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
}
