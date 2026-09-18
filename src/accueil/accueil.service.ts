import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePassageDto,
  UpdatePassageDto,
} from './dto/create-passage.dto';

const includePassage = {
  patient: true,
  service: { select: { id: true, code: true, nom: true } },
  clinique: { select: { id: true, code: true, nom: true, adresse: true } },
} satisfies Prisma.PassageInclude;

const JOURS_VALIDITE = 10; // validité du code de passage (§4.3)

const STATUTS_ACTIFS = ['CREE', 'EN_ATTENTE_PAIEMENT', 'ACTIF'];

@Injectable()
export class AccueilService {
  private readonly logger = new Logger(AccueilService.name);

  constructor(
    private prisma: PrismaService,
    private impressionService: ImpressionService,
  ) {}

  /** Recherche un patient par nom, prénom, n° de dossier ou n° d'ordre. */
  async rechercherPatients(search: string, cliniqueId?: number) {
    if (!search || search.trim().length < 2) return [];
    const where: Prisma.PatientWhereInput = {
      ...(cliniqueId ? { cliniqueId } : {}),
      OR: [
        { nom: { contains: search } },
        { prenom: { contains: search } },
        { numeroDossier: { contains: search } },
        // N° d'ordre d'un passage (ex. MED-004092026)
        { passages: { some: { numeroOrdre: { contains: search } } } },
      ],
    };
    return this.prisma.patient.findMany({
      where,
      take: 10,
      orderBy: { nom: 'asc' },
      include: {
        passages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            numeroOrdre: true,
            createdAt: true,
            statut: true,
            service: { select: { nom: true } },
          },
        },
      },
    });
  }

  /**
   * Liste des passages :
   * - jour précis (date), plage de dates (debut/fin) ou aujourd'hui par défaut
   * - filtres : état des constantes (OUI/NON), service, recherche
   *   (nom, prénom, code patient ou N° d'ordre)
   */
  async listerPassages(
    cliniqueId: number,
    opts: {
      date?: string;
      debut?: string;
      fin?: string;
      constantes?: 'OUI' | 'NON';
      search?: string;
      serviceId?: number;
      page?: number;
      perPage?: number;
    },
  ) {
    let debut: Date;
    let fin: Date;
    if (opts.debut || opts.fin) {
      debut = opts.debut
        ? new Date(`${opts.debut}T00:00:00`)
        : new Date(2000, 0, 1);
      fin = opts.fin
        ? new Date(`${opts.fin}T23:59:59.999`)
        : new Date(2999, 11, 31);
    } else if (opts.date) {
      debut = new Date(`${opts.date}T00:00:00`);
      fin = new Date(debut.getTime() + 24 * 3600 * 1000);
    } else {
      debut = this.debutJour(new Date());
      fin = new Date(debut.getTime() + 24 * 3600 * 1000);
    }

    const conditions: Prisma.PassageWhereInput[] = [];
    if (opts.serviceId) {
      conditions.push({ serviceId: opts.serviceId });
    }
    if (opts.constantes === 'OUI') {
      conditions.push({
        OR: [
          { taille: { not: null } },
          { temperature: { not: null } },
          { pouls: { not: null } },
          { tensionGauche: { not: null } },
          { tensionDroite: { not: null } },
          { poids: { not: null } },
        ],
      });
    } else if (opts.constantes === 'NON') {
      conditions.push({
        AND: [
          { taille: null },
          { temperature: null },
          { pouls: null },
          { tensionGauche: null },
          { tensionDroite: null },
          { poids: null },
        ],
      });
    }
    if (opts.search && opts.search.trim()) {
      const s = opts.search.trim();
      conditions.push({
        OR: [
          { numeroOrdre: { contains: s } },
          { patient: { is: { nom: { contains: s } } } },
          { patient: { is: { prenom: { contains: s } } } },
          { patient: { is: { code: { contains: s } } } },
        ],
      });
    }

    const where: Prisma.PassageWhereInput = {
      cliniqueId,
      createdAt: { gte: debut, lt: fin },
      ...(conditions.length ? { AND: conditions } : {}),
    };

    const page = Math.max(1, opts.page ?? 1);
    const perPage = opts.perPage ?? 20; // 0 = tout, sans pagination
    const [passages, total] = await Promise.all([
      this.prisma.passage.findMany({
        where,
        include: includePassage,
        orderBy: { createdAt: 'desc' },
        ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
      }),
      this.prisma.passage.count({ where }),
    ]);
    const data = await Promise.all(
      passages.map((p) => this.avecStatutVerifie(p)),
    );
    return {
      data,
      total,
      page,
      perPage: perPage > 0 ? perPage : total,
      totalPages: perPage > 0 ? Math.ceil(total / perPage) : 1,
    };
  }

  /**
   * Passage par N° d'ordre OU par code patient PERMANENT (utilisé par les services).
   * - N° d'ordre : renvoie le passage exact
   * - Code patient : renvoie le passage le plus récent du patient
   * La référence est normalisée (majuscules, espaces/tirets retirés).
   */
  async passageParReference(reference: string, cliniqueId?: number) {
    const ref = reference.trim().toUpperCase();
    const refSansTiret = ref.replace(/[\s-]/g, '');
    // 1. N° d'ordre (les tirets sont conservés pour la correspondance)
    const parNumeroOrdre = await this.prisma.passage.findFirst({
      where: {
        ...(cliniqueId ? { cliniqueId } : {}),
        numeroOrdre: { contains: ref },
      },
      include: includePassage,
    });
    if (parNumeroOrdre) return this.avecStatutVerifie(parNumeroOrdre);

    // 2. Code patient permanent → dernier passage
    const patient = await this.prisma.patient.findFirst({
      where: {
        ...(cliniqueId ? { cliniqueId } : {}),
        code: refSansTiret,
      },
    });
    if (patient) {
      const passage = await this.prisma.passage.findFirst({
        where: { patientId: patient.id },
        include: includePassage,
        orderBy: { createdAt: 'desc' },
      });
      if (passage) return this.avecStatutVerifie(passage);
    }

    throw new NotFoundException('Code patient ou N° d\'ordre introuvable.');
  }

  async findOne(id: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id },
      include: includePassage,
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    return this.avecStatutVerifie(passage);
  }

  /**
   * Crée un passage : patient (existant ou nouveau), N° d'ordre du jour,
   * code unique et date d'expiration (10 jours, §4.3).
   */
  async creerPassage(dto: CreatePassageDto) {
    let patient: { id: number };

    if (dto.patientId) {
      const existant = await this.prisma.patient.findUnique({
        where: { id: dto.patientId },
      });
      if (!existant) throw new BadRequestException('Patient introuvable.');
      patient = existant;
    } else if (dto.nouveauPatient) {
      // Code unique PERMANENT généré à la première inscription du patient
      const codePatient = await this.genererCodeUnique();
      patient = await this.prisma.patient.create({
        data: {
          cliniqueId: dto.cliniqueId,
          numeroDossier: await this.prochainNumeroDossier(dto.cliniqueId),
          code: codePatient,
          nom: dto.nouveauPatient.nom,
          prenom: dto.nouveauPatient.prenom,
          // l'âge arrive en nombre depuis le frontend : stocké en chaîne
          age:
            dto.nouveauPatient.age != null
              ? String(dto.nouveauPatient.age)
              : undefined,
          sexe: dto.nouveauPatient.sexe,
          ville: dto.nouveauPatient.ville,
          quartier: dto.nouveauPatient.quartier,
          profession: dto.nouveauPatient.profession,
          telephone: dto.nouveauPatient.telephone,
        },
      });
    } else {
      throw new BadRequestException(
        'Patient requis : patientId ou nouveauPatient.',
      );
    }

    const numeroOrdre = await this.prochainNumeroOrdre(
      dto.cliniqueId,
      dto.serviceId,
      dto.typePatient ?? 'INTERNE',
    );

    const passage = await this.prisma.passage.create({
      data: {
        cliniqueId: dto.cliniqueId,
        patientId: patient.id,
        numeroOrdre,
        serviceId: dto.serviceId,
        typePatient: dto.typePatient ?? 'INTERNE',
        motif: dto.motif,
        referent: dto.referent,
        prestationDemandee: dto.prestationDemandee,
        taille: dto.taille,
        temperature: dto.temperature,
        pouls: dto.pouls,
        tensionGauche: dto.tensionGauche,
        tensionDroite: dto.tensionDroite,
        poids: dto.poids,
        expireLe: new Date(Date.now() + JOURS_VALIDITE * 24 * 3600 * 1000),
      },
      include: includePassage,
    });

    // Prestations du dossier (§6.1) : toutes les prestations actives du service.
    // - consultation : payable immédiatement (EN_ATTENTE) — UNE SEULE par passage :
    //   si le service a plusieurs tarifs de consultation, l'accueil précise
    //   laquelle retenir (consultationPrestationId), sinon celle du service est
    //   retenue automatiquement.
    // - examens/actes : NON_PRESCRITE — grisés à la caisse jusqu'à la prescription
    //   du médecin (« pas encore prescrite »)
    const prestationsService = await this.prisma.prestation.findMany({
      where: {
        cliniqueId: dto.cliniqueId,
        serviceId: dto.serviceId,
        actif: true,
      },
    });
    const consultations = prestationsService.filter(
      (p) => p.type === 'CONSULTATION',
    );
    let consultationChoisie: (typeof consultations)[number] | null = null;
    if (dto.consultationPrestationId) {
      consultationChoisie =
        consultations.find((p) => p.id === dto.consultationPrestationId) ?? null;
      if (!consultationChoisie) {
        throw new BadRequestException(
          'Cette consultation ne correspond pas au service choisi.',
        );
      }
    } else if (consultations.length === 1) {
      consultationChoisie = consultations[0];
    }
    const lignes = prestationsService.filter(
      (p) => p.type !== 'CONSULTATION' || p.id === consultationChoisie?.id,
    );
    if (lignes.length > 0) {
      await this.prisma.passagePrestation.createMany({
        data: lignes.map((p) => ({
          passageId: passage.id,
          prestationId: p.id,
          libelle: p.libelle,
          montant: p.montant,
          serviceId: p.serviceId,
          source: 'ACCUEIL',
          statut: p.id === consultationChoisie?.id ? 'EN_ATTENTE' : 'NON_PRESCRITE',
        })),
      });
    }

    const resultat = await this.avecStatutVerifie(passage);

    // Impression automatique du ticket si activée (PRINTER_AUTO_PRINT=true)
    let impression = null;
    if (this.impressionService.getConfig().autoPrint) {
      try {
        impression = await this.impressionService.imprimerTicketPassage(
          passage.id,
        );
        if (!impression.ok) {
          this.logger.warn(
            `Impression auto ticket #${passage.id}: ${impression.message}`,
          );
        }
      } catch (err: any) {
        this.logger.error(`Erreur impression auto ticket #${passage.id}: ${err.message}`);
      }
    }

    return { ...resultat, impression };
  }

  /** Modifie un passage (et les données du patient si fournies). */
  async modifierPassage(id: number, dto: UpdatePassageDto) {
    const passage = await this.prisma.passage.findUnique({ where: { id } });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    if (dto.patient) {
      await this.prisma.patient.update({
        where: { id: passage.patientId },
        data: {
          nom: dto.patient.nom,
          prenom: dto.patient.prenom,
          // l'âge arrive en nombre depuis le frontend : stocké en chaîne
          age: dto.patient.age != null ? String(dto.patient.age) : undefined,
          sexe: dto.patient.sexe,
          ville: dto.patient.ville,
          quartier: dto.patient.quartier,
          profession: dto.patient.profession,
          telephone: dto.patient.telephone,
        },
      });
    }

    const { patient: _patient, ...donneesPassage } = dto;
    const maj = await this.prisma.passage.update({
      where: { id },
      data: donneesPassage,
      include: includePassage,
    });
    return this.avecStatutVerifie(maj);
  }

  /**
   * N° d'ordre (tiret de 6 + ordre/mois/année compact) :
   * - patient INTERNE  → INT-021092026 : préfixe fixe INT + compteur mensuel
   *   GLOBAL (tous services confondus) — le même code suit le patient partout ;
   * - patient EXTERNE  → IMA-002092026 : préfixe du service + compteur mensuel
   *   propre au service (patient référé directement vers ce service, §15).
   * Le format ne contient pas le jour : un compteur quotidien créerait des
   * doublons d'un jour à l'autre.
   */
  private async prochainNumeroOrdre(
    cliniqueId: number,
    serviceId: number,
    typePatient: string,
  ) {
    const d = new Date();
    const debutMois = new Date(d.getFullYear(), d.getMonth(), 1);
    let prefixe: string;
    let nb: number;
    if (typePatient === 'EXTERNE') {
      // Compteur inchangé : tous les passages du service sur le mois
      nb = await this.prisma.passage.count({
        where: { cliniqueId, serviceId, createdAt: { gte: debutMois } },
      });
      const service = await this.prisma.service.findUnique({
        where: { id: serviceId },
      });
      prefixe = service?.code || 'SRV';
    } else {
      // Patient interne : compteur global de tous les passages internes du mois
      nb = await this.prisma.passage.count({
        where: {
          cliniqueId,
          typePatient: 'INTERNE',
          createdAt: { gte: debutMois },
        },
      });
      prefixe = 'INT';
    }
    return `${prefixe}-${String(nb + 1).padStart(3, '0')}${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}${d.getFullYear()}`;
  }

  /**
   * N° de dossier : DOS-XXXXX calculé sur le plus grand numéro existant
   * (+1), insensible aux suppressions (trous de numérotation).
   */
  private async prochainNumeroDossier(cliniqueId: number) {
    const dernier = await this.prisma.patient.findFirst({
      where: { cliniqueId },
      orderBy: { id: 'desc' },
      select: { numeroDossier: true },
    });
    const prochain = dernier
      ? parseInt(dernier.numeroDossier.replace(/\D/g, ''), 10) + 1
      : 1;
    return `DOS-${String(prochain).padStart(5, '0')}`;
  }

  /** Code patient unique et permanent (6 caractères lisibles, sans préfixe). */
  private async genererCodeUnique() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans caractères ambigus
    for (let essai = 0; essai < 10; essai++) {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      const existe = await this.prisma.patient.findUnique({ where: { code } });
      if (!existe) return code;
    }
    throw new Error('Impossible de générer un code patient unique.');
  }

  private debutJour(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  /** Applique l'expiration automatique (10 jours) lors de la lecture (§4.3). */
  private async avecStatutVerifie<T extends { id: number; statut: string; expireLe: Date }>(
    passage: T,
  ): Promise<T> {
    if (
      STATUTS_ACTIFS.includes(passage.statut) &&
      passage.expireLe.getTime() < Date.now()
    ) {
      const maj = await this.prisma.passage.update({
        where: { id: passage.id },
        data: { statut: 'EXPIRE' },
      });
      return { ...passage, statut: maj.statut };
    }
    return passage;
  }
}
