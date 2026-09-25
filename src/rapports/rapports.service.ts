import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Valeur = { ligne: number; colonne: number; valeur: number | null };

// Portes Oui/Non des sections du formulaire officiel (valeur par défaut : true)
const PORTES_DEFAUT = {
  ACTIVITES: true,
  CPN: true,
  ACCOUCHEMENTS: true,
  MILDA_VITA: true,
  NUTRITION: true,
  VIH: true,
  CCC: true,
  CANCER_COL: true,
  PF: true,
  MORBIDITE: true,
  MORTALITE: true,
  TESTS_RAPIDES: true,
  LABORATOIRE: true,
  FINANCES: true,
};

/**
 * Module Rapports — rapport mensuel officiel SIG (DIIS).
 *
 * Principe : un rapport par clinique et par mois. L'en-tête (établissement,
 * immatriculation, district, région, population, « réalisé par ») est copiée
 * depuis la fiche clinique à la création et reste modifiable sur chaque
 * rapport. Les valeurs des 47 tableaux sont stockées en ligne/colonne.
 * Le préremplissage calcule ce que l'application trace déjà ; tout le reste
 * se saisit à la main, comme sur le formulaire papier.
 */
@Injectable()
export class RapportsService {
  constructor(private prisma: PrismaService) {}

  // ───────────────────────── En-tête et portes ─────────────────────────

  private portes(portes: string | null): Record<string, boolean> {
    try {
      return { ...PORTES_DEFAUT, ...JSON.parse(portes ?? '{}') };
    } catch {
      return { ...PORTES_DEFAUT };
    }
  }

  async lister(cliniqueId: number) {
    return this.prisma.rapportSig.findMany({
      where: { cliniqueId },
      orderBy: [{ annee: 'desc' }, { mois: 'desc' }],
      select: { id: true, mois: true, annee: true, statut: true, updatedAt: true },
    });
  }

  async getRapport(cliniqueId: number, mois: number, annee: number) {
    let rapport = await this.prisma.rapportSig.findUnique({
      where: { cliniqueId_mois_annee: { cliniqueId, mois, annee } },
      include: { valeurs: true },
    });
    // Logos et lettre de version de la page de garde (Paramétrage → Paramètres)
    const clinique = await this.prisma.clinique.findUnique({
      where: { id: cliniqueId },
      include: { parametre: true },
    });
    if (!clinique) throw new NotFoundException('Clinique introuvable.');
    if (!rapport) {
      rapport = await this.prisma.rapportSig.create({
        data: {
          cliniqueId,
          mois,
          annee,
          etablissement: clinique.nom,
          immatriculation: clinique.immatriculation,
          districtNom: clinique.districtNom,
          districtCode: clinique.districtCode,
          regionNom: clinique.regionNom,
          regionCode: clinique.regionCode,
          populationDesservie: clinique.populationDesservie,
          realiseParNom: clinique.responsableRapportNom,
          realiseParFonction: clinique.responsableRapportFonction,
          realiseParContact: clinique.responsableRapportContact,
          portes: JSON.stringify(PORTES_DEFAUT),
        },
        include: { valeurs: true },
      });
    }
    return {
      ...rapport,
      portes: this.portes(rapport.portes),
      parametres: clinique.parametre
        ? {
            logoRapportGauche: clinique.parametre.logoRapportGauche,
            logoRapportCentre: clinique.parametre.logoRapportCentre,
            logoRapportDroit: clinique.parametre.logoRapportDroit,
            sigVersion: clinique.parametre.sigVersion ?? 'A',
          }
        : null,
    };
  }

  async update(id: number, body: Record<string, unknown>) {
    const data: Record<string, unknown> = {};
    for (const f of [
      'etablissement',
      'immatriculation',
      'districtNom',
      'districtCode',
      'regionNom',
      'regionCode',
      'realiseParNom',
      'realiseParFonction',
      'realiseParContact',
      'observations',
      'statut',
    ]) {
      if (body[f] !== undefined) data[f] = body[f] === '' ? null : body[f];
    }
    if (body.populationDesservie !== undefined) {
      data.populationDesservie =
        body.populationDesservie === '' || body.populationDesservie === null
          ? null
          : Number(body.populationDesservie);
    }
    if (body.portes !== undefined) {
      const actuel = await this.prisma.rapportSig.findUnique({ where: { id }, select: { portes: true } });
      if (!actuel) throw new NotFoundException('Rapport introuvable.');
      data.portes = JSON.stringify({
        ...this.portes(actuel.portes),
        ...(body.portes as Record<string, boolean>),
      });
    }
    const rapport = await this.prisma.rapportSig.update({
      where: { id },
      data,
      include: { valeurs: true },
    });
    return { ...rapport, portes: this.portes(rapport.portes) };
  }

