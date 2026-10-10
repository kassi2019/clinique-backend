import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccueilService } from '../accueil/accueil.service';
import {
  CreateAccouchementDto,
  CreateCponDto,
  CreateGrossesseDto,
  CreatePfDto,
  CreateVisiteCpnDto,
  UpdateAccouchementDto,
  UpdateCponDto,
  UpdateGrossesseDto,
  UpdatePfDto,
  UpdateVisiteCpnDto,
} from './dto/maternite.dto';
import { critereNomPrenoms } from '../common/recherche-patient';

const includeVisite = {
  agent: {
    select: {
      matricule: true,
      personnel: { select: { nom: true, prenom: true } },
    },
  },
} as const;

/**
 * Module Maternité : grossesses, visites CPN et accouchements.
 * Même logique que les autres modules : recherche par nom/code, pagination,
 * traçabilité de l'agent, numérotation automatique.
 */
@Injectable()
export class MaterniteService {
  constructor(
    private prisma: PrismaService,
    private accueil: AccueilService,
  ) {}

  /** Numéro de grossesse : GRO-0001, GRO-0002… */
  private async prochainNumero(cliniqueId: number): Promise<string> {
    const nb = await this.prisma.grossesse.count({ where: { cliniqueId } });
    return `GRO-${String(nb + 1).padStart(4, '0')}`;
  }

  /** Date prévue d'accouchement : DDR + 280 jours. */
  private calculerDpa(ddr: Date): Date {
    const dpa = new Date(ddr.getTime() + 280 * 24 * 3600 * 1000);
    return dpa;
  }

