import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
  constructor(private prisma: PrismaService) {}

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
        { patient: { is: { nom: { contains: recherche } } } },
        { patient: { is: { prenom: { contains: recherche } } } },
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
    const nb = await this.prisma.visiteCpn.count({ where: { grossesseId } });
    return this.prisma.visiteCpn.create({
      data: {
        grossesseId,
        numero: nb + 1,
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
    return this.prisma.visiteCpn.update({
      where: { id },
      data: {
        date: dto.date ? new Date(dto.date) : undefined,
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
        statut: 'ACTIF',
        materniteTraiteLe: null,
        prestations: {
          some: { statut: 'PAYEE', prestation: { type: 'MATERNITE' } },
        },
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: { statut: 'PAYEE', prestation: { type: 'MATERNITE' } },
          select: { libelle: true },
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
        statut: 'ACTIF',
        prestations: { some: { statut: 'PAYEE', prestation: { type: 'MATERNITE' } } },
        OR: [
          { numeroOrdre: { contains: ref } },
          { patient: { is: { code: refSans } } },
          { patient: { is: { nom: { contains: ref } } } },
          { patient: { is: { prenom: { contains: ref } } } },
        ],
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: { statut: 'PAYEE', prestation: { type: 'MATERNITE' } },
          select: { libelle: true },
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
          where: { statut: 'PAYEE' },
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
}