  /** Réimporte l'en-tête depuis la fiche clinique (les observations restent inchangées). */
  async reimporterEntete(id: number) {
    const rapport = await this.prisma.rapportSig.findUnique({ where: { id } });
    if (!rapport) throw new NotFoundException('Rapport introuvable.');
    const clinique = await this.prisma.clinique.findUnique({ where: { id: rapport.cliniqueId } });
    if (!clinique) throw new NotFoundException('Clinique introuvable.');
    const maj = await this.prisma.rapportSig.update({
      where: { id },
      data: {
        etablissement: clinique.nom,
        immatriculation: clinique.immatriculation,
        districtNom: clinique.districtNom,
        districtCode: clinique.districtCode,
        regionNom: clinique.regionNom,
        regionCode: clinique.regionCode,
        populationDesservie: clinique.populationDesservie,
        realiseParNom: clinique.responsableRapportNom,
        realiseParFonction: clinique.responsableRapportFonction,
        realiseParContact: clinique.responsableRapportContact,
      },
    });
    return { ...maj, portes: this.portes(maj.portes) };
  }

  /** Remplace toutes les valeurs d'un tableau (les cellules vides sont supprimées). */
  async saveValeurs(id: number, tableau: string, valeurs: Valeur[]) {
    const rapport = await this.prisma.rapportSig.findUnique({ where: { id } });
    if (!rapport) throw new NotFoundException('Rapport introuvable.');
    const propres = valeurs
      .filter((v) => v && v.ligne >= 0 && v.colonne >= 0)
      .filter((v) => v.valeur !== null && v.valeur !== undefined && !Number.isNaN(Number(v.valeur)))
      .map((v) => ({
        rapportId: id,
        tableau,
        ligne: v.ligne,
        colonne: v.colonne,
        valeur: Math.max(0, Math.round(Number(v.valeur))),
      }));
    await this.prisma.$transaction([
      this.prisma.rapportSigValeur.deleteMany({ where: { rapportId: id, tableau } }),
      ...(propres.length
        ? [this.prisma.rapportSigValeur.createMany({ data: propres })]
        : []),
    ]);
    return { tableau, enregistrees: propres.length };
  }

  // ───────────────────────── Préremplissage ─────────────────────────

  private bandeAge(ageStr: string | null | undefined): number {
    const age = parseInt(String(ageStr ?? '').trim(), 10);
    if (isNaN(age)) return -1;
    if (age <= 4) return 0;
    if (age <= 9) return 1;
    if (age <= 14) return 2;
    if (age <= 19) return 3;
    if (age <= 24) return 4;
    if (age <= 49) return 5;
    return 6;
  }

  private bandeAccouchement(ageStr: string | null | undefined): number {
    const age = parseInt(String(ageStr ?? '').trim(), 10);
    if (isNaN(age)) return -1;
    if (age <= 14) return 0;
    if (age <= 19) return 1;
    if (age <= 24) return 2;
    if (age <= 49) return 3;
    return 4;
  }

  /** Convertit une grille en cellules non nulles. */
  private gridToValeurs(grid: number[][]): Valeur[] {
    const out: Valeur[] = [];
    grid.forEach((ligne, l) =>
      ligne.forEach((v, c) => {
        if (v > 0) out.push({ ligne: l, colonne: c, valeur: Math.round(v) });
      }),
    );
    return out;
  }