  async creerGrossesse(dto: CreateGrossesseDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id: dto.patientId } });
    if (!patient) throw new NotFoundException('Patiente introuvable.');
    const ddr = new Date(dto.ddr);
    return this.prisma.grossesse.create({
      data: {
        cliniqueId: dto.cliniqueId,
        patientId: dto.patientId,
        numero: await this.prochainNumero(dto.cliniqueId),
        ddr,
        dpa: this.calculerDpa(ddr),
        gravidite: dto.gravidite,
        parite: dto.parite,
        antecedentsObstetricaux: dto.antecedentsObstetricaux,
        facteursRisque: dto.facteursRisque,
        // Registre CPN officiel
        numeroGestante: dto.numeroGestante,
        modeEntree: dto.modeEntree,
        antecedentsMedicaux: dto.antecedentsMedicaux,
        antecedentsChirurgicaux: dto.antecedentsChirurgicaux,
        enfantsVivants: dto.enfantsVivants,
        enfantsDecedes: dto.enfantsDecedes,
        cesariennes: dto.cesariennes,
        avortements: dto.avortements,
        toxemie: dto.toxemie,
        vatStatut: dto.vatStatut,
        vat1: dto.vat1 ? new Date(dto.vat1) : undefined,
        vat2: dto.vat2 ? new Date(dto.vat2) : undefined,
        vatRappel: dto.vatRappel ? new Date(dto.vatRappel) : undefined,
        statutVih: dto.statutVih,
        dateDerniereCpn: dto.dateDerniereCpn ? new Date(dto.dateDerniereCpn) : undefined,
      },
      include: { patient: true },
    });
  }

  async modifierGrossesse(id: number, dto: UpdateGrossesseDto) {
    const g = await this.prisma.grossesse.findUnique({ where: { id } });
    if (!g) throw new NotFoundException('Grossesse introuvable.');
    const data: any = {
      gravidite: dto.gravidite,
      parite: dto.parite,
      antecedentsObstetricaux: dto.antecedentsObstetricaux,
      facteursRisque: dto.facteursRisque,
      statut: dto.statut,
      // Registre CPN officiel
      numeroGestante: dto.numeroGestante,
      modeEntree: dto.modeEntree,
      antecedentsMedicaux: dto.antecedentsMedicaux,
      antecedentsChirurgicaux: dto.antecedentsChirurgicaux,
      enfantsVivants: dto.enfantsVivants,
      enfantsDecedes: dto.enfantsDecedes,
      cesariennes: dto.cesariennes,
      avortements: dto.avortements,
      toxemie: dto.toxemie,
      vatStatut: dto.vatStatut,
      vat1: dto.vat1 ? new Date(dto.vat1) : undefined,
      vat2: dto.vat2 ? new Date(dto.vat2) : undefined,
      vatRappel: dto.vatRappel ? new Date(dto.vatRappel) : undefined,
      statutVih: dto.statutVih,
      dateDerniereCpn: dto.dateDerniereCpn ? new Date(dto.dateDerniereCpn) : undefined,
    };
    if (dto.ddr) {
      data.ddr = new Date(dto.ddr);
      data.dpa = this.calculerDpa(new Date(dto.ddr));
    }
    return this.prisma.grossesse.update({
      where: { id },
      data,
      include: { patient: true },
    });
  }

  async grossesses(query: {
    cliniqueId: number;
    search?: string;
    statut?: string;
    page?: number;
    perPage?: number;
  }) {
    const recherche = query.search?.trim().toUpperCase() ?? '';
    const where: any = {
      cliniqueId: query.cliniqueId,
      ...(query.statut ? { statut: query.statut } : {}),
    };
    if (recherche) {
      where.OR = [
        { numero: { contains: recherche } },
        { patient: { is: critereNomPrenoms(recherche) } },
        { patient: { is: { code: { contains: recherche.replace(/[\s-]/g, '') } } } },
      ];
    }
    const page = Math.max(1, query.page ?? 1);
    const perPage = Math.max(1, query.perPage ?? 10);
    const [data, total] = await Promise.all([
      this.prisma.grossesse.findMany({
        where,
        include: {
          patient: true,
          _count: { select: { visites: true } },
          accouchement: true,
          visites: { orderBy: { numero: 'desc' }, take: 1 },
        },
        orderBy: [{ statut: 'asc' }, { dpa: 'asc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.grossesse.count({ where }),
    ]);
    return {
      data: data.map((g) => ({
        ...g,
        prochaineVisite: g.visites[0]?.prochaineVisite ?? null,
      })),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async detailGrossesse(id: number) {
    const g = await this.prisma.grossesse.findUnique({
      where: { id },
      include: {
        patient: true,
        visites: { include: includeVisite, orderBy: { numero: 'asc' } },
        accouchement: {
          include: {
            agent: {
              select: {
                matricule: true,
                personnel: { select: { nom: true, prenom: true } },
              },
            },
          },
        },
      },
    });
    if (!g) throw new NotFoundException('Grossesse introuvable.');
    return g;
  }

  async creerVisite(grossesseId: number, dto: CreateVisiteCpnDto, agentId: number) {
    const g = await this.prisma.grossesse.findUnique({ where: { id: grossesseId } });
    if (!g) throw new NotFoundException('Grossesse introuvable.');
    // Rang choisi par l'agent (liste CPN1..CPN8) sinon rang suivant
    const nb = await this.prisma.visiteCpn.count({ where: { grossesseId } });
    const numero = dto.numero ?? nb + 1;
    const doublon = await this.prisma.visiteCpn.findFirst({
      where: { grossesseId, numero },
    });
    if (doublon) {
      throw new BadRequestException(`La CPN${numero} existe déjà pour cette grossesse.`);
    }
    return this.prisma.visiteCpn.create({
      data: {
        grossesseId,
        numero,
        date: new Date(dto.date),
        ageGestationnelSA: dto.ageGestationnelSA,
        poids: dto.poids,
        taille: dto.taille,
        tensionGauche: dto.tensionGauche,
        tensionDroite: dto.tensionDroite,
        hauteurUterine: dto.hauteurUterine,
        bcf: dto.bcf,
        mouvementsActifs: dto.mouvementsActifs,
        oedemes: dto.oedemes,
        albumine: dto.albumine,
        sucre: dto.sucre,
        presentation: dto.presentation,
        tv: dto.tv,
        conseils: dto.conseils,
        prochaineVisite: dto.prochaineVisite ? new Date(dto.prochaineVisite) : null,
        agentId,
        // Registre CPN — rapport SIG
        risqueDepiste: dto.risqueDepiste,
        malnutrition: dto.malnutrition,
        anemie: dto.anemie,
        syphilisPositif: dto.syphilisPositif,
        agHbsPositif: dto.agHbsPositif,
        spDose: dto.spDose,
        mildaRemise: dto.mildaRemise,
        ferFolate: dto.ferFolate,
        deparasitee: dto.deparasitee,
        counselingPfppi: dto.counselingPfppi,
      },
      include: includeVisite,
    });
  }

  async modifierVisite(id: number, dto: UpdateVisiteCpnDto) {
    const v = await this.prisma.visiteCpn.findUnique({ where: { id } });
    if (!v) throw new NotFoundException('Visite introuvable.');
    if (dto.numero != null && dto.numero !== v.numero) {
      const doublon = await this.prisma.visiteCpn.findFirst({
        where: { grossesseId: v.grossesseId, numero: dto.numero, NOT: { id } },
      });
      if (doublon) {
        throw new BadRequestException(`La CPN${dto.numero} existe déjà pour cette grossesse.`);
      }
    }
    return this.prisma.visiteCpn.update({
      where: { id },
      data: {
        date: dto.date ? new Date(dto.date) : undefined,
        numero: dto.numero,
        ageGestationnelSA: dto.ageGestationnelSA,
        poids: dto.poids,
        taille: dto.taille,
        tensionGauche: dto.tensionGauche,
        tensionDroite: dto.tensionDroite,
        hauteurUterine: dto.hauteurUterine,
        bcf: dto.bcf,
        mouvementsActifs: dto.mouvementsActifs,
        oedemes: dto.oedemes,
        albumine: dto.albumine,
        sucre: dto.sucre,
        presentation: dto.presentation,
        tv: dto.tv,
        conseils: dto.conseils,
        prochaineVisite: dto.prochaineVisite ? new Date(dto.prochaineVisite) : undefined,
        // Registre CPN — rapport SIG
        risqueDepiste: dto.risqueDepiste,
        malnutrition: dto.malnutrition,
        anemie: dto.anemie,
        syphilisPositif: dto.syphilisPositif,
        agHbsPositif: dto.agHbsPositif,
        spDose: dto.spDose,
        mildaRemise: dto.mildaRemise,
        ferFolate: dto.ferFolate,
        deparasitee: dto.deparasitee,
        counselingPfppi: dto.counselingPfppi,
      },
      include: includeVisite,
    });
  }

  /** Champs du registre d'accouchement officiel (partagés create/update). */
  private champsRegistreAccouchement(dto: CreateAccouchementDto | UpdateAccouchementDto) {
    return {
      modeEntree: dto.modeEntree,
      numeroAccouchement: dto.numeroAccouchement,
      heureArrivee: dto.heureArrivee ? new Date(dto.heureArrivee) : undefined,
      motifAdmission: dto.motifAdmission,
      enTravail: dto.enTravail,
      contractions: dto.contractions,
      pocheEauxIntacte: dto.pocheEauxIntacte,
      ruptureHeures: dto.ruptureHeures,
      liquideAspect: dto.liquideAspect,
      antecedentsMedicaux: dto.antecedentsMedicaux,
      htaConnue: dto.htaConnue,
      diabeteConnu: dto.diabeteConnu,
      antecedentsChirurgicaux: dto.antecedentsChirurgicaux,
      gemellite: dto.gemellite,
      prematurite: dto.prematurite,
      enfantsVivants: dto.enfantsVivants,
      enfantsDecedes: dto.enfantsDecedes,
      cesariennes: dto.cesariennes,
      avortements: dto.avortements,
      toxemie: dto.toxemie,
      statutVihAccueil: dto.statutVihAccueil,
      sousTarvCpn: dto.sousTarvCpn,
      numeroPec: dto.numeroPec,
      ageGrossessePremiereCpn: dto.ageGrossessePremiereCpn,
      nombreCpn: dto.nombreCpn,
      offreTestVih: dto.offreTestVih,
      resultatTestVih: dto.resultatTestVih,
      delivranceLe: dto.delivranceLe ? new Date(dto.delivranceLe) : undefined,
      revisionUterine: dto.revisionUterine,
      ubt: dto.ubt,
      hppi: dto.hppi,
      perimetreCranienEnfant: dto.perimetreCranienEnfant,
      reanimationNn: dto.reanimationNn,
      decedeMaternite: dto.decedeMaternite,
      interventionMedecin: dto.interventionMedecin,
      sortieMereLe: dto.sortieMereLe ? new Date(dto.sortieMereLe) : undefined,
      sortieMereMode: dto.sortieMereMode,
    };
  }

  async creerAccouchement(grossesseId: number, dto: CreateAccouchementDto, agentId: number) {
    const g = await this.prisma.grossesse.findUnique({ where: { id: grossesseId } });
    if (!g) throw new NotFoundException('Grossesse introuvable.');
    const accouchement = await this.prisma.accouchement.upsert({
      where: { grossesseId },
      update: {
        dateHeure: new Date(dto.dateHeure),
        voie: dto.voie ?? 'VOIE_BASSE',
        termeSA: dto.termeSA,
        sexeEnfant: dto.sexeEnfant,
        poidsEnfant: dto.poidsEnfant,
        apgar: dto.apgar,
        issueMere: dto.issueMere,
        issueEnfant: dto.issueEnfant,
        complications: dto.complications,
        lieu: dto.lieu,
        agentId,
        // Registre d'accouchement — rapport SIG
        vatStatut: dto.vatStatut,
        mortNeType: dto.mortNeType,
        declarationNaissanceRenseignee: dto.declarationNaissanceRenseignee,
        declarationNaissanceComplete: dto.declarationNaissanceComplete,
        evacueeAvant: dto.evacueeAvant,
        evacueeApres: dto.evacueeApres,
        nouveauNeEvacue: dto.nouveauNeEvacue,
        nouveauNeProtegeTetanos: dto.nouveauNeProtegeTetanos,
        accouchementMultiple: dto.accouchementMultiple,
        ...this.champsRegistreAccouchement(dto),
      },
      create: {
        grossesseId,
        dateHeure: new Date(dto.dateHeure),
        voie: dto.voie ?? 'VOIE_BASSE',
        termeSA: dto.termeSA,
        sexeEnfant: dto.sexeEnfant,
        poidsEnfant: dto.poidsEnfant,
        apgar: dto.apgar,
        issueMere: dto.issueMere,
        issueEnfant: dto.issueEnfant,
        complications: dto.complications,
        lieu: dto.lieu,
        agentId,
        // Registre d'accouchement — rapport SIG
        vatStatut: dto.vatStatut,
        mortNeType: dto.mortNeType,
        declarationNaissanceRenseignee: dto.declarationNaissanceRenseignee,
        declarationNaissanceComplete: dto.declarationNaissanceComplete,
        evacueeAvant: dto.evacueeAvant,
        evacueeApres: dto.evacueeApres,
        nouveauNeEvacue: dto.nouveauNeEvacue,
        nouveauNeProtegeTetanos: dto.nouveauNeProtegeTetanos,
        accouchementMultiple: dto.accouchementMultiple,
        ...this.champsRegistreAccouchement(dto),
      },
    });
    await this.prisma.grossesse.update({
      where: { id: grossesseId },
      data: { statut: 'ACCOUCHEE' },
    });
    return accouchement;
  }

  async modifierAccouchement(id: number, dto: UpdateAccouchementDto) {
    const a = await this.prisma.accouchement.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Accouchement introuvable.');
    return this.prisma.accouchement.update({
      where: { id },
      data: {
        dateHeure: dto.dateHeure ? new Date(dto.dateHeure) : undefined,
        voie: dto.voie,
        termeSA: dto.termeSA,
        sexeEnfant: dto.sexeEnfant,
        poidsEnfant: dto.poidsEnfant,
        apgar: dto.apgar,
        issueMere: dto.issueMere,
        issueEnfant: dto.issueEnfant,
        complications: dto.complications,
        lieu: dto.lieu,
        // Registre d'accouchement — rapport SIG
        vatStatut: dto.vatStatut,
        mortNeType: dto.mortNeType,
        declarationNaissanceRenseignee: dto.declarationNaissanceRenseignee,
        declarationNaissanceComplete: dto.declarationNaissanceComplete,
        evacueeAvant: dto.evacueeAvant,
        evacueeApres: dto.evacueeApres,
        nouveauNeEvacue: dto.nouveauNeEvacue,
        nouveauNeProtegeTetanos: dto.nouveauNeProtegeTetanos,
        accouchementMultiple: dto.accouchementMultiple,
        ...this.champsRegistreAccouchement(dto),
      },
    });
  }

  async accouchements(query: { cliniqueId: number; search?: string; page?: number; perPage?: number }) {
    const recherche = query.search?.trim().toUpperCase() ?? '';
    const where: any = { grossesse: { cliniqueId: query.cliniqueId } };
    if (recherche) {
      where.grossesse.patient = {
        is: {
          OR: [
            { nom: { contains: recherche } },
            { prenom: { contains: recherche } },
            { code: { contains: recherche.replace(/[\s-]/g, '') } },
          ],
        },
      };
    }
    const page = Math.max(1, query.page ?? 1);
    const perPage = Math.max(1, query.perPage ?? 10);
    const [data, total] = await Promise.all([
      this.prisma.accouchement.findMany({
        where,
        include: { grossesse: { include: { patient: true } } },
        orderBy: { dateHeure: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.accouchement.count({ where }),
    ]);
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }

  // ─────────────────── Nouveau flux : file d'attente ───────────────────

  /** Patientes avec prestation MATERNITE payée à la caisse, non encore traitées. */
  async fileAttente(cliniqueId: number) {
    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        statut: { in: ['ACTIF', 'EN_ATTENTE_PAIEMENT'] },
        materniteTraiteLe: null,
        prestations: {
          // Payées (flux normal) OU à payer (accouchement en urgence :
          // le paiement se fait après l'accouchement, à la caisse)
          some: { prestation: { type: 'MATERNITE' }, statut: { in: ['PAYEE', 'EN_ATTENTE', 'CREDIT', 'CAS_SOCIAL'] } },
        },
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: { prestation: { type: 'MATERNITE' }, statut: { in: ['PAYEE', 'EN_ATTENTE', 'CREDIT', 'CAS_SOCIAL'] } },
          select: { libelle: true, statut: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return passages.map((p) => ({
      id: p.id,
      numeroOrdre: p.numeroOrdre,
      patient: p.patient,
      service: p.service,
      createdAt: p.createdAt,
      actes: p.prestations.map((l) => l.libelle),
      paye: p.prestations.some((l) => l.statut === 'PAYEE'),
      credit: p.prestations.some((l) => l.statut === 'CREDIT' || l.statut === 'CAS_SOCIAL'),
    }));
  }

  /** Recherche d'une patiente maternité (code, N° d'ordre, nom ou prénom). */
  async rechercher(reference: string, cliniqueId: number) {
    const ref = reference.trim().toUpperCase();
    if (!ref) return [];
    const refSans = ref.replace(/[\s-]/g, '');
    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        statut: { in: ['ACTIF', 'EN_ATTENTE_PAIEMENT'] },
        prestations: { some: { prestation: { type: 'MATERNITE' }, statut: { in: ['PAYEE', 'EN_ATTENTE'] } } },
        OR: [
          { numeroOrdre: { contains: ref } },
          { patient: { is: { code: refSans } } },
          { patient: { is: critereNomPrenoms(ref) } },
        ],
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: { prestation: { type: 'MATERNITE' }, statut: { in: ['PAYEE', 'EN_ATTENTE', 'CREDIT', 'CAS_SOCIAL'] } },
          select: { libelle: true, statut: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return passages.map((p) => ({
      id: p.id,
      numeroOrdre: p.numeroOrdre,
      patient: p.patient,
      service: p.service,
      createdAt: p.createdAt,
      actes: p.prestations.map((l) => l.libelle),
      traite: p.materniteTraiteLe !== null,
      paye: p.prestations.some((l) => l.statut === 'PAYEE'),
      credit: p.prestations.some((l) => l.statut === 'CREDIT' || l.statut === 'CAS_SOCIAL'),
    }));
  }

  /** Patientes traitées (prise en charge terminée), filtrables par jour. */
  async traites(cliniqueId: number, jour?: string, page = 1, perPage = 10) {
    const debut = jour ? new Date(`${jour}T00:00:00`) : undefined;
    const fin = jour ? new Date(`${jour}T23:59:59.999`) : undefined;
    const where: any = {
      cliniqueId,
      materniteTraiteLe: { not: null },
      ...(debut ? { materniteTraiteLe: { gte: debut, lte: fin } } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.passage.findMany({
        where,
        include: { patient: true, service: { select: { nom: true } } },
        orderBy: { materniteTraiteLe: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.passage.count({ where }),
    ]);
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }

  /** Détail complet d'un passage maternité (dossier, CPON, PF, consultation). */
  async detailPassage(passageId: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: { statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] } },
          include: { prestation: true },
        },
        consultations: {
          take: 1,
          orderBy: { id: 'desc' },
          include: { medicaments: true },
        },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    const { consultations, ...reste } = passage;
    const passageReponse = { ...reste, consultation: consultations?.[0] ?? null };
    const dossier = await this.prisma.grossesse.findFirst({
      where: { patientId: passage.patientId },
      orderBy: { createdAt: 'desc' },
      include: {
        visites: { include: includeVisite, orderBy: { numero: 'asc' } },
        accouchement: true,
      },
    });
    const [cpons, pfs] = await Promise.all([
      this.prisma.consultationPostnatale.findMany({
        where: { passageId },
        include: { agent: { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } } },
        orderBy: { date: 'desc' },
      }),
      this.prisma.consultationPf.findMany({
        where: { passageId },
        include: { agent: { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } } },
        orderBy: { date: 'desc' },
      }),
    ]);
    return { passage: passageReponse, dossier, cpons, pfs };
  }

  /** Termine la prise en charge : la patiente passe dans « terminés ». */
  async terminerPassage(passageId: number) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    return this.prisma.passage.update({
      where: { id: passageId },
      data: { materniteTraiteLe: new Date() },
    });
  }

  /** Consultation du passage (ordonnance / examens) : créée à la volée. */
  async assurerConsultation(passageId: number, agentId: number) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    const existante = await this.prisma.consultation.findUnique({
      where: { passageId },
    });
    if (existante) return existante;
    return this.prisma.consultation.create({
      data: {
        passageId,
        patientId: passage.patientId,
        medecinId: agentId,
        motif: passage.motif ?? 'Consultation maternité',
      },
    });
  }

  /** Dernier dossier grossesse de la patiente (sans les détails lourds). */
  async dossierPatient(patientId: number) {
    const dossier = await this.prisma.grossesse.findFirst({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      include: {
        visites: { include: includeVisite, orderBy: { numero: 'asc' } },
        accouchement: true,
      },
    });
    if (!dossier) throw new NotFoundException('Aucun dossier de grossesse pour cette patiente.');
    return dossier;
  }

  // ─────────────────── Registre CPoN ───────────────────

  async creerCpon(passageId: number, dto: CreateCponDto, agentId: number) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    return this.prisma.consultationPostnatale.create({
      data: {
        cliniqueId: passage.cliniqueId,
        passageId,
        patientId: passage.patientId,
        grossesseId: dto.grossesseId ?? undefined,
        date: new Date(dto.date),
        modeEntree: dto.modeEntree,
        numeroGestanteReport: dto.numeroGestanteReport,
        typeCpon: dto.typeCpon,
        dateAccouchement: dto.dateAccouchement ? new Date(dto.dateAccouchement) : undefined,
        lieuAccouchement: dto.lieuAccouchement,
        modeAccouchement: dto.modeAccouchement,
        numeroDepistagePec: dto.numeroDepistagePec,
        statutVih: dto.statutVih,
        examenMere: dto.examenMere,
        examenEnfant: dto.examenEnfant,
        conseils: dto.conseils,
        observations: dto.observations,
        agentId,
      },
    });
  }

  async modifierCpon(id: number, dto: UpdateCponDto) {
    const c = await this.prisma.consultationPostnatale.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Consultation postnatale introuvable.');
    return this.prisma.consultationPostnatale.update({
      where: { id },
      data: {
        date: dto.date ? new Date(dto.date) : undefined,
        modeEntree: dto.modeEntree,
        grossesseId: dto.grossesseId,
        numeroGestanteReport: dto.numeroGestanteReport,
        typeCpon: dto.typeCpon,
        dateAccouchement: dto.dateAccouchement ? new Date(dto.dateAccouchement) : undefined,
        lieuAccouchement: dto.lieuAccouchement,
        modeAccouchement: dto.modeAccouchement,
        numeroDepistagePec: dto.numeroDepistagePec,
        statutVih: dto.statutVih,
        examenMere: dto.examenMere,
        examenEnfant: dto.examenEnfant,
        conseils: dto.conseils,
        observations: dto.observations,
      },
    });
  }

  // ─────────────────── Registre PF ───────────────────

  async creerPf(passageId: number, dto: CreatePfDto, agentId: number) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    return this.prisma.consultationPf.create({
      data: {
        cliniqueId: passage.cliniqueId,
        passageId,
        patientId: passage.patientId,
        date: new Date(dto.date),
        methode: dto.methode,
        nouvelleUtilisatrice: dto.nouvelleUtilisatrice ?? true,
        protégée: dto.protégée ?? false,
        perdueDeVue: dto.perdueDeVue ?? false,
        abandon: dto.abandon ?? false,
        arretRetrait: dto.arretRetrait ?? false,
        conseilPostpartum: dto.conseilPostpartum ?? false,
        produitPostpartumImmediat: dto.produitPostpartumImmediat ?? false,
        produitPostAbortum: dto.produitPostAbortum ?? false,
        femmesFormeesAutoInjection: dto.femmesFormeesAutoInjection ?? false,
        istPresente: dto.istPresente ?? false,
        seropositive: dto.seropositive ?? false,
        nourrisson0_6: dto.nourrisson0_6 ?? false,
        nourrisson6: dto.nourrisson6 ?? false,
        observations: dto.observations,
        agentId,
      },
    });
  }

  async modifierPf(id: number, dto: UpdatePfDto) {
    const p = await this.prisma.consultationPf.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Consultation PF introuvable.');
    return this.prisma.consultationPf.update({
      where: { id },
      data: {
        date: dto.date ? new Date(dto.date) : undefined,
        methode: dto.methode,
        nouvelleUtilisatrice: dto.nouvelleUtilisatrice,
        protégée: dto.protégée,
        perdueDeVue: dto.perdueDeVue,
        abandon: dto.abandon,
        arretRetrait: dto.arretRetrait,
        conseilPostpartum: dto.conseilPostpartum,
        produitPostpartumImmediat: dto.produitPostpartumImmediat,
        produitPostAbortum: dto.produitPostAbortum,
        femmesFormeesAutoInjection: dto.femmesFormeesAutoInjection,
        istPresente: dto.istPresente,
        seropositive: dto.seropositive,
        nourrisson0_6: dto.nourrisson0_6,
        nourrisson6: dto.nourrisson6,
        observations: dto.observations,
      },
    });
  }

  // ─────────────────── Accouchement en urgence ───────────────────
  // La patiente arrive en travail : impossible de l'enregistrer et de payer
  // d'abord. Le passage est créé SANS paiement (prestations EN_ATTENTE :
  // la caisse encaisse APRÈS l'accouchement) et le dossier grossesse est
  // créé à la volée pour permettre l'enregistrement immédiat.

  /** Service de maternité de la clinique (porteur des prestations MATERNITE). */
  async urgenceActes(cliniqueId: number) {
    const service = await this.prisma.service.findFirst({
      where: { cliniqueId, prestations: { some: { type: 'MATERNITE', actif: true } } },
      select: { id: true, nom: true },
    });
    if (!service) throw new BadRequestException('Aucun service de maternité configuré.');
    const actes = await this.prisma.prestation.findMany({
      where: { cliniqueId, serviceId: service.id, type: 'MATERNITE', actif: true },
      select: { id: true, libelle: true, montant: true },
      orderBy: { libelle: 'asc' },
    });
    return { serviceId: service.id, serviceNom: service.nom, actes };
  }

  /** Recherche rapide de patientes (toutes, pas seulement les passages payés). */
  async urgencePatients(recherche: string, cliniqueId: number) {
    const ref = recherche.trim().toUpperCase();
    if (!ref) return [];
    const refSans = ref.replace(/[\s-]/g, '');
    return this.prisma.patient.findMany({
      where: {
        cliniqueId,
        OR: [
          { code: { contains: refSans } },
          { nom: { contains: ref } },
          { prenom: { contains: ref } },
        ],
      },
      select: { id: true, code: true, nom: true, prenom: true, age: true, sexe: true, telephone: true },
      orderBy: { nom: 'asc' },
      take: 15,
    });
  }

  /** Dossier grossesse de la patiente : existant sinon créé (accouchement sans CPN). */
  private async obtenirOuCreerDossier(patientId: number, cliniqueId: number) {
    const existant = await this.prisma.grossesse.findFirst({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
    if (existant) return existant;
    return this.prisma.grossesse.create({
      data: {
        cliniqueId,
        patientId,
        numero: await this.prochainNumero(cliniqueId),
      },
    });
  }

  /**
   * Crée le dossier de grossesse du passage à la demande : une patiente peut
   * venir uniquement pour l'accouchement, sans avoir fait de CPN au préalable.
   */
  async creerDossierPassage(passageId: number) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    return this.obtenirOuCreerDossier(passage.patientId, passage.cliniqueId);
  }

  /**
   * Crée le passage en urgence : patient existant ou nouvelle patiente,
   * prestations MATERNITE EN_ATTENTE (payables après à la caisse),
   * dossier grossesse créé si absent.
   */
  async creerUrgence(
    dto: {
      cliniqueId: number;
      patientId?: number;
      nouveauPatient?: { nom: string; prenom: string; age?: number | string; sexe?: string; telephone?: string };
    },
    utilisateurId?: number,
  ) {
    const { serviceId } = await this.urgenceActes(dto.cliniqueId);

    // Passage via l'accueil : même numérotation, mêmes règles de prestations.
    // Service sans consultation (maternité) + patiente interne → tous les actes
    // MATERNITE sont EN_ATTENTE (payables à la caisse après l'accouchement).
    const passage = await this.accueil.creerPassage({
      cliniqueId: dto.cliniqueId,
      serviceId,
      patientId: dto.patientId,
      nouveauPatient: dto.nouveauPatient
        ? {
            nom: dto.nouveauPatient.nom,
            prenom: dto.nouveauPatient.prenom,
            age: dto.nouveauPatient.age,
            sexe: dto.nouveauPatient.sexe ?? 'F',
            telephone: dto.nouveauPatient.telephone,
          }
        : undefined,
      typePatient: 'INTERNE',
      motif: 'Accouchement (urgence)',
    } as any, utilisateurId);

    // Dossier grossesse obligatoire pour l'enregistrement de l'accouchement
    const dossier = await this.obtenirOuCreerDossier(passage.patientId, dto.cliniqueId);

    return {
      passage: { id: passage.id, numeroOrdre: passage.numeroOrdre, patientId: passage.patientId },
      dossier: { id: dossier.id, numero: dossier.numero },
    };
  }
}
