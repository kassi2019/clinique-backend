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
var FinancesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancesService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const N = (x) => Number(x ?? 0);
const arrondi2 = (x) => Math.round(x * 100) / 100;
const DUREE_MAX_SERVICE_HEURES = 26;
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
};
let FinancesService = FinancesService_1 = class FinancesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(FinancesService_1.name);
    }
    async utilisateur(utilisateurId) {
        const u = await this.prisma.utilisateur.findUnique({
            where: { id: utilisateurId },
            include: { personnel: { select: { id: true, cliniqueId: true, nom: true, prenom: true } } },
        });
        if (!u)
            throw new common_1.NotFoundException('Utilisateur introuvable.');
        return u;
    }
    async monService(utilisateurId) {
        const service = await this.prisma.serviceAgent.findFirst({
            where: { utilisateurId, statut: 'EN_COURS' },
            orderBy: { debut: 'desc' },
        });
        return { service: service ? this.formaterService(service) : null };
    }
    async prendreService(utilisateurId) {
        const u = await this.utilisateur(utilisateurId);
        const ouvert = await this.prisma.serviceAgent.findFirst({
            where: { utilisateurId, statut: 'EN_COURS' },
        });
        if (ouvert)
            throw new common_1.BadRequestException('Vous êtes déjà en service depuis ' + ouvert.debut.toLocaleString('fr-FR') + '.');
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
        return { service: this.formaterService(service) };
    }
    async terminerService(utilisateurId) {
        const ouvert = await this.prisma.serviceAgent.findFirst({
            where: { utilisateurId, statut: 'EN_COURS' },
        });
        if (!ouvert)
            throw new common_1.BadRequestException("Vous n'êtes pas en service.");
        const service = await this.prisma.serviceAgent.update({
            where: { id: ouvert.id },
            data: { fin: new Date(), statut: 'TERMINE' },
        });
        return { service: this.formaterService(service) };
    }
    async presence(utilisateurId) {
        const ouvert = await this.prisma.serviceAgent.findFirst({
            where: { utilisateurId, statut: 'EN_COURS' },
        });
        if (!ouvert)
            return { enService: false };
        const maintenant = new Date();
        const ecartMin = (maintenant.getTime() - (ouvert.derniereActivite ?? ouvert.debut).getTime()) / 60000;
        const ajout = Math.max(0, Math.min(2, Math.round(ecartMin)));
        await this.prisma.serviceAgent.update({
            where: { id: ouvert.id },
            data: { derniereActivite: maintenant, minutesPresence: { increment: ajout } },
        });
        return { enService: true };
    }
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
        }
        if (oublies.length)
            this.logger.warn(`${oublies.length} service(s) oublié(s) fermé(s) automatiquement.`);
        return oublies.length;
    }
    formaterService(s) {
        const fin = s.fin ?? new Date();
        const heures = (fin.getTime() - s.debut.getTime()) / 3600000;
        return {
            ...s,
            heuresRetenues: s.heuresRetenues != null ? N(s.heuresRetenues) : null,
            vacationsRetenues: s.vacationsRetenues != null ? N(s.vacationsRetenues) : null,
            heures: arrondi2(heures),
        };
    }
    async enService(cliniqueId) {
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
    bornesMois(mois) {
        const m = /^(\d{4})-(\d{2})$/.exec(mois ?? '');
        if (!m)
            throw new common_1.BadRequestException('Mois invalide (format AAAA-MM).');
        const debut = new Date(Number(m[1]), Number(m[2]) - 1, 1);
        const fin = new Date(Number(m[1]), Number(m[2]), 1);
        return { debut, fin };
    }
    dureeVacation(remu) {
        return remu?.dureeVacationHeures && remu.dureeVacationHeures > 0 ? remu.dureeVacationHeures : 24;
    }
    calculerService(s, remu) {
        const fin = s.fin ?? new Date();
        const heuresBrutes = arrondi2((fin.getTime() - s.debut.getTime()) / 3600000);
        const heures = s.heuresRetenues != null ? N(s.heuresRetenues) : heuresBrutes;
        const vacations = s.vacationsRetenues != null ? N(s.vacationsRetenues) : arrondi2(heures / this.dureeVacation(remu));
        return { heuresBrutes, heures, vacations };
    }
    async services(cliniqueId, mois, personnelId) {
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
    async modifierService(id, dto, utilisateurId) {
        const s = await this.prisma.serviceAgent.findUnique({ where: { id } });
        if (!s)
            throw new common_1.NotFoundException('Service introuvable.');
        if (s.statut === 'EN_COURS' && dto.statut) {
            throw new common_1.BadRequestException("Ce service est encore en cours : l'agent doit d'abord le terminer.");
        }
        const fiche = await this.prisma.ficheVacation.findFirst({
            where: { personnelId: s.personnelId, mois: this.moisDe(s.debut), statut: { in: ['VALIDEE', 'PAYEE'] } },
        });
        if (fiche)
            throw new common_1.BadRequestException('La fiche de vacation de ce mois est déjà validée : service non modifiable.');
        const data = {};
        const corrige = ['debut', 'fin', 'heuresRetenues', 'vacationsRetenues'].some((k) => dto[k] !== undefined);
        if (corrige && !dto.motif?.trim())
            throw new common_1.BadRequestException('Indiquez le motif de la correction.');
        if (dto.debut)
            data.debut = new Date(dto.debut);
        if (dto.fin)
            data.fin = new Date(dto.fin);
        if ((data.fin ?? s.fin) && (data.debut ?? s.debut) >= (data.fin ?? s.fin)) {
            throw new common_1.BadRequestException('La fin du service doit être après son début.');
        }
        const nombre = (v) => (v === null || v === '' ? null : Number(v));
        if (dto.heuresRetenues !== undefined)
            data.heuresRetenues = nombre(dto.heuresRetenues);
        if (dto.vacationsRetenues !== undefined)
            data.vacationsRetenues = nombre(dto.vacationsRetenues);
        for (const k of ['heuresRetenues', 'vacationsRetenues']) {
            if (data[k] != null && (isNaN(data[k]) || data[k] < 0))
                throw new common_1.BadRequestException('Valeur invalide.');
        }
        if (dto.motif?.trim())
            data.motifCorrection = dto.motif.trim();
        if (dto.statut) {
            if (!['VALIDE', 'REJETE', 'TERMINE'].includes(dto.statut))
                throw new common_1.BadRequestException('Statut invalide.');
            data.statut = dto.statut;
            data.valideParId = dto.statut === 'TERMINE' ? null : utilisateurId;
            data.valideLe = dto.statut === 'TERMINE' ? null : new Date();
        }
        return this.prisma.serviceAgent.update({ where: { id }, data });
    }
    moisDe(d) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    async remunerations(cliniqueId) {
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
    async definirRemuneration(personnelId, dto) {
        const p = await this.prisma.personnel.findUnique({ where: { id: personnelId } });
        if (!p)
            throw new common_1.NotFoundException('Agent introuvable.');
        const mode = dto.mode === 'HEURE' ? 'HEURE' : 'VACATION';
        const tarif = Number(dto.tarif);
        if (isNaN(tarif) || tarif < 0)
            throw new common_1.BadRequestException('Tarif invalide.');
        const duree = Math.round(Number(dto.dureeVacationHeures ?? 24));
        if (!duree || duree < 1 || duree > 48)
            throw new common_1.BadRequestException('Durée de vacation invalide (1 à 48 h).');
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
    async genererFiches(cliniqueId, mois) {
        const { debut, fin } = this.bornesMois(mois);
        await this.fermerServicesOublies();
        const remus = await this.prisma.remunerationAgent.findMany({ where: { cliniqueId, actif: true } });
        let creees = 0, misesAJour = 0, figees = 0;
        for (const remu of remus) {
            const existante = await this.prisma.ficheVacation.findUnique({
                where: { personnelId_mois: { personnelId: remu.personnelId, mois } },
            });
            if (existante && existante.statut !== 'BROUILLON') {
                figees += 1;
                continue;
            }
            const services = await this.prisma.serviceAgent.findMany({
                where: {
                    personnelId: remu.personnelId,
                    debut: { gte: debut, lt: fin },
                    statut: { in: ['TERMINE', 'VALIDE', 'A_VERIFIER'] },
                },
            });
            if (!services.length && !existante)
                continue;
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
            }
            else {
                await this.prisma.ficheVacation.create({ data: { cliniqueId, personnelId: remu.personnelId, mois, ...data } });
                creees += 1;
            }
        }
        return { creees, misesAJour, figees };
    }
    async fiches(cliniqueId, mois) {
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
    async modifierFiche(id, dto) {
        const f = await this.prisma.ficheVacation.findUnique({ where: { id } });
        if (!f)
            throw new common_1.NotFoundException('Fiche introuvable.');
        if (f.statut !== 'BROUILLON')
            throw new common_1.BadRequestException('Fiche déjà validée : modification impossible.');
        const primes = dto.primes !== undefined ? Number(dto.primes) || 0 : N(f.primes);
        const retenues = dto.retenues !== undefined ? Number(dto.retenues) || 0 : N(f.retenues);
        if (primes < 0 || retenues < 0)
            throw new common_1.BadRequestException('Montants invalides.');
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
    async changerStatutFiche(id, statut, utilisateurId) {
        const f = await this.prisma.ficheVacation.findUnique({ where: { id } });
        if (!f)
            throw new common_1.NotFoundException('Fiche introuvable.');
        const transitions = { BROUILLON: ['VALIDEE'], VALIDEE: ['PAYEE', 'BROUILLON'], PAYEE: [] };
        if (!transitions[f.statut]?.includes(statut)) {
            throw new common_1.BadRequestException(`Passage de « ${f.statut} » à « ${statut} » impossible.`);
        }
        const data = { statut };
        if (statut === 'VALIDEE')
            Object.assign(data, { valideParId: utilisateurId, valideLe: new Date() });
        if (statut === 'BROUILLON')
            Object.assign(data, { valideParId: null, valideLe: null });
        if (statut === 'PAYEE')
            data.payeLe = new Date();
        return this.prisma.ficheVacation.update({ where: { id }, data });
    }
    async detailFiche(id) {
        const f = await this.prisma.ficheVacation.findUnique({ where: { id } });
        if (!f)
            throw new common_1.NotFoundException('Fiche introuvable.');
        const services = await this.services(f.cliniqueId, f.mois, f.personnelId);
        return { services: services.filter((s) => s.statut !== 'REJETE' && s.statut !== 'EN_COURS') };
    }
};
exports.FinancesService = FinancesService;
__decorate([
    (0, schedule_1.Interval)(10 * 60 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinancesService.prototype, "fermerServicesOublies", null);
exports.FinancesService = FinancesService = FinancesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinancesService);
//# sourceMappingURL=finances.service.js.map