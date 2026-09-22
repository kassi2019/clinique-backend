import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AffectationService } from '../affectation/affectation.service';
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
  constructor(
    private prisma: PrismaService,
    private affectationService: AffectationService,
  ) {}

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
          include: {
            service: { select: { id: true, code: true, nom: true } },
            prestation: { select: { type: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        // Réalisations par les services (état « déjà fait » de l'ordonnance d'examens)
        examensLabo: { select: { passagePrestationId: true, statut: true } },
        examensImagerie: { select: { passagePrestationId: true, statut: true } },
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
        examensLabo: passage.examensLabo,
        examensImagerie: passage.examensImagerie,
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

    // Données administratives → report sur la fiche patient
    if (dto.patient) {
      await this.prisma.patient.update({
        where: { id: passage.patientId },
        data: {
          profession: dto.patient.profession,
          nationalite: dto.patient.nationalite,
          scolarisation: dto.patient.scolarisation,
          statutConjugal: dto.patient.statutConjugal,
          typePopulation: dto.patient.typePopulation,
          populationsRisque: dto.patient.populationsRisque,
          protectionSociale: dto.patient.protectionSociale,
          residenceHabituelle: dto.patient.residenceHabituelle,
          residenceActuelle: dto.patient.residenceActuelle,
        },
      });
    }

    const { patient: _patient, moDebut, moFin, ...donnees } = dto;
    const consultation = await this.prisma.consultation.upsert({
      where: { passageId },
      update: {
        ...donnees,
        moDebut: moDebut ? new Date(moDebut) : undefined,
        moFin: moFin ? new Date(moFin) : undefined,
      },
      create: {
        passageId,
        patientId: passage.patientId,
        medecinId,
        ...donnees,
        moDebut: moDebut ? new Date(moDebut) : undefined,
        moFin: moFin ? new Date(moFin) : undefined,
      },
      include: includeConsultation,
    });

    // Facturation de l'hospitalisation à l'entrée (§13) : la ligne payable
    // est créée dès que le médecin valide la prescription (lit + jours).
    await this.synchroniserFactureHospitalisation(passage.cliniqueId, passageId, dto);

    return consultation;
  }

  /**
   * Ligne de caisse « Hospitalisation — N jours » : créée/mise à jour quand le
   * médecin prescrit l'hospitalisation (jours prévus × tarif de la chambre),
   * retirée si la prescription est annulée (tant qu'elle n'est pas payée).
   */
  private async synchroniserFactureHospitalisation(
    cliniqueId: number,
    passageId: number,
    dto: CreerConsultationDto,
  ) {
    if (dto.hospitalisation === true) {
      if (!dto.litId || dto.hospitalisationDureeJours == null || dto.hospitalisationDureeJours < 1) {
        return; // prescription incomplète : le médecin doit choisir le lit et la durée
      }
      const lit = await this.prisma.lit.findUnique({
        where: { id: dto.litId },
        include: { chambre: true },
      });
      if (!lit || !lit.actif) throw new BadRequestException('Lit introuvable ou désactivé.');

      let tarif = lit.chambre.tarifJournalier;
      if (!tarif) {
        const prestationHosp = await this.prisma.prestation.findFirst({
          where: {
            cliniqueId,
            type: 'HOSPITALISATION',
            actif: true,
            service: { code: 'HOS' },
          },
        });
        if (!prestationHosp) {
          throw new BadRequestException('Aucun tarif d\'hospitalisation paramétré.');
        }
        tarif = prestationHosp.montant;
      }

      const montant = tarif.mul(dto.hospitalisationDureeJours);
      const libelle = `Hospitalisation — ${dto.hospitalisationDureeJours} jour(s) — chambre ${lit.chambre.numero}`;
      const existante = await this.prisma.passagePrestation.findFirst({
        where: { passageId, statut: 'EN_ATTENTE', libelle: { startsWith: 'Hospitalisation —' } },
      });
      if (existante) {
        await this.prisma.passagePrestation.update({
          where: { id: existante.id },
          data: { libelle, montant },
        });
      } else {
        const serviceHos = await this.prisma.service.findFirst({
          where: { cliniqueId, code: 'HOS' },
        });
        await this.prisma.passagePrestation.create({
          data: {
            passageId,
            libelle,
            montant,
            serviceId: serviceHos?.id ?? null,
            source: 'PRESCRIPTION',
            statut: 'EN_ATTENTE',
          },
        });
      }
    } else if (dto.hospitalisation === false) {
      const existante = await this.prisma.passagePrestation.findFirst({
        where: { passageId, statut: 'EN_ATTENTE', libelle: { startsWith: 'Hospitalisation —' } },
      });
      if (existante) {
        await this.prisma.passagePrestation.delete({ where: { id: existante.id } });
      }
    }
  }

  /** Ajoute une prescription de médicament (catalogue ou saisie libre). */
  async ajouterMedicament(consultationId: number, dto: PrescriptionDto) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { passage: { select: { typePatient: true, cliniqueId: true } } },
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

    const prescription = await this.prisma.prescription.create({
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

    // Numéro d'ordonnance généré à la première prescription (ORD-XXXXX par clinique)
    if (!consultation.numeroOrdonnance) {
      const nb = await this.prisma.consultation.count({
        where: {
          numeroOrdonnance: { not: null },
          passage: { cliniqueId: consultation.passage.cliniqueId },
        },
      });
      await this.prisma.consultation.update({
        where: { id: consultationId },
        data: { numeroOrdonnance: `ORD-${String(nb + 1).padStart(5, '0')}` },
      });
    }

    return prescription;
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

  /**
   * Ajoute un examen à la prescription (§7) :
   * - depuis le catalogue (prestationId) → ligne EN_ATTENTE payable à la caisse ;
   * - en saisie libre (libelle) → examen réalisé hors clinique, non facturable (EXTERNE).
   */
  async ajouterExamen(
    consultationId: number,
    dto: { prestationId?: number; libelle?: string },
  ) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { passage: { include: { prestations: true } } },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');

    const libelleLibre = dto.libelle?.trim();

    // ── Saisie libre : examen hors clinique (non facturable) ──
    if (libelleLibre) {
      const doublon = consultation.passage.prestations.find(
        (l) =>
          l.prestationId === null &&
          l.source === 'PRESCRIPTION' &&
          l.statut === 'EXTERNE' &&
          l.libelle.toLowerCase() === libelleLibre.toLowerCase(),
      );
      if (doublon) {
        throw new BadRequestException('Cet examen libre est déjà prescrit.');
      }
      return this.prisma.passagePrestation.create({
        data: {
          passageId: consultation.passageId,
          libelle: libelleLibre,
          montant: 0,
          source: 'PRESCRIPTION',
          statut: 'EXTERNE', // non facturable à la caisse
        },
      });
    }

    // ── Catalogue ──
    if (!dto.prestationId) {
      throw new BadRequestException(
        'Choisissez un examen du catalogue ou saisissez un libellé.',
      );
    }
    const prestation = await this.prisma.prestation.findUnique({
      where: { id: dto.prestationId },
    });
    if (!prestation || !prestation.actif) {
      throw new BadRequestException('Prestation introuvable ou inactive.');
    }
    if (prestation.type === 'CONSULTATION') {
      throw new BadRequestException(
        'Une consultation ne peut pas être ajoutée comme examen.',
      );
    }

    // Ligne déjà présente sur le passage ?
    const existante = consultation.passage.prestations.find(
      (l) => l.prestationId === dto.prestationId,
    );
    if (existante) {
      if (existante.statut === 'EN_ATTENTE' || existante.statut === 'PAYEE') {
        throw new BadRequestException('Cet examen est déjà prescrit (ou payé).');
      }
      // NON_PRESCRITE → simple prescription
      return this.prisma.passagePrestation.update({
        where: { id: existante.id },
        data: { statut: 'EN_ATTENTE' },
      });
    }

    return this.prisma.passagePrestation.create({
      data: {
        passageId: consultation.passageId,
        prestationId: prestation.id,
        libelle: prestation.libelle,
        montant: prestation.montant,
        serviceId: prestation.serviceId,
        source: 'PRESCRIPTION',
        statut: 'EN_ATTENTE',
      },
    });
  }

  /** Retire une prescription d'examen (la ligne redevient NON_PRESCRITE). */
  async retirerExamen(ligneId: number) {
    const ligne = await this.prisma.passagePrestation.findUnique({
      where: { id: ligneId },
    });
    if (!ligne) throw new NotFoundException('Ligne introuvable.');
    const libreExterne = ligne.source === 'PRESCRIPTION' && ligne.statut === 'EXTERNE';
    if (ligne.statut !== 'EN_ATTENTE' && !libreExterne) {
      throw new BadRequestException(
        'Cette prestation est déjà payée : impossible de retirer la prescription.',
      );
    }
    // Ligne ajoutée par le médecin (catalogue ou saisie libre) : on la retire entièrement.
    if (ligne.source === 'PRESCRIPTION') {
      return this.prisma.passagePrestation.delete({ where: { id: ligneId } });
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

  // ─────────── Affectation automatique (file d'attente médecins) ───────────

  /** Change la disponibilité du médecin connecté ; DISPONIBLE → redistribution des non affectés. */
  async changerDisponibilite(utilisateurId: number, disponibilite: 'DISPONIBLE' | 'INDISPONIBLE') {
    const utilisateur = await this.prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: {
        disponibilite,
        derniereActivite: new Date(),
      },
      include: { personnel: { select: { cliniqueId: true } } },
    });
    if (disponibilite === 'DISPONIBLE' && utilisateur.personnel?.cliniqueId) {
      await this.affectationService.redistribuerNonAffectees(
        utilisateur.personnel.cliniqueId,
      );
    }
    return { disponibilite: utilisateur.disponibilite };
  }

  /**
   * Signal de vie du poste du médecin (appelé toutes les 60 s par le navigateur).
   * Au retour du poste, les patients non affectés sont redistribués.
   */
  async ping(utilisateurId: number) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: { personnel: { select: { cliniqueId: true } } },
    });
    if (!utilisateur) return { ok: false };
    await this.prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: { derniereActivite: new Date() },
    });
    if (
      utilisateur.disponibilite === 'DISPONIBLE' &&
      utilisateur.personnel?.cliniqueId
    ) {
      await this.affectationService.redistribuerNonAffectees(
        utilisateur.personnel.cliniqueId,
      );
    }
    return { ok: true };
  }

  /** File d'attente du médecin connecté : patients en attente + terminés (jour courant par défaut). */
  async maFile(utilisateurId: number, jour?: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: { personnel: { select: { cliniqueId: true } } },
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable.');

    const debut = jour ? new Date(`${jour}T00:00:00`) : new Date(new Date().setHours(0, 0, 0, 0));
    const fin = jour ? new Date(`${jour}T23:59:59.999`) : new Date(new Date().setHours(23, 59, 59, 999));

    const enAttente = await this.prisma.affectation.findMany({
      where: {
        medecinId: utilisateurId,
        statut: { in: ['EN_ATTENTE', 'EN_CONSULTATION'] },
        dateAffectation: { gte: debut, lte: fin },
      },
      include: {
        passage: {
          select: {
            id: true,
            numeroOrdre: true,
            createdAt: true,
            statut: true,
            patient: { select: { nom: true, prenom: true, code: true, age: true, sexe: true } },
            service: { select: { nom: true } },
          },
        },
      },
      orderBy: { dateAffectation: 'asc' },
    });

    const terminees = await this.prisma.affectation.findMany({
      where: {
        medecinId: utilisateurId,
        statut: 'TERMINE',
        updatedAt: { gte: debut, lte: fin },
      },
      include: {
        passage: {
          select: {
            id: true,
            numeroOrdre: true,
            patient: { select: { nom: true, prenom: true, code: true, age: true, sexe: true } },
            consultations: { select: { statut: true, valideeLe: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      disponibilite: utilisateur.disponibilite,
      enAttente,
      terminees,
    };
  }

  /** Le médecin ouvre un dossier de sa file : EN_ATTENTE → EN_CONSULTATION. */
  async ouvrirAffectation(affectationId: number) {
    const affectation = await this.prisma.affectation.findUnique({
      where: { id: affectationId },
    });
    if (!affectation) throw new NotFoundException('Affectation introuvable.');
    if (affectation.statut !== 'EN_ATTENTE') return affectation;
    return this.prisma.affectation.update({
      where: { id: affectationId },
      data: { statut: 'EN_CONSULTATION' },
    });
  }

  /** Le médecin quitte le dossier sans valider : EN_CONSULTATION → EN_ATTENTE. */
  async fermerAffectation(affectationId: number) {
    const affectation = await this.prisma.affectation.findUnique({
      where: { id: affectationId },
    });
    if (!affectation) throw new NotFoundException('Affectation introuvable.');
    if (affectation.statut !== 'EN_CONSULTATION') return affectation;
    return this.prisma.affectation.update({
      where: { id: affectationId },
      data: { statut: 'EN_ATTENTE' },
    });
  }

  /** Validation de la consultation (§7) : clôt aussi l'affectation (TERMINE). */
  async valider(consultationId: number) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');
    const resultat = await this.prisma.consultation.update({
      where: { id: consultationId },
      data: { statut: 'VALIDEE', valideeLe: new Date() },
      include: includeConsultation,
    });
    // Le patient passe dans « Consultations terminées »
    await this.prisma.affectation.updateMany({
      where: { passageId: consultation.passageId, statut: { in: ['EN_ATTENTE', 'EN_CONSULTATION'] } },
      data: { statut: 'TERMINE' },
    });
    return resultat;
  }
}
