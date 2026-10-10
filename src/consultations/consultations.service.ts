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
import { critereNomPrenoms } from '../common/recherche-patient';

/** Document joint à un examen hors clinique : tout sauf le contenu (chargé à la demande). */
const metaResultatExterne = {
  select: {
    id: true,
    nomFichier: true,
    typeMime: true,
    tailleOctets: true,
    dateExamen: true,
    lieu: true,
    conclusion: true,
    createdAt: true,
  },
} as const;

const includeConsultation = {
  medicaments: true,
  ordonnances: { orderBy: { id: 'asc' } },
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

    // Seuls les passages relevant de la consultation médicale (prestation de
    // type CONSULTATION) sont ouverts ici : une patiente maternité, labo,
    // imagerie ou soins se gère dans son propre module.
    const estConsultation = {
      prestations: { some: { prestation: { type: 'CONSULTATION' } } },
    };

    // 1. N° d'ordre (les tirets sont conservés pour la correspondance)
    let passage = await this.prisma.passage.findFirst({
      where: {
        cliniqueId,
        numeroOrdre: { contains: ref },
        ...estConsultation,
      },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Code patient → dernier passage de consultation
    if (!passage) {
      const patient = await this.prisma.patient.findFirst({
        where: { cliniqueId, code: refSansTiret },
      });
      if (patient) {
        passage = await this.prisma.passage.findFirst({
          where: { patientId: patient.id, ...estConsultation },
          include: {
            patient: true,
            service: { select: { id: true, code: true, nom: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    }

    // 3. Nom et/ou prénoms → derniers passages de consultation correspondants
    if (!passage) {
      const passages = await this.prisma.passage.findMany({
        where: { cliniqueId, patient: { is: critereNomPrenoms(ref) }, ...estConsultation },
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
        typePatient: p.typePatient,
        createdAt: p.createdAt,
        patient: p.patient,
        service: p.service,
        consultable: p.statut === 'ACTIF',
      }));
    }

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
            resultatExterne: metaResultatExterne,
          },
          orderBy: { createdAt: 'asc' },
        },
        // Réalisations par les services : le médecin doit voir non seulement
        // l'état (« déjà fait ») mais aussi les RÉSULTATS de chaque examen.
        examensLabo: {
          include: {
            lignes: true,
            validePar: {
              select: {
                matricule: true,
                personnel: { select: { nom: true, prenom: true } },
              },
            },
          },
        },
        examensImagerie: {
          include: {
            validePar: {
              select: {
                matricule: true,
                personnel: { select: { nom: true, prenom: true } },
              },
            },
          },
        },
        // Fiches d'échographie du passage : le médecin voit aussi les comptes
        // rendus détaillés établis par l'imagerie (texte complet + valeurs).
        fichesExamenImagerie: {
          select: {
            id: true,
            libelleType: true,
            texte: true,
            indication: true,
            prescripteur: true,
            createdAt: true,
            medecin: { select: { personnel: { select: { nom: true, prenom: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
        consultations: { include: includeConsultation },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    // Historique médical du patient (consultations validées, tous passages)
    // Enrichi : examens de laboratoire avec lignes + résultats, examens
    // d'imagerie et fiches d'échographie de chaque passage antérieur.
    const historique = await this.prisma.consultation.findMany({
      where: { patientId: passage.patientId },
      include: {
        medicaments: true,
        ordonnances: { orderBy: { id: 'asc' } },
        medecin: {
          select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
          },
        },
        passage: {
          select: {
            numeroOrdre: true,
            createdAt: true,
            // Constantes du passage : affichées dans le compte rendu de l'historique
            taille: true,
            temperature: true,
            pouls: true,
            tensionGauche: true,
            tensionDroite: true,
            poids: true,
            // Examens prescrits hors clinique (avec le document joint, s'il y en a un)
            // + tous les examens (labo / imagerie) prescrits sur ce passage, réalisés ou
            // non : l'historique montre aussi ce qui a été prescrit et pas encore fait.
            prestations: {
              where: {
                OR: [
                  { statut: 'EXTERNE' },
                  {
                    statut: { notIn: ['NON_PRESCRITE', 'ANNULEE'] },
                    prestation: { type: { in: ['EXAMEN_LABO', 'IMAGERIE'] } },
                  },
                ],
              },
              select: {
                id: true,
                libelle: true,
                statut: true,
                createdAt: true,
                prestation: { select: { type: true } },
                examenLabo: { select: { id: true } },
                examenImagerie: { select: { id: true } },
                resultatExterne: metaResultatExterne,
              },
              orderBy: { createdAt: 'asc' },
            },
            service: { select: { nom: true } },
            examensLabo: {
              include: {
                lignes: true,
                validePar: {
                  select: {
                    matricule: true,
                    personnel: { select: { nom: true, prenom: true } },
                  },
                },
              },
            },
            examensImagerie: {
              include: {
                validePar: {
                  select: {
                    matricule: true,
                    personnel: { select: { nom: true, prenom: true } },
                  },
                },
              },
            },
            fichesExamenImagerie: {
              select: {
                id: true,
                libelleType: true,
                texte: true,
                valeurs: true,
                createdAt: true,
              },
            },
          },
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
          perimetreBrachial: passage.perimetreBrachial,
          perimetreCranien: passage.perimetreCranien,
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
        fiches: passage.fichesExamenImagerie,
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
    // Une patiente maternité (ou labo/imagerie/soins) se gère dans son module :
    // la consultation médicale n'ouvre que les passages avec prestation CONSULTATION.
    const estConsultation = await this.prisma.passagePrestation.findFirst({
      where: { passageId, prestation: { type: 'CONSULTATION' } },
    });
    if (!estConsultation) {
      throw new BadRequestException(
        'Cette patiente ne relève pas de la consultation médicale : utilisez le module de son service (Maternité, Laboratoire, Imagerie, Soins…).',
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

    // « Autres examens » avant modification : sert à retirer ceux que le médecin décoche
    const precedente = await this.prisma.consultation.findUnique({
      where: { passageId },
      select: { autresExamens: true },
    });

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
    await this.synchroniserFactureHospitalisation(passage.cliniqueId, passageId, dto, medecinId);

    // « Autres examens » cochés → inscrits sur la prescription d'examens (labo / imagerie)
    await this.synchroniserAutresExamens(
      passageId,
      passage.cliniqueId,
      precedente?.autresExamens ?? null,
      consultation.autresExamens,
      medecinId,
    );

    // Tests cochés dans la fiche (TDR, CDIP, hémoglobine…) → inscrits sur l'ordonnance
    if (await this.synchroniserTestsOrdonnance(consultation, passage.cliniqueId)) {
      return this.prisma.consultation.findUnique({
        where: { id: consultation.id },
        include: includeConsultation,
      });
    }

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
    medecinId?: number,
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
            agentId: medecinId ?? null,
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

  /**
   * « Autres examens » de la fiche reportés automatiquement sur la prescription
   * d'examens, sans ressaisie :
   * - examen du catalogue (laboratoire / imagerie, même libellé) → ligne payable
   *   à la caisse, transmise ensuite au service ;
   * - examen absent du catalogue → ligne « hors clinique », non facturable ;
   * - examen décoché → ligne retirée tant qu'elle n'est pas payée.
   */
  private async synchroniserAutresExamens(
    passageId: number,
    cliniqueId: number,
    avant: string | null,
    apres: string | null,
    utilisateurId: number,
  ) {
    const separer = (t: string | null) =>
      (t ?? '')
        .split(';')
        .map((x) => x.trim())
        .filter(Boolean);
    const cle = (t: string) =>
      t
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/\s+/g, ' ')
        .trim();
    const voulus = separer(apres);
    const retires = separer(avant).filter((a) => !voulus.some((v) => cle(v) === cle(a)));
    if (voulus.length === 0 && retires.length === 0) return;

    const catalogue = await this.prisma.prestation.findMany({
      where: { cliniqueId, actif: true, type: { in: ['EXAMEN_LABO', 'IMAGERIE'] } },
    });
    const prestationDe = (libelle: string) => catalogue.find((c) => cle(c.libelle) === cle(libelle));
    const lignes = await this.prisma.passagePrestation.findMany({ where: { passageId } });
    const ligneDe = (libelle: string) => {
      const prestation = prestationDe(libelle);
      return prestation
        ? lignes.find((l) => l.prestationId === prestation.id)
        : lignes.find((l) => l.prestationId === null && cle(l.libelle) === cle(libelle));
    };

    for (const libelle of voulus) {
      const prestation = prestationDe(libelle);
      const ligne = ligneDe(libelle);
      if (ligne) {
        // Proposée à l'accueil mais pas encore prescrite → prescrite
        if (ligne.statut === 'NON_PRESCRITE') {
          await this.prisma.passagePrestation.update({
            where: { id: ligne.id },
            data: { statut: 'EN_ATTENTE' },
          });
        }
        continue;
      }
      await this.prisma.passagePrestation.create({
        data: prestation
          ? {
              passageId,
              prestationId: prestation.id,
              libelle: prestation.libelle,
              montant: prestation.montant,
              serviceId: prestation.serviceId,
              agentId: utilisateurId,
              source: 'PRESCRIPTION',
              statut: 'EN_ATTENTE',
            }
          : {
              passageId,
              libelle,
              montant: 0,
              agentId: utilisateurId,
              source: 'PRESCRIPTION',
              statut: 'EXTERNE', // hors catalogue : non facturable à la caisse
            },
      });
    }

    for (const libelle of retires) {
      const ligne = ligneDe(libelle);
      // On ne retire que ce que le médecin a prescrit et qui n'est pas encore payé
      if (ligne && ligne.source === 'PRESCRIPTION' && ['EN_ATTENTE', 'EXTERNE'].includes(ligne.statut)) {
        await this.prisma.passagePrestation.delete({ where: { id: ligne.id } });
      }
    }
  }

  /**
   * Tests de la fiche reportés automatiquement sur l'ordonnance :
   * TDR positif/négatif, CDIP réalisé, taux d'hémoglobine renseigné,
   * syphilis/hépatite positif/négatif. La ligne est ajoutée une seule fois et
   * retirée si le test est décoché (sauf si elle a déjà été dispensée).
   * Renvoie true si l'ordonnance a changé.
   */
  private async synchroniserTestsOrdonnance(
    consultation: {
      id: number;
      numeroOrdonnance: string | null;
      tdrPaludisme: string | null;
      cdipRealise: boolean | null;
      tauxHemoglobine: string | null;
      testSyphilis: string | null;
      testHepatite: string | null;
    },
    cliniqueId: number,
  ) {
    const resultat = (v: string | null) =>
      (v ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toUpperCase()
        .trim();
    const fait = (v: string | null) => ['POSITIF', 'NEGATIF'].includes(resultat(v));
    const regles: { libelle: string; actif: boolean }[] = [
      { libelle: 'Test de diagnostic rapide', actif: fait(consultation.tdrPaludisme) },
      { libelle: 'Test de VIH', actif: consultation.cdipRealise === true },
      { libelle: "Taux d'hémoglobine", actif: !!consultation.tauxHemoglobine?.trim() },
      { libelle: 'Test de syphilis', actif: fait(consultation.testSyphilis) },
      { libelle: "Test d'hépatite", actif: fait(consultation.testHepatite) },
    ];

    const existantes = await this.prisma.prescription.findMany({
      where: { consultationId: consultation.id },
      include: { _count: { select: { lignes: true } } },
    });
    const cle = (s: string) => resultat(s).replace(/[^A-Z]/g, '');
    let change = false;
    for (const r of regles) {
      const ligne = existantes.find((p) => cle(p.medicamentNom) === cle(r.libelle));
      if (r.actif && (!ligne || ligne.prixUnitaire == null || ligne.medicamentId == null)) {
        // Le test est un PRODUIT DU CATALOGUE de la pharmacie (créé automatiquement
        // s'il manque) : il n'est plus « hors catalogue », son stock et son prix se
        // gèrent comme ceux des autres produits.
        // Prix affiché sur l'ordonnance : celui du produit, à défaut celui de la
        // prestation du même libellé.
        const produit = await this.produitTest(cliniqueId, r.libelle);
        const prestation = produit?.prixVente
          ? null
          : await this.prisma.prestation.findFirst({
              where: { cliniqueId, libelle: r.libelle, actif: true },
            });
        const prix = produit?.prixVente ?? prestation?.montant ?? null;
        if (!ligne) {
          const ordonnance = await this.ordonnanceEnCours(consultation.id, cliniqueId);
          await this.prisma.prescription.create({
            data: {
              consultationId: consultation.id,
              ordonnanceId: ordonnance.id,
              medicamentId: produit?.id ?? null,
              medicamentNom: produit?.nom ?? r.libelle,
              forme: produit?.forme ?? null,
              quantite: '1',
              prixUnitaire: prix,
            },
          });
          change = true;
        } else if (prix != null || ligne.medicamentId == null) {
          // Ligne déjà inscrite avant que le produit ou son prix ne soit paramétré : on la complète
          await this.prisma.prescription.update({
            where: { id: ligne.id },
            data: {
              prixUnitaire: ligne.prixUnitaire ?? prix,
              medicamentId: ligne.medicamentId ?? produit?.id ?? null,
              forme: ligne.forme ?? produit?.forme ?? null,
            },
          });
          change = true;
        }
      } else if (!r.actif && ligne && ligne._count.lignes === 0) {
        await this.prisma.prescription.delete({ where: { id: ligne.id } });
        change = true;
      }
    }
    return change;
  }

  /** Produit du catalogue correspondant à un test de la fiche (créé s'il n'existe pas encore). */
  private async produitTest(cliniqueId: number, nom: string) {
    const existant = await this.prisma.medicament.findFirst({ where: { cliniqueId, nom } });
    if (existant) return existant;
    try {
      return await this.prisma.medicament.create({
        data: { cliniqueId, nom, forme: 'Test', uniteVente: 'BOITE' },
      });
    } catch {
      // Créé entre-temps par un autre poste (nom unique par clinique)
      return this.prisma.medicament.findFirst({ where: { cliniqueId, nom } });
    }
  }

  /** Crée une ordonnance vide pour la consultation (numéro ORD-XXXXX séquentiel par clinique). */
  private async creerOrdonnance(consultationId: number, cliniqueId: number) {
    let n = (await this.prisma.ordonnance.count({ where: { cliniqueId } })) + 1;
    let numero = `ORD-${String(n).padStart(5, '0')}`;
    // Le numéro doit rester unique dans la clinique
    while (await this.prisma.ordonnance.findFirst({ where: { cliniqueId, numero } })) {
      n += 1;
      numero = `ORD-${String(n).padStart(5, '0')}`;
    }
    const ordonnance = await this.prisma.ordonnance.create({
      data: { cliniqueId, consultationId, numero },
    });
    // La consultation garde le numéro de sa première ordonnance (compatibilité)
    await this.prisma.consultation.updateMany({
      where: { id: consultationId, numeroOrdonnance: null },
      data: { numeroOrdonnance: numero },
    });
    return ordonnance;
  }

  /**
   * Ordonnance qui reçoit les nouveaux médicaments : celle demandée, sinon la
   * dernière encore EN_ATTENTE, sinon une nouvelle. Une ordonnance déjà
   * délivrée (TRAITEE) n'est plus modifiable : la suite va sur une nouvelle.
   */
  private async ordonnanceEnCours(consultationId: number, cliniqueId: number, ordonnanceId?: number) {
    if (ordonnanceId) {
      const demandee = await this.prisma.ordonnance.findUnique({ where: { id: ordonnanceId } });
      if (!demandee || demandee.consultationId !== consultationId) {
        throw new BadRequestException('Ordonnance introuvable pour cette consultation.');
      }
      if (demandee.statut === 'TRAITEE') {
        throw new BadRequestException(
          `L'ordonnance ${demandee.numero} a déjà été délivrée par la pharmacie : créez une nouvelle ordonnance.`,
        );
      }
      return demandee;
    }
    const ouverte = await this.prisma.ordonnance.findFirst({
      where: { consultationId, statut: 'EN_ATTENTE' },
      orderBy: { id: 'desc' },
    });
    return ouverte ?? this.creerOrdonnance(consultationId, cliniqueId);
  }

  /** Nouvelle ordonnance indépendante pour la même consultation. */
  async nouvelleOrdonnance(consultationId: number) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { passage: { select: { cliniqueId: true } } },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');
    // Une ordonnance encore vide est réutilisée (pas de numéro gaspillé)
    const vide = await this.prisma.ordonnance.findFirst({
      where: { consultationId, statut: 'EN_ATTENTE', medicaments: { none: {} } },
      orderBy: { id: 'desc' },
    });
    return vide ?? this.creerOrdonnance(consultationId, consultation.passage.cliniqueId);
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

    const ordonnance = await this.ordonnanceEnCours(
      consultationId,
      consultation.passage.cliniqueId,
      dto.ordonnanceId,
    );
    return this.prisma.prescription.create({
      data: {
        consultationId,
        ordonnanceId: ordonnance.id,
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
      include: { ordonnance: true, _count: { select: { lignes: true } } },
    });
    if (!prescription) throw new NotFoundException('Prescription introuvable.');
    if (prescription.ordonnance?.statut === 'TRAITEE' || prescription._count.lignes > 0) {
      throw new BadRequestException(
        'Ce médicament a déjà été délivré par la pharmacie : il ne peut plus être retiré.',
      );
    }
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
    utilisateurId?: number,
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
          agentId: utilisateurId ?? null,
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
        agentId: utilisateurId ?? null,
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
    const libreExterne = ligne.statut === 'EXTERNE';
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

  // ── Résultat scanné d'un examen réalisé hors clinique ──

  /** Joint (ou remplace) le document scanné du résultat d'un examen hors clinique. */
  async joindreResultatExterne(
    ligneId: number,
    dto: { nomFichier?: string; contenu?: string; dateExamen?: string; lieu?: string; conclusion?: string },
    utilisateurId?: number,
  ) {
    const ligne = await this.prisma.passagePrestation.findUnique({
      where: { id: ligneId },
      include: {
        resultatExterne: { select: { id: true } },
        prestation: { select: { type: true } },
        examenLabo: { select: { id: true } },
        examenImagerie: { select: { id: true } },
      },
    });
    if (!ligne) throw new NotFoundException('Examen introuvable.');
    // Examen prescrit à la clinique, pas encore payé ni réalisé ici : le patient l'a fait ailleurs
    const prescritNonRealise =
      ligne.statut === 'EN_ATTENTE' &&
      ['EXAMEN_LABO', 'IMAGERIE'].includes(ligne.prestation?.type ?? '') &&
      !ligne.examenLabo &&
      !ligne.examenImagerie;
    if (ligne.statut !== 'EXTERNE' && !prescritNonRealise) {
      throw new BadRequestException(
        "Un document ne se joint qu'à un examen réalisé hors clinique (cet examen est payé ou fait à la clinique).",
      );
    }
    const infos = {
      dateExamen: dto.dateExamen ? new Date(`${dto.dateExamen}T00:00:00`) : null,
      lieu: dto.lieu?.trim() || null,
      conclusion: dto.conclusion?.trim() || null,
    };

    // Sans nouveau fichier : simple mise à jour des informations du document existant
    if (!dto.contenu) {
      if (!ligne.resultatExterne) throw new BadRequestException('Choisissez le fichier du résultat.');
      return this.prisma.resultatExterne.update({
        where: { passagePrestationId: ligneId },
        data: infos,
        ...metaResultatExterne,
      });
    }

    const m = /^data:([a-zA-Z0-9.+/-]+);base64,/.exec(dto.contenu);
    const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!m || !TYPES.includes(m[1])) {
      throw new BadRequestException('Format non accepté : choisissez une image (JPG, PNG) ou un PDF.');
    }
    const tailleOctets = Math.floor(((dto.contenu.length - m[0].length) * 3) / 4);
    if (tailleOctets > 7 * 1024 * 1024) {
      throw new BadRequestException('Fichier trop volumineux (7 Mo maximum).');
    }
    // Le résultat vient d'ailleurs : l'examen devient « hors clinique » et n'est plus facturé à la caisse
    if (prescritNonRealise) {
      await this.prisma.passagePrestation.update({
        where: { id: ligneId },
        data: { statut: 'EXTERNE' },
      });
    }
    const donnees = {
      nomFichier: dto.nomFichier?.trim() || 'resultat',
      typeMime: m[1],
      contenu: dto.contenu,
      tailleOctets,
      utilisateurId: utilisateurId ?? null,
      ...infos,
    };
    return this.prisma.resultatExterne.upsert({
      where: { passagePrestationId: ligneId },
      create: { passagePrestationId: ligneId, ...donnees },
      update: donnees,
      ...metaResultatExterne,
    });
  }

  /** Document complet (avec son contenu) pour l'affichage ou l'impression. */
  async resultatExterne(ligneId: number) {
    const doc = await this.prisma.resultatExterne.findUnique({
      where: { passagePrestationId: ligneId },
      include: { ligne: { select: { libelle: true } } },
    });
    if (!doc) throw new NotFoundException('Aucun document joint à cet examen.');
    return doc;
  }

  async supprimerResultatExterne(ligneId: number) {
    const doc = await this.prisma.resultatExterne.findUnique({ where: { passagePrestationId: ligneId } });
    if (!doc) throw new NotFoundException('Aucun document joint à cet examen.');
    await this.prisma.resultatExterne.delete({ where: { id: doc.id } });
    return { ok: true };
  }

  /** Sauvegarde explicite de l'ordonnance (horodatée, traçable). */
  async sauvegarderOrdonnance(consultationId: number) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');
    await this.prisma.ordonnance.updateMany({
      where: { consultationId, statut: 'EN_ATTENTE' },
      data: { sauveeLe: new Date() },
    });
    return this.prisma.consultation.update({
      where: { id: consultationId },
      data: { ordonnanceSauveeLe: new Date() },
      include: includeConsultation,
    });
  }

  /** Enregistre un certificat d'arrêt (numéro CERT-0001… séquentiel annuel). */
  async enregistrerCertificat(
    consultationId: number,
    dto: {
      civilite: string;
      nomPatient: string;
      dateNaissance?: string;
      profession?: string;
      dureeJours: number;
      debut: string;
      fin: string;
      medecin: string;
      lieu?: string;
    },
    medecinId: number,
  ) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');
    const passage = await this.prisma.passage.findUnique({
      where: { id: consultation.passageId },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    // Numéro séquentiel annuel : CERT-0001, CERT-0002…
    const annee = new Date().getFullYear();
    const totalAnnee = await this.prisma.certificatArret.count({
      where: { cliniqueId: passage.cliniqueId, createdAt: { gte: new Date(annee, 0, 1) } },
    });
    const numero = `CERT-${String(totalAnnee + 1).padStart(4, '0')}`;

    return this.prisma.certificatArret.create({
      data: {
        cliniqueId: passage.cliniqueId,
        consultationId,
        passageId: consultation.passageId,
        patientId: consultation.patientId,
        numero,
        civilite: dto.civilite,
        nomPatient: dto.nomPatient,
        dateNaissance: dto.dateNaissance,
        profession: dto.profession,
        dureeJours: dto.dureeJours,
        debut: new Date(dto.debut),
        fin: new Date(dto.fin),
        medecin: dto.medecin,
        lieu: dto.lieu,
        medecinId,
      },
    });
  }

  /** Liste des certificats d'arrêt d'une consultation. */
  async certificatsArret(consultationId: number) {
    return this.prisma.certificatArret.findMany({
      where: { consultationId },
      orderBy: { createdAt: 'desc' },
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