  /**
   * Préremplit les tableaux calculables et remplace leurs valeurs.
   * Les chiffres restent modifiables à la main ensuite (le préremplissage
   * est une aide, pas une vérité comptable).
   */
  async preRemplir(id: number) {
    const rapport = await this.prisma.rapportSig.findUnique({ where: { id } });
    if (!rapport) throw new NotFoundException('Rapport introuvable.');
    const cliniqueId = rapport.cliniqueId;
    const debut = new Date(rapport.annee, rapport.mois - 1, 1);
    const fin = new Date(rapport.annee, rapport.mois, 1);

    // Données communes du mois
    const [consultations, accouchements, visitesCpn] = await Promise.all([
      this.prisma.consultation.findMany({
        where: { passage: { cliniqueId }, createdAt: { gte: debut, lt: fin } },
        include: { patient: true },
      }),
      this.prisma.accouchement.findMany({
        where: { dateHeure: { gte: debut, lt: fin }, grossesse: { cliniqueId } },
        include: { grossesse: { include: { patient: true } } },
      }),
      this.prisma.visiteCpn.findMany({
        where: { date: { gte: debut, lt: fin }, grossesse: { cliniqueId } },
      }),
    ]);

    const calculs: Record<string, Valeur[]> = {};
    calculs.T1 = this.calcT1(consultations);
    calculs.T2 = await this.calcT2(cliniqueId, debut, fin);
    calculs.T3 = this.calcT3(visitesCpn);
    calculs.T4 = this.calcT4(visitesCpn);
    calculs.T5 = this.calcT5(visitesCpn);
    calculs.T6 = this.calcT6(accouchements);
    calculs.T7 = this.calcT7(accouchements);
    calculs.T8 = this.calcT8(accouchements);
    calculs.T9 = this.calcT9(accouchements);
    calculs.T10A = this.calcT10A(accouchements);
    calculs.T10B = await this.calcT10B(cliniqueId, debut, fin);
    calculs.T30A = await this.calcT30A(cliniqueId, debut, fin);
    calculs.T30B = await this.calcT30B(cliniqueId, debut, fin);
    calculs.T38 = this.calcT38(consultations, accouchements);
    calculs.T39 = this.calcT39(accouchements);
    calculs.T40 = this.calcT40(consultations);
    calculs.T45 = await this.calcT45(cliniqueId, debut, fin);

    for (const [tableau, valeurs] of Object.entries(calculs)) {
      await this.saveValeurs(id, tableau, valeurs);
    }
    return calculs;
  }

  /** T1 : activités de soins curatifs (colonnes : tranches d'âge + total). */
  private calcT1(consultations: ConsultationAvecPatient[]): Valeur[] {
    const grid = Array.from({ length: 6 }, () => Array(8).fill(0));
    for (const c of consultations) {
      const b = this.bandeAge(c.patient?.age);
      const duree = (c.moDureeHeures ?? 0) + (c.moDureeMinutes ?? 0) / 60;
      const isMO = c.issueSortie === 'MO' || c.typeHospitalisation === 'MISE_EN_OBSERVATION';
      const inc = (l: number) => {
        grid[l][7] += 1;
        if (b >= 0) grid[l][b] += 1;
      };
      if (c.consultantType !== 'CONTROLE') inc(0); // consultant = nouveau cas
      inc(1); // consultation
      if (isMO) {
        inc(2);
        grid[3][7] += duree;
        if (b >= 0) grid[3][b] += duree;
      }
      if (c.issueSortie === 'REFERE_EXTERNE') inc(4);
    }
    return this.gridToValeurs(grid);
  }

