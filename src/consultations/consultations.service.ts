import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreerConsultationDto,
  PrescriptionDto,
} from './dto/consultation.dto';

const includeConsultation = {
  medicaments: true,
  medecin: {
    select: {
      matricule: true,
      personnel: { select: { nom: true, prenom: true } },
    },
  },
} satisfies Prisma.ConsultationInclude;

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Recherche d'un passage par code patient ou N° d'ordre (§7).
   * La consultation n'est possible que si le passage est ACTIF (code activé).
   */
  async rechercher(reference: string, cliniqueId: number) {
    const ref = reference.trim().toUpperCase();
    const refSansTiret = ref.replace(/[\s-]/g, '');
    if (!ref) return [];

    // 1. N° d'ordre (les tirets sont conservés pour la correspondance)
    let passage = await this.prisma.passage.findFirst({
      where: {
        cliniqueId,
        numeroOrdre: { contains: ref },
      },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Code patient → dernier passage
    if (!passage) {
      const patient = await this.prisma.patient.findFirst({
        where: { cliniqueId, code: refSansTiret },
      });
      if (patient) {
        passage = await this.prisma.passage.findFirst({
          where: { patientId: patient.id },
          include: {
            patient: true,
            service: { select: { id: true, code: true, nom: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    }
    if (!passage) return [];

    return [
      {
        id: passage.id,
        numeroOrdre: passage.numeroOrdre,
        statut: passage.statut,
        typePatient: passage.typePatient,
        createdAt: passage.createdAt,
        patient: passage.patient,
        service: passage.service,
        // Le code doit être activé (payé) pour consulter
        consultable: passage.statut === 'ACTIF',
      },
    ];
  }

  /** Détail d'un passage pour la consultation : accueil + prestations + historique. */
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
        consultations: { include: includeConsultation },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    // Historique médical du patient (consultations validées, tous passages)
    const historique = await this.prisma.consultation.findMany({
      where: { patientId: passage.patientId },
      include: {
        medicaments: true,
        medecin: {
          select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
          },
        },
        passage: {
          select: { numeroOrdre: true, createdAt: true, service: { select: { nom: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      passage: {
        id: passage.id,
        numeroOrdre: passage.numeroOrdre,
        statut: passage.statut,
        typePatient: passage.typePatient,
        createdAt: passage.createdAt,
        // Constantes récupérées automatiquement de l'accueil (§7)
        constantes: {
          taille: passage.taille,
          temperature: passage.temperature ? Number(passage.temperature) : null,
          pouls: passage.pouls,
          tensionGauche: passage.tensionGauche,
          tensionDroite: passage.tensionDroite,
          poids: passage.poids ? Number(passage.poids) : null,
        },
        patient: passage.patient,
        service: passage.service,
        prestations: passage.prestations.map((l) => ({
          ...l,
          montant: Number(l.montant),
        })),
        consultation: passage.consultations[0] ?? null,
      },
      historique,
    };
  }

  /**
   * Crée ou met à jour la consultation du passage (une consultation par passage).
   * Vérifie l'activation du code (§7) : le passage doit être ACTIF.
   */
  async creerOuMaj(passageId: number, medecinId: number, dto: CreerConsultationDto) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    if (passage.statut !== 'ACTIF') {
      throw new BadRequestException(
        'Ce passage n\'est pas activé : le paiement à la caisse est requis avant la consultation.',
      );
    }

    return this.prisma.consultation.upsert({
      where: { passageId },
      update: dto,
      create: {
        passageId,
        patientId: passage.patientId,
        medecinId,
        ...dto,
      },
      include: includeConsultation,
    });
  }

  /** Ajoute une prescription de médicament (catalogue ou saisie libre). */
  async ajouterMedicament(consultationId: number, dto: PrescriptionDto) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { passage: { select: { typePatient: true } } },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');

    // Règles selon le type de patient :
    // - INTERNE : catalogue uniquement si stock > 0 ; la saisie libre reste permise.
    // - EXTERNE : catalogue complet (même en rupture) + saisie libre.
    const estInterne = consultation.passage.typePatient !== 'EXTERNE';

    let nom = dto.nom?.trim();
    let forme = dto.forme;
    let medicamentId = dto.medicamentId;
    if (dto.medicamentId) {
      const medicament = await this.prisma.medicament.findUnique({
        where: { id: dto.medicamentId },
      });
      if (!medicament) throw new BadRequestException('Médicament introuvable.');
      if (estInterne && medicament.stock <= 0) {
        throw new BadRequestException(
          `« ${medicament.nom} » est en rupture de stock : prescription impossible pour un patient interne.`,
        );
      }
      nom = medicament.nom;
      forme = medicament.forme ?? dto.forme;
      medicamentId = medicament.id;
    }
    if (!nom) throw new BadRequestException('Nom du médicament requis.');

    return this.prisma.prescription.create({
      data: {
        consultationId,
        medicamentId,
        medicamentNom: nom,
        forme,
        posologie: dto.posologie,
        quantite: dto.quantite,
        duree: dto.duree,
      },
    });
  }

  async retirerMedicament(prescriptionId: number) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });
    if (!prescription) throw new NotFoundException('Prescription introuvable.');
    return this.prisma.prescription.delete({ where: { id: prescriptionId } });
  }

  /**
   * Prescription d'examens : les lignes NON_PRESCRITE du passage deviennent
   * EN_ATTENTE (payables à la caisse, §6.1 « pas encore prescrite »).
   */
  async prescrireExamens(consultationId: number, lignesIds: number[]) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');

    const lignes = await this.prisma.passagePrestation.findMany({
      where: {
        id: { in: lignesIds },
        passageId: consultation.passageId,
        statut: 'NON_PRESCRITE',
      },
    });
    if (lignes.length !== lignesIds.length) {
      throw new BadRequestException(
        'Certaines prestations ne peuvent pas être prescrites (déjà payées ou inexistantes).',
      );
    }
    await this.prisma.passagePrestation.updateMany({
      where: { id: { in: lignesIds } },
      data: { statut: 'EN_ATTENTE' },
    });
    return this.prisma.passagePrestation.findMany({
      where: { id: { in: lignesIds } },
    });
  }

  /** Retire une prescription d'examen (la ligne redevient NON_PRESCRITE). */
  async retirerExamen(ligneId: number) {
    const ligne = await this.prisma.passagePrestation.findUnique({
      where: { id: ligneId },
    });
    if (!ligne) throw new NotFoundException('Ligne introuvable.');
    if (ligne.statut !== 'EN_ATTENTE') {
      throw new BadRequestException(
        'Cette prestation est déjà payée : impossible de retirer la prescription.',
      );
    }
    return this.prisma.passagePrestation.update({
      where: { id: ligneId },
      data: { statut: 'NON_PRESCRITE' },
    });
  }

  /** Sauvegarde explicite de l'ordonnance (horodatée, traçable). */
  async sauvegarderOrdonnance(consultationId: number) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');
    return this.prisma.consultation.update({
      where: { id: consultationId },
      data: { ordonnanceSauveeLe: new Date() },
      include: includeConsultation,
    });
  }

  /** Validation de la consultation (§7). */
  async valider(consultationId: number) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');
    return this.prisma.consultation.update({
      where: { id: consultationId },
      data: { statut: 'VALIDEE', valideeLe: new Date() },
      include: includeConsultation,
    });
  }
}
