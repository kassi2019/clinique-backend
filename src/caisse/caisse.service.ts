import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
import { EncaisserDto } from './dto/encaisser.dto';

const formatMontant = (x: any) => Number(x);

@Injectable()
export class CaisseService {
  private readonly logger = new Logger(CaisseService.name);

  constructor(
    private prisma: PrismaService,
    private impressionService: ImpressionService,
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
    return {
      ...passage,
      prestations: passage.prestations.map((l) => ({
        ...l,
        montant: formatMontant(l.montant),
      })),
      paiements: passage.paiements.map((p) => ({
        ...p,
        montantTotal: formatMontant(p.montantTotal),
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

    // Activation automatique des actes après règlement (§6.2)
    await this.prisma.passage.update({
      where: { id: passage.id },
      data: { statut: 'ACTIF' },
    });

    // Impression automatique du reçu si activée (PRINTER_AUTO_PRINT)
    let impression = null;
    if (this.impressionService.getConfig().autoPrint) {
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

    return this.prisma.paiement.findUnique({ where: { id: paiementId } });
  }
}
