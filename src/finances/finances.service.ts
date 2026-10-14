import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AffectationService } from '../affectation/affectation.service';
import { PrismaService } from '../prisma/prisma.service';

const N = (x: any) => Number(x ?? 0);
const arrondi2 = (x: number) => Math.round(x * 100) / 100;

/** Au-delà de cette durée, un service oublié est fermé automatiquement et marqué « à vérifier ». */
const DUREE_MAX_SERVICE_HEURES = 26;
/** Un agent est « présent » si son poste a donné signe de vie depuis moins de 3 minutes. */
const SEUIL_PRESENCE_MS = 3 * 60 * 1000;

const includeAgent = {
  utilisateur: {
    select: {
      id: true,
      matricule: true,
      role: { select: { nom: true } },
      personnel: { select: { id: true, nom: true, prenom: true, fonction: true, photo: false } },
    },
  },
} as const;

@Injectable()
export class FinancesService {
  private readonly logger = new Logger(FinancesService.name);

  constructor(
    private prisma: PrismaService,
    private affectationService: AffectationService,
  ) {}

  // ═══════════════ POINTAGE DE SERVICE ═══════════════

  private async utilisateur(utilisateurId: number) {
    const u = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: {
        role: { select: { code: true } },
        personnel: { select: { id: true, cliniqueId: true, nom: true, prenom: true } },
      },
    });
    if (!u) throw new NotFoundException('Utilisateur introuvable.');
    return u;
  }

  /**
   * Un médecin ne reçoit des patients que pendant son service :
   * prise de service → Disponible (+ redistribution), fin de service → Indisponible.
   */
  private async synchroniserDisponibilite(
    u: { id: number; role: { code: string }; personnel: { cliniqueId: number } | null },
    disponibilite: 'DISPONIBLE' | 'INDISPONIBLE',
  ) {
    if (u.role.code !== 'MEDECIN') return;
    await this.prisma.utilisateur.update({
      where: { id: u.id },
      data: { disponibilite, derniereActivite: new Date() },
    });
    if (disponibilite === 'DISPONIBLE' && u.personnel?.cliniqueId) {
      try {
        await this.affectationService.redistribuerNonAffectees(u.personnel.cliniqueId);
      } catch {
        /* la redistribution est tolérante */
      }
    }
  }

  /** Service en cours de l'utilisateur connecté (null s'il n'est pas en service). */
  async monService(utilisateurId: number) {
    const service = await this.prisma.serviceAgent.findFirst({
      where: { utilisateurId, statut: 'EN_COURS' },
      orderBy: { debut: 'desc' },
    });
    return { service: service ? this.formaterService(service) : null };
  }

  /** « Prendre mon service » : ouvre un service (un seul à la fois). */
  async prendreService(utilisateurId: number) {
    const u = await this.utilisateur(utilisateurId);
    const ouvert = await this.prisma.serviceAgent.findFirst({
      where: { utilisateurId, statut: 'EN_COURS' },
    });
    if (ouvert) throw new BadRequestException('Vous êtes déjà en service depuis ' + ouvert.debut.toLocaleString('fr-FR') + '.');
    const maintenant = new Date();
    const service = await this.prisma.serviceAgent.create({
      data: {
        cliniqueId: u.personnel.cliniqueId,
        utilisateurId,
        personnelId: u.personnel.id,
        debut: maintenant,
        derniereActivite: maintenant,
      },
    });
    await this.synchroniserDisponibilite(u, 'DISPONIBLE');
    return { service: this.formaterService(service) };
  }

  /** « Terminer mon service ». */
  async terminerService(utilisateurId: number) {
    const u = await this.utilisateur(utilisateurId);
    const ouvert = await this.prisma.serviceAgent.findFirst({
      where: { utilisateurId, statut: 'EN_COURS' },
    });
    if (!ouvert) throw new BadRequestException("Vous n'êtes pas en service.");
    const service = await this.prisma.serviceAgent.update({
      where: { id: ouvert.id },
      data: { fin: new Date(), statut: 'TERMINE' },
    });
    await this.synchroniserDisponibilite(u, 'INDISPONIBLE');
    return { service: this.formaterService(service) };
  }

  /**
   * Signal de présence (envoyé chaque minute par le poste de l'agent en service) :
   * mesure le temps réellement passé devant l'application pendant le service.
   */
  async presence(utilisateurId: number) {
    const ouvert = await this.prisma.serviceAgent.findFirst({
      where: { utilisateurId, statut: 'EN_COURS' },
    });
    if (!ouvert) return { enService: false };
    const maintenant = new Date();
    const ecartMin = (maintenant.getTime() - (ouvert.derniereActivite ?? ouvert.debut).getTime()) / 60000;
    // Au plus 2 minutes comptées par signal : un poste resté éteint ne compte pas
    const ajout = Math.max(0, Math.min(2, Math.round(ecartMin)));
    await this.prisma.serviceAgent.update({
      where: { id: ouvert.id },
      data: { derniereActivite: maintenant, minutesPresence: { increment: ajout } },
    });
    return { enService: true };
  }

  /**
   * Services oubliés : fermés automatiquement après 26 h, à l'heure du dernier
   * signal de présence, et marqués « à vérifier » pour le responsable.
   */
  @Interval(10 * 60 * 1000)
  async fermerServicesOublies() {
    const limite = new Date(Date.now() - DUREE_MAX_SERVICE_HEURES * 3600 * 1000);
    const oublies = await this.prisma.serviceAgent.findMany({
      where: { statut: 'EN_COURS', debut: { lt: limite } },
    });
    for (const s of oublies) {
      await this.prisma.serviceAgent.update({
        where: { id: s.id },
        data: {
          fin: s.derniereActivite && s.derniereActivite > s.debut ? s.derniereActivite : new Date(s.debut.getTime() + DUREE_MAX_SERVICE_HEURES * 3600 * 1000),
          statut: 'A_VERIFIER',
          fermetureAuto: true,
        },
      });
      await this.synchroniserDisponibilite(await this.utilisateur(s.utilisateurId), 'INDISPONIBLE');
    }
    if (oublies.length) this.logger.warn(`${oublies.length} service(s) oublié(s) fermé(s) automatiquement.`);
    return oublies.length;
  }

  private formaterService(s: any) {
    const fin = s.fin ?? new Date();
    const heures = (fin.getTime() - s.debut.getTime()) / 3600000;
    return {
      ...s,
      heuresRetenues: s.heuresRetenues != null ? N(s.heuresRetenues) : null,
      vacationsRetenues: s.vacationsRetenues != null ? N(s.vacationsRetenues) : null,
      heures: arrondi2(heures),
    };
  }

  // ═══════════════ EN SERVICE EN TEMPS RÉEL ═══════════════

  /** Agents actuellement en service, avec leur durée et leur présence sur le poste. */
  async enService(cliniqueId: number) {
    await this.fermerServicesOublies();
    const services = await this.prisma.serviceAgent.findMany({
      where: { cliniqueId, statut: 'EN_COURS' },
      include: includeAgent,
      orderBy: { debut: 'asc' },
    });
    const maintenant = Date.now();
    const lignes = services.map((s) => {
      const derniere = (s.derniereActivite ?? s.debut).getTime();
      return {
        id: s.id,
        debut: s.debut,
        derniereActivite: s.derniereActivite,
        heures: arrondi2((maintenant - s.debut.getTime()) / 3600000),
        minutesPresence: s.minutesPresence,
        present: maintenant - derniere < SEUIL_PRESENCE_MS,
        agent: {
          utilisateurId: s.utilisateur.id,
          matricule: s.utilisateur.matricule,
          nom: s.utilisateur.personnel?.nom ?? '',
          prenom: s.utilisateur.personnel?.prenom ?? '',
          fonction: s.utilisateur.personnel?.fonction ?? '',
          role: s.utilisateur.role?.nom ?? '',
        },
      };
    });
    return {
      lignes,
      total: lignes.length,
      presents: lignes.filter((l) => l.present).length,
      maintenant: new Date(),
    };
  }

  // ═══════════════ SERVICES DU MOIS (contrôle et validation) ═══════════════

  private bornesMois(mois: string) {
    const m = /^(\d{4})-(\d{2})$/.exec(mois ?? '');
    if (!m) throw new BadRequestException('Mois invalide (format AAAA-MM).');
    const debut = new Date(Number(m[1]), Number(m[2]) - 1, 1);
    const fin = new Date(Number(m[1]), Number(m[2]), 1);
    return { debut, fin };
  }

  /** Durée d'une vacation pour un agent (24 h par défaut). */
  private dureeVacation(remu: any) {
    return remu?.dureeVacationHeures && remu.dureeVacationHeures > 0 ? remu.dureeVacationHeures : 24;
  }

  /** Heures et vacations d'un service (valeurs corrigées par le responsable si elles existent). */
  private calculerService(s: any, remu: any) {
    const fin = s.fin ?? new Date();
    const heuresBrutes = arrondi2((fin.getTime() - s.debut.getTime()) / 3600000);
    const heures = s.heuresRetenues != null ? N(s.heuresRetenues) : heuresBrutes;
    // Par défaut : au prorata de la durée d'une vacation (22 h sur 24 h = 0,92 vacation)
    const vacations = s.vacationsRetenues != null ? N(s.vacationsRetenues) : arrondi2(heures / this.dureeVacation(remu));
    return { heuresBrutes, heures, vacations };
  }

  async services(cliniqueId: number, mois: string, personnelId?: number) {
    await this.fermerServicesOublies();
    const { debut, fin } = this.bornesMois(mois);
    const [services, remus] = await Promise.all([
      this.prisma.serviceAgent.findMany({
        where: { cliniqueId, debut: { gte: debut, lt: fin }, ...(personnelId ? { personnelId } : {}) },
        include: {
          ...includeAgent,
          validePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
        },
        orderBy: { debut: 'desc' },
      }),
      this.prisma.remunerationAgent.findMany({ where: { cliniqueId } }),
    ]);
    return services.map((s) => {
      const remu = remus.find((r) => r.personnelId === s.personnelId);
      return {
        id: s.id,
        debut: s.debut,
        fin: s.fin,
        statut: s.statut,
        fermetureAuto: s.fermetureAuto,
        minutesPresence: s.minutesPresence,
        motifCorrection: s.motifCorrection,
        valideLe: s.valideLe,
        validePar: s.validePar?.personnel ? `${s.validePar.personnel.nom} ${s.validePar.personnel.prenom}` : null,
        corrige: s.heuresRetenues != null || s.vacationsRetenues != null,
        ...this.calculerService(s, remu),
        personnelId: s.personnelId,
        agent: {
          nom: s.utilisateur.personnel?.nom ?? '',
          prenom: s.utilisateur.personnel?.prenom ?? '',
          fonction: s.utilisateur.personnel?.fonction ?? '',
        },
      };
    });
  }

  /** Correction / validation / rejet d'un service par le responsable (motif obligatoire pour une correction). */
  async modifierService(
    id: number,
    dto: { debut?: string; fin?: string; heuresRetenues?: any; vacationsRetenues?: any; motif?: string; statut?: string },
    utilisateurId: number,
  ) {
    const s = await this.prisma.serviceAgent.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Service introuvable.');
    if (s.statut === 'EN_COURS' && dto.statut) {
      throw new BadRequestException("Ce service est encore en cours : l'agent doit d'abord le terminer.");
    }
    const fiche = await this.prisma.ficheVacation.findFirst({
      where: { personnelId: s.personnelId, mois: this.moisDe(s.debut), statut: { in: ['VALIDEE', 'PAYEE'] } },
    });
    if (fiche) throw new BadRequestException('La fiche de vacation de ce mois est déjà validée : service non modifiable.');

    const data: any = {};
    const corrige = ['debut', 'fin', 'heuresRetenues', 'vacationsRetenues'].some((k) => dto[k] !== undefined);
    if (corrige && !dto.motif?.trim()) throw new BadRequestException('Indiquez le motif de la correction.');
    if (dto.debut) data.debut = new Date(dto.debut);
    if (dto.fin) data.fin = new Date(dto.fin);
    if ((data.fin ?? s.fin) && (data.debut ?? s.debut) >= (data.fin ?? s.fin)) {
      throw new BadRequestException('La fin du service doit être après son début.');
    }
    const nombre = (v: any) => (v === null || v === '' ? null : Number(v));
    if (dto.heuresRetenues !== undefined) data.heuresRetenues = nombre(dto.heuresRetenues);
    if (dto.vacationsRetenues !== undefined) data.vacationsRetenues = nombre(dto.vacationsRetenues);
    for (const k of ['heuresRetenues', 'vacationsRetenues']) {
      if (data[k] != null && (isNaN(data[k]) || data[k] < 0)) throw new BadRequestException('Valeur invalide.');
    }
    if (dto.motif?.trim()) data.motifCorrection = dto.motif.trim();
    if (dto.statut) {
      if (!['VALIDE', 'REJETE', 'TERMINE'].includes(dto.statut)) throw new BadRequestException('Statut invalide.');
      data.statut = dto.statut;
      data.valideParId = dto.statut === 'TERMINE' ? null : utilisateurId;
      data.valideLe = dto.statut === 'TERMINE' ? null : new Date();
    }
    return this.prisma.serviceAgent.update({ where: { id }, data });
  }

  private moisDe(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  // ═══════════════ TARIFS DES AGENTS ═══════════════

  /** Personnel de la clinique avec son mode de rémunération (null si non paramétré). */
  async remunerations(cliniqueId: number) {
    const [personnel, remus] = await Promise.all([
      this.prisma.personnel.findMany({
        where: { cliniqueId, statut: 'ACTIF' },
        select: { id: true, matricule: true, nom: true, prenom: true, fonction: true, utilisateur: { select: { id: true } } },
        orderBy: [{ nom: 'asc' }, { prenom: 'asc' }],
      }),
      this.prisma.remunerationAgent.findMany({ where: { cliniqueId } }),
    ]);
    return personnel.map((p) => {
      const r = remus.find((x) => x.personnelId === p.id);
      return {
        personnelId: p.id,
        matricule: p.matricule,
        nom: p.nom,
        prenom: p.prenom,
        fonction: p.fonction,
        aUnCompte: !!p.utilisateur,
        remuneration: r ? { ...r, tarif: N(r.tarif) } : null,
      };
    });
  }

  async definirRemuneration(
    personnelId: number,
    dto: { statut?: string; mode?: string; tarif?: any; dureeVacationHeures?: any; actif?: boolean },
  ) {
    const p = await this.prisma.personnel.findUnique({ where: { id: personnelId } });
    if (!p) throw new NotFoundException('Agent introuvable.');
    const mode = dto.mode === 'HEURE' ? 'HEURE' : 'VACATION';
    const tarif = Number(dto.tarif);
    if (isNaN(tarif) || tarif < 0) throw new BadRequestException('Tarif invalide.');
    const duree = Math.round(Number(dto.dureeVacationHeures ?? 24));
    if (!duree || duree < 1 || duree > 48) throw new BadRequestException('Durée de vacation invalide (1 à 48 h).');
    const data = {
      statut: dto.statut === 'SALARIE' ? 'SALARIE' : 'VACATAIRE',
      mode,
      tarif,
      dureeVacationHeures: duree,
      actif: dto.actif !== false,
    };
    const r = await this.prisma.remunerationAgent.upsert({
      where: { personnelId },
      create: { cliniqueId: p.cliniqueId, personnelId, ...data },
      update: data,
    });
    return { ...r, tarif: N(r.tarif) };
  }

  // ═══════════════ FICHES DE VACATION MENSUELLES ═══════════════

  /**
   * Calcule (ou recalcule) les fiches du mois pour les agents rémunérés.
   * Les fiches déjà validées ou payées ne sont jamais modifiées.
   * Les services rejetés ne comptent pas ; les services « à vérifier » comptent
   * mais sont signalés sur la fiche.
   */
  async genererFiches(cliniqueId: number, mois: string) {
    const { debut, fin } = this.bornesMois(mois);
    await this.fermerServicesOublies();
    const remus = await this.prisma.remunerationAgent.findMany({ where: { cliniqueId, actif: true } });
    let creees = 0, misesAJour = 0, figees = 0;
    for (const remu of remus) {
      const existante = await this.prisma.ficheVacation.findUnique({
        where: { personnelId_mois: { personnelId: remu.personnelId, mois } },
      });
      if (existante && existante.statut !== 'BROUILLON') { figees += 1; continue; }
      const services = await this.prisma.serviceAgent.findMany({
        where: {
          personnelId: remu.personnelId,
          debut: { gte: debut, lt: fin },
          statut: { in: ['TERMINE', 'VALIDE', 'A_VERIFIER'] },
        },
      });
      if (!services.length && !existante) continue;
      let heures = 0, vacations = 0;
      for (const s of services) {
        const c = this.calculerService(s, remu);
        heures += c.heures;
        vacations += c.vacations;
      }
      heures = arrondi2(heures);
      vacations = arrondi2(vacations);
      const tarif = N(remu.tarif);
      const montantBase = Math.round((remu.mode === 'HEURE' ? heures : vacations) * tarif);
      const primes = N(existante?.primes);
      const retenues = N(existante?.retenues);
      const data = {
        nbServices: services.length,
        nbAVerifier: services.filter((s) => s.statut === 'A_VERIFIER').length,
        heures,
        vacations,
        mode: remu.mode,
        tarif,
        dureeVacationHeures: this.dureeVacation(remu),
        montantBase,
        montantTotal: montantBase + primes - retenues,
      };
      if (existante) {
        await this.prisma.ficheVacation.update({ where: { id: existante.id }, data });
        misesAJour += 1;
      } else {
        await this.prisma.ficheVacation.create({ data: { cliniqueId, personnelId: remu.personnelId, mois, ...data } });
        creees += 1;
      }
    }
    return { creees, misesAJour, figees };
  }

  async fiches(cliniqueId: number, mois: string) {
    this.bornesMois(mois);
    const fiches = await this.prisma.ficheVacation.findMany({
      where: { cliniqueId, mois },
      include: {
        personnel: { select: { nom: true, prenom: true, matricule: true, fonction: true } },
        validePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
      },
      orderBy: { personnel: { nom: 'asc' } },
    });
    const lignes = fiches.map((f) => ({
      ...f,
      heures: N(f.heures),
      vacations: N(f.vacations),
      tarif: N(f.tarif),
      montantBase: N(f.montantBase),
      primes: N(f.primes),
      retenues: N(f.retenues),
      montantTotal: N(f.montantTotal),
      validePar: f.validePar?.personnel ? `${f.validePar.personnel.nom} ${f.validePar.personnel.prenom}` : null,
    }));
    return {
      lignes,
      total: lignes.reduce((s, l) => s + l.montantTotal, 0),
    };
  }

  /** Primes, retenues et commentaire d'une fiche encore en brouillon. */
  async modifierFiche(id: number, dto: { primes?: any; retenues?: any; commentaire?: string }) {
    const f = await this.prisma.ficheVacation.findUnique({ where: { id } });
    if (!f) throw new NotFoundException('Fiche introuvable.');
    if (f.statut !== 'BROUILLON') throw new BadRequestException('Fiche déjà validée : modification impossible.');
    const primes = dto.primes !== undefined ? Number(dto.primes) || 0 : N(f.primes);
    const retenues = dto.retenues !== undefined ? Number(dto.retenues) || 0 : N(f.retenues);
    if (primes < 0 || retenues < 0) throw new BadRequestException('Montants invalides.');
    return this.prisma.ficheVacation.update({
      where: { id },
      data: {
        primes,
        retenues,
        commentaire: dto.commentaire !== undefined ? dto.commentaire?.trim() || null : f.commentaire,
        montantTotal: N(f.montantBase) + primes - retenues,
      },
    });
  }

  /** Validation (fige la fiche et les services du mois) puis paiement. */
  async changerStatutFiche(id: number, statut: 'VALIDEE' | 'PAYEE' | 'BROUILLON', utilisateurId: number) {
    const f = await this.prisma.ficheVacation.findUnique({ where: { id } });
    if (!f) throw new NotFoundException('Fiche introuvable.');
    const transitions: Record<string, string[]> = { BROUILLON: ['VALIDEE'], VALIDEE: ['PAYEE', 'BROUILLON'], PAYEE: [] };
    if (!transitions[f.statut]?.includes(statut)) {
      throw new BadRequestException(`Passage de « ${f.statut} » à « ${statut} » impossible.`);
    }
    const data: any = { statut };
    if (statut === 'VALIDEE') Object.assign(data, { valideParId: utilisateurId, valideLe: new Date() });
    if (statut === 'BROUILLON') Object.assign(data, { valideParId: null, valideLe: null });
    if (statut === 'PAYEE') data.payeLe = new Date();
    return this.prisma.ficheVacation.update({ where: { id }, data });
  }

  /** Détail d'une fiche avec la liste de ses services (impression). */
  async detailFiche(id: number) {
    const f = await this.prisma.ficheVacation.findUnique({ where: { id } });
    if (!f) throw new NotFoundException('Fiche introuvable.');
    const services = await this.services(f.cliniqueId, f.mois, f.personnelId);
    return { services: services.filter((s) => s.statut !== 'REJETE' && s.statut !== 'EN_COURS') };
  }
}