  /** T2 : soins infirmiers et petite chirurgie (colonnes : Nombre). */
  private async calcT2(cliniqueId: number, debut: Date, fin: Date): Promise<Valeur[]> {
    const realisations = await this.prisma.realisationSoin.findMany({
      where: { soin: { cliniqueId }, date: { gte: debut, lt: fin } },
      include: { soin: { select: { libelle: true } } },
    });
    const grid = Array.from({ length: 8 }, () => [0]);
    for (const r of realisations) {
      const lib = (r.soin?.libelle ?? '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      let row = 3; // Autres soins
      if (lib.includes('PANSEMENT')) row = 0;
      else if (lib.includes('INJECTION') || lib.includes('INJECTABLE')) row = 1;
      else if (lib.includes('PERFUSION')) row = 2;
      else if (lib.includes('CIRCONCISION')) row = 4;
      else if (lib.includes('SUTURE')) row = 5;
      else if (lib.includes('ABCES')) row = 6;
      grid[row][0] += 1;
    }
    return this.gridToValeurs(grid);
  }

  /** T3 : consultations prénatales (colonnes : Nombre). */
  private calcT3(visites: VisiteCpnSIG[]): Valeur[] {
    const grid = Array.from({ length: 8 }, () => [0]);
    const sa = (v: { ageGestationnelSA: string | null }): number | null => {
      const m = parseInt(String(v.ageGestationnelSA ?? ''), 10);
      return isNaN(m) ? null : m;
    };
    for (const v of visites) {
      const s = sa(v);
      if (v.numero === 1) {
        grid[s !== null && s <= 14 ? 0 : 1][0] += 1;
        grid[2][0] += 1;
      } else if (v.numero === 2) grid[3][0] += 1;
      else if (v.numero === 3) grid[4][0] += 1;
      else if (v.numero === 4) grid[s !== null && s >= 36 ? 5 : 6][0] += 1;
      else grid[7][0] += 1;
    }
    return this.gridToValeurs(grid);
  }

  /** T4 : dépistage des grossesses à risque en CPN (colonnes : Nombre). */
  private calcT4(visites: VisiteCpnSIG[]): Valeur[] {
    const grid = Array.from({ length: 5 }, () => [0]);
    for (const v of visites) {
      if (v.numero === 1 && v.risqueDepiste) grid[0][0] += 1;
      if (v.malnutrition) grid[1][0] += 1;
      if (v.anemie) grid[2][0] += 1;
      if (v.syphilisPositif) grid[3][0] += 1;
      if (v.agHbsPositif) grid[4][0] += 1;
    }
    return this.gridToValeurs(grid);
  }

  /** T5 : prévention au cours de la grossesse (colonnes : Nombre). */
  private calcT5(visites: VisiteCpnSIG[]): Valeur[] {
    const grid = Array.from({ length: 9 }, () => [0]);
    for (const v of visites) {
      if (v.spDose !== null && v.spDose !== undefined && v.spDose >= 1 && v.spDose <= 5) {
        grid[v.spDose - 1][0] += 1;
      }
      if (v.mildaRemise) grid[5][0] += 1;
      if (v.ferFolate) grid[6][0] += 1;
      if (v.deparasitee) grid[7][0] += 1;
      if (v.counselingPfppi) grid[8][0] += 1;
    }
    return this.gridToValeurs(grid);
  }

  /** T6 : lieu d'accouchement (colonnes : 08-14, 15-19, 20-24, 25-49, 50+, Total). */
  private calcT6(accouchements: AccouchementAvecPatiente[]): Valeur[] {
    const grid = Array.from({ length: 4 }, () => Array(6).fill(0));
    for (const a of accouchements) {
      const b = this.bandeAccouchement(a.grossesse?.patient?.age);
      const domicile = (a.lieu ?? '').toUpperCase().includes('DOMICILE');
      const inc = (l: number) => {
        grid[l][5] += 1;
        if (b >= 0) grid[l][b] += 1;
      };
      inc(domicile ? 1 : 0);
      inc(2);
      if ((a.issueMere ?? '').toUpperCase().includes('TRANSF') || (a.issueMere ?? '').toUpperCase().includes('EVACU')) {
        inc(3);
      }
    }
    return this.gridToValeurs(grid);
  }

  /** T7 : statut vaccinal au VAT à l'accouchement (colonnes : Nombre). */
  private calcT7(accouchements: AccouchementAvecPatiente[]): Valeur[] {
    const grid = Array.from({ length: 4 }, () => [0]);
    for (const a of accouchements) {
      if (a.vatStatut === 'CORRECTEMENT_VACCINEE') grid[0][0] += 1;
      else if (a.vatStatut === 'INCOMPLETEMENT_VACCINEE') grid[1][0] += 1;
      else if (a.vatStatut === 'NON_VACCINEE') grid[2][0] += 1;
      grid[3][0] += 1;
    }
    return this.gridToValeurs(grid);
  }

  /** T8 : issue de la grossesse (colonnes : Nombre). */
  private calcT8(accouchements: AccouchementAvecPatiente[]): Valeur[] {
    const grid = Array.from({ length: 9 }, () => [0]);
    for (const a of accouchements) {
      const issue = (a.issueEnfant ?? '').toUpperCase();
      if (issue.includes('VIVANT')) grid[0][0] += 1;
      if (issue.includes('MORT')) {
        if (a.mortNeType === 'MACERE') grid[2][0] += 1;
        else grid[1][0] += 1;
      }
      const poids = Number(a.poidsEnfant);
      if (!isNaN(poids) && poids < 2.5) grid[3][0] += 1;
      const terme = parseInt(String(a.termeSA ?? ''), 10);
      if (!isNaN(terme) && terme < 37) grid[4][0] += 1;
      if (a.nouveauNeProtegeTetanos) grid[5][0] += 1;
      if (a.accouchementMultiple) grid[6][0] += 1;
    }
    return this.gridToValeurs(grid);
  }

  /** T9 : évacuations des mères et nouveau-nés / complications obstétricales. */
  private calcT9(accouchements: AccouchementAvecPatiente[]): Valeur[] {
    const grid = Array.from({ length: 5 }, () => [0]);
    for (const a of accouchements) {
      if (a.evacueeAvant) grid[0][0] += 1;
      if (a.evacueeApres) grid[1][0] += 1;
      if (a.nouveauNeEvacue) grid[2][0] += 1;
      if (a.complications && a.complications.trim()) {
        grid[3][0] += 1;
        const issue = (a.issueMere ?? '').toUpperCase();
        if (issue.includes('TRANSF') || issue.includes('EVACU') || a.evacueeAvant || a.evacueeApres) {
          grid[4][0] += 1;
        }
      }
    }
    return this.gridToValeurs(grid);
  }

  /** T10b : consultations postnatales par type (colonnes : Nombre). */
  private async calcT10B(cliniqueId: number, debut: Date, fin: Date): Promise<Valeur[]> {
    const cpons = await this.prisma.consultationPostnatale.findMany({
      where: { cliniqueId, date: { gte: debut, lt: fin } },
    });
    const grid = Array.from({ length: 4 }, () => [0]);
    for (const c of cpons) {
      if (c.typeCpon === 'IMMEDIATE_6_72H') grid[0][0] += 1;
      else if (c.typeCpon === '6_10_JOURS') grid[1][0] += 1;
      else if (c.typeCpon === '6_8_SEMAINES') grid[3][0] += 1;
      else grid[2][0] += 1;
    }
    return this.gridToValeurs(grid);
  }

  /** Méthodes PF du registre, normalisées (sans accents, majuscules). */
  private static METHODES_PF = [
    'PILULE (COC)', 'PILULE (COP)', 'INJECTABLE IM 3 MOIS', 'INJECTABLE IM 2 MOIS',
    'INJECTABLE SOUS CUTANE 3 MOIS', 'AUTO-INJECTION 3 MOIS', 'DIU', 'DIU-PP',
    'IMPLANT 5 ANS', 'IMPLANT 3 ANS', 'CONDOM MASCULIN', 'CONDOM FEMININ',
    'SPERMICIDE', 'CONTRACEPTION D URGENCE',
  ];

  private norme(libelle: string | null | undefined): string {
    return (libelle ?? '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /**
   * T30a : contraception moderne.
   * Colonnes : Nouvelles <15 (0), 15-19 (1), 20-24 (2), 25+ (3), Total (4),
   * Anciennes (5), Total utilisatrices (6), Protégées (7), PDV (8),
   * Abandons (9), Arrêts/Retraits (10).
   */
  private async calcT30A(cliniqueId: number, debut: Date, fin: Date): Promise<Valeur[]> {
    const pfs = await this.prisma.consultationPf.findMany({
      where: { cliniqueId, date: { gte: debut, lt: fin } },
      include: { patient: { select: { age: true } } },
    });
    const grid = Array.from({ length: 14 }, () => Array(11).fill(0));
    for (const p of pfs) {
      const row = RapportsService.METHODES_PF.indexOf(this.norme(p.methode));
      if (row < 0) continue;
      const age = parseInt(String(p.patient?.age ?? ''), 10);
      const col = isNaN(age) ? 3 : age < 15 ? 0 : age <= 19 ? 1 : age <= 24 ? 2 : 3;
      if (p.nouvelleUtilisatrice) {
        grid[row][col] += 1;
        grid[row][4] += 1;
      } else {
        grid[row][5] += 1;
      }
      grid[row][6] += 1;
      if (p.protégée) grid[row][7] += 1;
      if (p.perdueDeVue) grid[row][8] += 1;
      if (p.abandon) grid[row][9] += 1;
      if (p.arretRetrait) grid[row][10] += 1;
    }
    return this.gridToValeurs(grid);
  }

  /** T30b : autres indicateurs d'activités en PF (colonnes : Effectif). */
  private async calcT30B(cliniqueId: number, debut: Date, fin: Date): Promise<Valeur[]> {
    const pfs = await this.prisma.consultationPf.findMany({
      where: { cliniqueId, date: { gte: debut, lt: fin } },
    });
    const grid = Array.from({ length: 10 }, () => [0]);
    for (const p of pfs) {
      if (p.conseilPostpartum) grid[0][0] += 1;
      if (p.produitPostpartumImmediat) grid[1][0] += 1;
      if (p.produitPostAbortum) grid[2][0] += 1;
      grid[3][0] += 1; // total consultations PF
      if (p.femmesFormeesAutoInjection) grid[5][0] += 1;
      if (p.istPresente) grid[6][0] += 1;
      if (p.seropositive) grid[7][0] += 1;
      if (p.nourrisson0_6) grid[8][0] += 1;
      if (p.nourrisson6) grid[9][0] += 1;
    }
    return this.gridToValeurs(grid);
  }

  /** T10a : déclaration de naissance en salle d'accouchement (colonnes : M, F, Total). */
  private calcT10A(accouchements: AccouchementAvecPatiente[]): Valeur[] {
    const grid = Array.from({ length: 2 }, () => Array(3).fill(0));
    for (const a of accouchements) {
      if (!(a.issueEnfant ?? '').toUpperCase().includes('VIVANT')) continue;
      const col = (a.sexeEnfant ?? '').toUpperCase() === 'F' ? 1 : 0;
      if (a.declarationNaissanceRenseignee) {
        grid[0][col] += 1;
        grid[0][2] += 1;
      }
      if (a.declarationNaissanceComplete) {
        grid[1][col] += 1;
        grid[1][2] += 1;
      }
    }
    return this.gridToValeurs(grid);
  }

  /**
   * T38 : notification des décès.
   * Colonnes : tranches d'âge M/F (0-13), Total M (14), Total F (15), Total global (16).
   */
  private calcT38(
    consultations: ConsultationAvecPatient[],
    accouchements: AccouchementAvecPatiente[],
  ): Valeur[] {
    const grid = Array.from({ length: 37 }, () => Array(17).fill(0));
    const decesTB = consultations.filter((c) => c.casPresumeTB === 'DECEDE');
    for (const c of decesTB) {
      const b = this.bandeAge(c.patient?.age);
      const sexe = (c.patient?.sexe ?? '').toUpperCase() === 'F' ? 1 : 0;
      const inc = (l: number) => {
        grid[l][16] += 1;
        grid[l][sexe === 0 ? 14 : 15] += 1;
        if (b >= 0) grid[l][b * 2 + sexe] += 1;
      };
      inc(5); // Tuberculose (cas présumé décédé)
      inc(36); // Total général
    }
    for (const a of accouchements) {
      if ((a.issueMere ?? '').toUpperCase().includes('DECED')) {
        const b = this.bandeAge(a.grossesse?.patient?.age);
        const inc = (l: number) => {
          grid[l][16] += 1;
          grid[l][15] += 1;
          if (b >= 0) grid[l][b * 2 + 1] += 1;
        };
        inc(29); // Complications obstétricales
        inc(36);
      }
    }
    return this.gridToValeurs(grid);
  }

  /** T39 : décès maternel et néonatal (colonnes : 08-14, 15-19, 20-24, 25-49, 50+, Total). */
  private calcT39(accouchements: AccouchementAvecPatiente[]): Valeur[] {
    const grid = Array.from({ length: 3 }, () => Array(6).fill(0));
    for (const a of accouchements) {
      if ((a.issueMere ?? '').toUpperCase().includes('DECED')) {
        const b = this.bandeAccouchement(a.grossesse?.patient?.age);
        grid[0][5] += 1;
        if (b >= 0) grid[0][b] += 1;
      }
    }
    return this.gridToValeurs(grid);
  }

  /** T40 : diagnostics biologiques du paludisme (TDR et goutte épaisse). */
  private calcT40(consultations: ConsultationAvecPatient[]): Valeur[] {
    const grid = Array.from({ length: 5 }, () => Array(9).fill(0));
    for (const c of consultations) {
      const b = this.bandeAge(c.patient?.age);
      const fe = c.grossesseEnCours ? 1 : 0;
      const inc = (l: number) => {
        grid[l][7] += 1;
        if (b >= 0) grid[l][b] += 1;
        if (fe) grid[l][8] += 1;
      };
      if (c.tdrPaludisme === 'POSITIF') inc(0);
      if (c.tdrPaludisme === 'NEGATIF') inc(1);
      if (c.goutteEpaisse === 'POSITIVE') inc(3);
      if (c.goutteEpaisse === 'NEGATIVE') inc(4);
    }
    return this.gridToValeurs(grid);
  }

  /**
   * T45 : état des redevances perçues.
   * Colonnes : Non assurés (0), CMU (1), AC (2), CMU+AC (3), Indigents (4),
   * Gratuit 100% (5), Gratuit 30% (6), Payant (7), Part structure (8), Recette (9).
   */
  private async calcT45(cliniqueId: number, debut: Date, fin: Date): Promise<Valeur[]> {
    const lignes = await this.prisma.passagePrestation.findMany({
      where: {
        statut: 'PAYEE',
        passage: { cliniqueId },
        paiement: { statut: 'VALIDE', createdAt: { gte: debut, lt: fin } },
      },
      include: { prestation: true, passage: { include: { patient: true } } },
    });
    const grid = Array.from({ length: 9 }, () => Array(10).fill(0));
    const nature = (l: (typeof lignes)[number]): number => {
      const lib = (l.libelle ?? '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      if (lib.includes('CIRCONCISION') || lib.includes('SUTURE') || lib.includes('ABCES')) return 6;
      switch (l.prestation?.type) {
        case 'CONSULTATION':
          return 0;
        case 'MATERNITE':
          return 1;
        case 'HOSPITALISATION':
          return 3;
        case 'EXAMEN_LABO':
          return 4;
        default:
          return 7;
      }
    };
    for (const l of lignes) {
      const n = nature(l);
      const ps = l.passage?.patient?.protectionSociale;
      const col =
        ps === 'NON_ASSURE'
          ? 0
          : ps === 'CMU' || ps === 'CMU_AP'
            ? 1
            : ps === 'ASSURANCE_PRIVEE'
              ? 2
              : ps === 'INDIGENT'
                ? 4
                : 7;
      const montant = Number(l.montant ?? 0);
      grid[n][col] += 1; // actes par couverture
      grid[n][7] += 1; // payant = total des actes
      grid[n][9] += montant;
      grid[8][col] += 1;
      grid[8][7] += 1;
      grid[8][9] += montant;
    }
    // Part de la structure ≈ total des recettes (corriger à la main si besoin)
    for (let r = 0; r < 9; r++) grid[r][8] = Math.round(grid[r][9]);
    return this.gridToValeurs(grid);
  }

  // ───────────────────────── Helpers types ─────────────────────────
}

type ConsultationAvecPatient = {
  patient: { age: string | null; sexe: string | null } | null;
  consultantType: string | null;
  issueSortie: string | null;
  typeHospitalisation: string | null;
  moDureeHeures: number | null;
  moDureeMinutes: number | null;
  casPresumeTB: string | null;
  tdrPaludisme: string | null;
  goutteEpaisse: string | null;
  grossesseEnCours: boolean | null;
};

type VisiteCpnSIG = {
  numero: number;
  ageGestationnelSA: string | null;
  risqueDepiste: boolean | null;
  malnutrition: boolean | null;
  anemie: boolean | null;
  syphilisPositif: boolean | null;
  agHbsPositif: boolean | null;
  spDose: number | null;
  mildaRemise: boolean | null;
  ferFolate: boolean | null;
  deparasitee: boolean | null;
  counselingPfppi: boolean | null;
};

type AccouchementAvecPatiente = {
  lieu: string | null;
  issueMere: string | null;
  issueEnfant: string | null;
  poidsEnfant: unknown;
  termeSA: string | null;
  sexeEnfant: string | null;
  complications: string | null;
  vatStatut: string | null;
  mortNeType: string | null;
  declarationNaissanceRenseignee: boolean | null;
  declarationNaissanceComplete: boolean | null;
  evacueeAvant: boolean | null;
  evacueeApres: boolean | null;
  nouveauNeEvacue: boolean | null;
  nouveauNeProtegeTetanos: boolean | null;
  accouchementMultiple: boolean | null;
  grossesse: { patient: { age: string | null } | null } | null;
};
