"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RapportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
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
let RapportsService = RapportsService_1 = class RapportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    portes(portes) {
        try {
            return { ...PORTES_DEFAUT, ...JSON.parse(portes ?? '{}') };
        }
        catch {
            return { ...PORTES_DEFAUT };
        }
    }
    async lister(cliniqueId) {
        return this.prisma.rapportSig.findMany({
            where: { cliniqueId },
            orderBy: [{ annee: 'desc' }, { mois: 'desc' }],
            select: { id: true, mois: true, annee: true, statut: true, updatedAt: true },
        });
    }
    async getRapport(cliniqueId, mois, annee) {
        let rapport = await this.prisma.rapportSig.findUnique({
            where: { cliniqueId_mois_annee: { cliniqueId, mois, annee } },
            include: { valeurs: true },
        });
        const clinique = await this.prisma.clinique.findUnique({
            where: { id: cliniqueId },
            include: { parametre: true },
        });
        if (!clinique)
            throw new common_1.NotFoundException('Clinique introuvable.');
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
    async update(id, body) {
        const data = {};
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
            if (body[f] !== undefined)
                data[f] = body[f] === '' ? null : body[f];
        }
        if (body.populationDesservie !== undefined) {
            data.populationDesservie =
                body.populationDesservie === '' || body.populationDesservie === null
                    ? null
                    : Number(body.populationDesservie);
        }
        if (body.portes !== undefined) {
            const actuel = await this.prisma.rapportSig.findUnique({ where: { id }, select: { portes: true } });
            if (!actuel)
                throw new common_1.NotFoundException('Rapport introuvable.');
            data.portes = JSON.stringify({
                ...this.portes(actuel.portes),
                ...body.portes,
            });
        }
        const rapport = await this.prisma.rapportSig.update({
            where: { id },
            data,
            include: { valeurs: true },
        });
        return { ...rapport, portes: this.portes(rapport.portes) };
    }
    async reimporterEntete(id) {
        const rapport = await this.prisma.rapportSig.findUnique({ where: { id } });
        if (!rapport)
            throw new common_1.NotFoundException('Rapport introuvable.');
        const clinique = await this.prisma.clinique.findUnique({ where: { id: rapport.cliniqueId } });
        if (!clinique)
            throw new common_1.NotFoundException('Clinique introuvable.');
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
    async saveValeurs(id, tableau, valeurs) {
        const rapport = await this.prisma.rapportSig.findUnique({ where: { id } });
        if (!rapport)
            throw new common_1.NotFoundException('Rapport introuvable.');
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
    bandeAge(ageStr) {
        const age = parseInt(String(ageStr ?? '').trim(), 10);
        if (isNaN(age))
            return -1;
        if (age <= 4)
            return 0;
        if (age <= 9)
            return 1;
        if (age <= 14)
            return 2;
        if (age <= 19)
            return 3;
        if (age <= 24)
            return 4;
        if (age <= 49)
            return 5;
        return 6;
    }
    bandeAccouchement(ageStr) {
        const age = parseInt(String(ageStr ?? '').trim(), 10);
        if (isNaN(age))
            return -1;
        if (age <= 14)
            return 0;
        if (age <= 19)
            return 1;
        if (age <= 24)
            return 2;
        if (age <= 49)
            return 3;
        return 4;
    }
    gridToValeurs(grid) {
        const out = [];
        grid.forEach((ligne, l) => ligne.forEach((v, c) => {
            if (v > 0)
                out.push({ ligne: l, colonne: c, valeur: Math.round(v) });
        }));
        return out;
    }
    async preRemplir(id) {
        const rapport = await this.prisma.rapportSig.findUnique({ where: { id } });
        if (!rapport)
            throw new common_1.NotFoundException('Rapport introuvable.');
        const cliniqueId = rapport.cliniqueId;
        const debut = new Date(rapport.annee, rapport.mois - 1, 1);
        const fin = new Date(rapport.annee, rapport.mois, 1);
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
        const calculs = {};
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
    calcT1(consultations) {
        const grid = Array.from({ length: 6 }, () => Array(8).fill(0));
        for (const c of consultations) {
            const b = this.bandeAge(c.patient?.age);
            const duree = (c.moDureeHeures ?? 0) + (c.moDureeMinutes ?? 0) / 60;
            const isMO = c.issueSortie === 'MO' || c.typeHospitalisation === 'MISE_EN_OBSERVATION';
            const inc = (l) => {
                grid[l][7] += 1;
                if (b >= 0)
                    grid[l][b] += 1;
            };
            if (c.consultantType !== 'CONTROLE')
                inc(0);
            inc(1);
            if (isMO) {
                inc(2);
                grid[3][7] += duree;
                if (b >= 0)
                    grid[3][b] += duree;
            }
            if (c.issueSortie === 'REFERE_EXTERNE')
                inc(4);
        }
        return this.gridToValeurs(grid);
    }
    async calcT2(cliniqueId, debut, fin) {
        const realisations = await this.prisma.realisationSoin.findMany({
            where: { soin: { cliniqueId }, date: { gte: debut, lt: fin } },
            include: { soin: { select: { libelle: true } } },
        });
        const grid = Array.from({ length: 8 }, () => [0]);
        for (const r of realisations) {
            const lib = (r.soin?.libelle ?? '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
            let row = 3;
            if (lib.includes('PANSEMENT'))
                row = 0;
            else if (lib.includes('INJECTION') || lib.includes('INJECTABLE'))
                row = 1;
            else if (lib.includes('PERFUSION'))
                row = 2;
            else if (lib.includes('CIRCONCISION'))
                row = 4;
            else if (lib.includes('SUTURE'))
                row = 5;
            else if (lib.includes('ABCES'))
                row = 6;
            grid[row][0] += 1;
        }
        return this.gridToValeurs(grid);
    }
    calcT3(visites) {
        const grid = Array.from({ length: 8 }, () => [0]);
        const sa = (v) => {
            const m = parseInt(String(v.ageGestationnelSA ?? ''), 10);
            return isNaN(m) ? null : m;
        };
        for (const v of visites) {
            const s = sa(v);
            if (v.numero === 1) {
                grid[s !== null && s <= 14 ? 0 : 1][0] += 1;
                grid[2][0] += 1;
            }
            else if (v.numero === 2)
                grid[3][0] += 1;
            else if (v.numero === 3)
                grid[4][0] += 1;
            else if (v.numero === 4)
                grid[s !== null && s >= 36 ? 5 : 6][0] += 1;
            else
                grid[7][0] += 1;
        }
        return this.gridToValeurs(grid);
    }
    calcT4(visites) {
        const grid = Array.from({ length: 5 }, () => [0]);
        for (const v of visites) {
            if (v.numero === 1 && v.risqueDepiste)
                grid[0][0] += 1;
            if (v.malnutrition)
                grid[1][0] += 1;
            if (v.anemie)
                grid[2][0] += 1;
            if (v.syphilisPositif)
                grid[3][0] += 1;
            if (v.agHbsPositif)
                grid[4][0] += 1;
        }
        return this.gridToValeurs(grid);
    }
    calcT5(visites) {
        const grid = Array.from({ length: 9 }, () => [0]);
        for (const v of visites) {
            if (v.spDose !== null && v.spDose !== undefined && v.spDose >= 1 && v.spDose <= 5) {
                grid[v.spDose - 1][0] += 1;
            }
            if (v.mildaRemise)
                grid[5][0] += 1;
            if (v.ferFolate)
                grid[6][0] += 1;
            if (v.deparasitee)
                grid[7][0] += 1;
            if (v.counselingPfppi)
                grid[8][0] += 1;
        }
        return this.gridToValeurs(grid);
    }
    calcT6(accouchements) {
        const grid = Array.from({ length: 4 }, () => Array(6).fill(0));
        for (const a of accouchements) {
            const b = this.bandeAccouchement(a.grossesse?.patient?.age);
            const domicile = (a.lieu ?? '').toUpperCase().includes('DOMICILE');
            const inc = (l) => {
                grid[l][5] += 1;
                if (b >= 0)
                    grid[l][b] += 1;
            };
            inc(domicile ? 1 : 0);
            inc(2);
            if ((a.issueMere ?? '').toUpperCase().includes('TRANSF') || (a.issueMere ?? '').toUpperCase().includes('EVACU')) {
                inc(3);
            }
        }
        return this.gridToValeurs(grid);
    }
    calcT7(accouchements) {
        const grid = Array.from({ length: 4 }, () => [0]);
        for (const a of accouchements) {
            if (a.vatStatut === 'CORRECTEMENT_VACCINEE')
                grid[0][0] += 1;
            else if (a.vatStatut === 'INCOMPLETEMENT_VACCINEE')
                grid[1][0] += 1;
            else if (a.vatStatut === 'NON_VACCINEE')
                grid[2][0] += 1;
            grid[3][0] += 1;
        }
        return this.gridToValeurs(grid);
    }
    calcT8(accouchements) {
        const grid = Array.from({ length: 9 }, () => [0]);
        for (const a of accouchements) {
            const issue = (a.issueEnfant ?? '').toUpperCase();
            if (issue.includes('VIVANT'))
                grid[0][0] += 1;
            if (issue.includes('MORT')) {
                if (a.mortNeType === 'MACERE')
                    grid[2][0] += 1;
                else
                    grid[1][0] += 1;
            }
            const poids = Number(a.poidsEnfant);
            if (!isNaN(poids) && poids < 2.5)
                grid[3][0] += 1;
            const terme = parseInt(String(a.termeSA ?? ''), 10);
            if (!isNaN(terme) && terme < 37)
                grid[4][0] += 1;
            if (a.nouveauNeProtegeTetanos)
                grid[5][0] += 1;
            if (a.accouchementMultiple)
                grid[6][0] += 1;
        }
        return this.gridToValeurs(grid);
    }
    calcT9(accouchements) {
        const grid = Array.from({ length: 5 }, () => [0]);
        for (const a of accouchements) {
            if (a.evacueeAvant)
                grid[0][0] += 1;
            if (a.evacueeApres)
                grid[1][0] += 1;
            if (a.nouveauNeEvacue)
                grid[2][0] += 1;
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
    async calcT10B(cliniqueId, debut, fin) {
        const cpons = await this.prisma.consultationPostnatale.findMany({
            where: { cliniqueId, date: { gte: debut, lt: fin } },
        });
        const grid = Array.from({ length: 4 }, () => [0]);
        for (const c of cpons) {
            if (c.typeCpon === 'IMMEDIATE_6_72H')
                grid[0][0] += 1;
            else if (c.typeCpon === '6_10_JOURS')
                grid[1][0] += 1;
            else if (c.typeCpon === '6_8_SEMAINES')
                grid[3][0] += 1;
            else
                grid[2][0] += 1;
        }
        return this.gridToValeurs(grid);
    }
    norme(libelle) {
        return (libelle ?? '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }
    async calcT30A(cliniqueId, debut, fin) {
        const pfs = await this.prisma.consultationPf.findMany({
            where: { cliniqueId, date: { gte: debut, lt: fin } },
            include: { patient: { select: { age: true } } },
        });
        const grid = Array.from({ length: 14 }, () => Array(11).fill(0));
        for (const p of pfs) {
            const row = RapportsService_1.METHODES_PF.indexOf(this.norme(p.methode));
            if (row < 0)
                continue;
            const age = parseInt(String(p.patient?.age ?? ''), 10);
            const col = isNaN(age) ? 3 : age < 15 ? 0 : age <= 19 ? 1 : age <= 24 ? 2 : 3;
            if (p.nouvelleUtilisatrice) {
                grid[row][col] += 1;
                grid[row][4] += 1;
            }
            else {
                grid[row][5] += 1;
            }
            grid[row][6] += 1;
            if (p.protégée)
                grid[row][7] += 1;
            if (p.perdueDeVue)
                grid[row][8] += 1;
            if (p.abandon)
                grid[row][9] += 1;
            if (p.arretRetrait)
                grid[row][10] += 1;
        }
        return this.gridToValeurs(grid);
    }
    async calcT30B(cliniqueId, debut, fin) {
        const pfs = await this.prisma.consultationPf.findMany({
            where: { cliniqueId, date: { gte: debut, lt: fin } },
        });
        const grid = Array.from({ length: 10 }, () => [0]);
        for (const p of pfs) {
            if (p.conseilPostpartum)
                grid[0][0] += 1;
            if (p.produitPostpartumImmediat)
                grid[1][0] += 1;
            if (p.produitPostAbortum)
                grid[2][0] += 1;
            grid[3][0] += 1;
            if (p.femmesFormeesAutoInjection)
                grid[5][0] += 1;
            if (p.istPresente)
                grid[6][0] += 1;
            if (p.seropositive)
                grid[7][0] += 1;
            if (p.nourrisson0_6)
                grid[8][0] += 1;
            if (p.nourrisson6)
                grid[9][0] += 1;
        }
        return this.gridToValeurs(grid);
    }
    calcT10A(accouchements) {
        const grid = Array.from({ length: 2 }, () => Array(3).fill(0));
        for (const a of accouchements) {
            if (!(a.issueEnfant ?? '').toUpperCase().includes('VIVANT'))
                continue;
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
    calcT38(consultations, accouchements) {
        const grid = Array.from({ length: 37 }, () => Array(17).fill(0));
        const decesTB = consultations.filter((c) => c.casPresumeTB === 'DECEDE');
        for (const c of decesTB) {
            const b = this.bandeAge(c.patient?.age);
            const sexe = (c.patient?.sexe ?? '').toUpperCase() === 'F' ? 1 : 0;
            const inc = (l) => {
                grid[l][16] += 1;
                grid[l][sexe === 0 ? 14 : 15] += 1;
                if (b >= 0)
                    grid[l][b * 2 + sexe] += 1;
            };
            inc(5);
            inc(36);
        }
        for (const a of accouchements) {
            if ((a.issueMere ?? '').toUpperCase().includes('DECED')) {
                const b = this.bandeAge(a.grossesse?.patient?.age);
                const inc = (l) => {
                    grid[l][16] += 1;
                    grid[l][15] += 1;
                    if (b >= 0)
                        grid[l][b * 2 + 1] += 1;
                };
                inc(29);
                inc(36);
            }
        }
        return this.gridToValeurs(grid);
    }
    calcT39(accouchements) {
        const grid = Array.from({ length: 3 }, () => Array(6).fill(0));
        for (const a of accouchements) {
            if ((a.issueMere ?? '').toUpperCase().includes('DECED')) {
                const b = this.bandeAccouchement(a.grossesse?.patient?.age);
                grid[0][5] += 1;
                if (b >= 0)
                    grid[0][b] += 1;
            }
        }
        return this.gridToValeurs(grid);
    }
    calcT40(consultations) {
        const grid = Array.from({ length: 5 }, () => Array(9).fill(0));
        for (const c of consultations) {
            const b = this.bandeAge(c.patient?.age);
            const fe = c.grossesseEnCours ? 1 : 0;
            const inc = (l) => {
                grid[l][7] += 1;
                if (b >= 0)
                    grid[l][b] += 1;
                if (fe)
                    grid[l][8] += 1;
            };
            if (c.tdrPaludisme === 'POSITIF')
                inc(0);
            if (c.tdrPaludisme === 'NEGATIF')
                inc(1);
            if (c.goutteEpaisse === 'POSITIVE')
                inc(3);
            if (c.goutteEpaisse === 'NEGATIVE')
                inc(4);
        }
        return this.gridToValeurs(grid);
    }
    async calcT45(cliniqueId, debut, fin) {
        const lignes = await this.prisma.passagePrestation.findMany({
            where: {
                statut: 'PAYEE',
                passage: { cliniqueId },
                paiement: { statut: 'VALIDE', createdAt: { gte: debut, lt: fin } },
            },
            include: { prestation: true, passage: { include: { patient: true } } },
        });
        const grid = Array.from({ length: 9 }, () => Array(10).fill(0));
        const nature = (l) => {
            const lib = (l.libelle ?? '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
            if (lib.includes('CIRCONCISION') || lib.includes('SUTURE') || lib.includes('ABCES'))
                return 6;
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
            const col = ps === 'NON_ASSURE'
                ? 0
                : ps === 'CMU' || ps === 'CMU_AP'
                    ? 1
                    : ps === 'ASSURANCE_PRIVEE'
                        ? 2
                        : ps === 'INDIGENT'
                            ? 4
                            : 7;
            const montant = Number(l.montant ?? 0);
            grid[n][col] += 1;
            grid[n][7] += 1;
            grid[n][9] += montant;
            grid[8][col] += 1;
            grid[8][7] += 1;
            grid[8][9] += montant;
        }
        for (let r = 0; r < 9; r++)
            grid[r][8] = Math.round(grid[r][9]);
        return this.gridToValeurs(grid);
    }
};
exports.RapportsService = RapportsService;
RapportsService.METHODES_PF = [
    'PILULE (COC)', 'PILULE (COP)', 'INJECTABLE IM 3 MOIS', 'INJECTABLE IM 2 MOIS',
    'INJECTABLE SOUS CUTANE 3 MOIS', 'AUTO-INJECTION 3 MOIS', 'DIU', 'DIU-PP',
    'IMPLANT 5 ANS', 'IMPLANT 3 ANS', 'CONDOM MASCULIN', 'CONDOM FEMININ',
    'SPERMICIDE', 'CONTRACEPTION D URGENCE',
];
exports.RapportsService = RapportsService = RapportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RapportsService);
//# sourceMappingURL=rapports.service.js.map