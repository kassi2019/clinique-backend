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
var AccueilService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccueilService = void 0;
const common_1 = require("@nestjs/common");
const impression_service_1 = require("../impression/impression.service");
const prisma_service_1 = require("../prisma/prisma.service");
const includePassage = {
    patient: true,
    service: { select: { id: true, code: true, nom: true } },
    clinique: { select: { id: true, code: true, nom: true, adresse: true } },
};
const JOURS_VALIDITE = 10;
const STATUTS_ACTIFS = ['CREE', 'EN_ATTENTE_PAIEMENT', 'ACTIF'];
let AccueilService = AccueilService_1 = class AccueilService {
    constructor(prisma, impressionService) {
        this.prisma = prisma;
        this.impressionService = impressionService;
        this.logger = new common_1.Logger(AccueilService_1.name);
    }
    async rechercherPatients(search, cliniqueId) {
        if (!search || search.trim().length < 2)
            return [];
        const where = {
            ...(cliniqueId ? { cliniqueId } : {}),
            OR: [
                { nom: { contains: search } },
                { prenom: { contains: search } },
                { numeroDossier: { contains: search } },
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
    async listerPassages(cliniqueId, opts) {
        let debut;
        let fin;
        if (opts.debut || opts.fin) {
            debut = opts.debut
                ? new Date(`${opts.debut}T00:00:00`)
                : new Date(2000, 0, 1);
            fin = opts.fin
                ? new Date(`${opts.fin}T23:59:59.999`)
                : new Date(2999, 11, 31);
        }
        else if (opts.date) {
            debut = new Date(`${opts.date}T00:00:00`);
            fin = new Date(debut.getTime() + 24 * 3600 * 1000);
        }
        else {
            debut = this.debutJour(new Date());
            fin = new Date(debut.getTime() + 24 * 3600 * 1000);
        }
        const conditions = [];
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
        }
        else if (opts.constantes === 'NON') {
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
        const where = {
            cliniqueId,
            createdAt: { gte: debut, lt: fin },
            ...(conditions.length ? { AND: conditions } : {}),
        };
        const page = Math.max(1, opts.page ?? 1);
        const perPage = opts.perPage ?? 20;
        const [passages, total] = await Promise.all([
            this.prisma.passage.findMany({
                where,
                include: includePassage,
                orderBy: { createdAt: 'desc' },
                ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
            }),
            this.prisma.passage.count({ where }),
        ]);
        const data = await Promise.all(passages.map((p) => this.avecStatutVerifie(p)));
        return {
            data,
            total,
            page,
            perPage: perPage > 0 ? perPage : total,
            totalPages: perPage > 0 ? Math.ceil(total / perPage) : 1,
        };
    }
    async passageParReference(reference, cliniqueId) {
        const ref = reference.trim().toUpperCase();
        const refSansTiret = ref.replace(/[\s-]/g, '');
        const parNumeroOrdre = await this.prisma.passage.findFirst({
            where: {
                ...(cliniqueId ? { cliniqueId } : {}),
                numeroOrdre: { contains: ref },
            },
            include: includePassage,
        });
        if (parNumeroOrdre)
            return this.avecStatutVerifie(parNumeroOrdre);
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
            if (passage)
                return this.avecStatutVerifie(passage);
        }
        throw new common_1.NotFoundException('Code patient ou N° d\'ordre introuvable.');
    }
    async findOne(id) {
        const passage = await this.prisma.passage.findUnique({
            where: { id },
            include: includePassage,
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        return this.avecStatutVerifie(passage);
    }
    async creerPassage(dto) {
        let patient;
        if (dto.patientId) {
            const existant = await this.prisma.patient.findUnique({
                where: { id: dto.patientId },
            });
            if (!existant)
                throw new common_1.BadRequestException('Patient introuvable.');
            patient = existant;
        }
        else if (dto.nouveauPatient) {
            const codePatient = await this.genererCodeUnique();
            patient = await this.prisma.patient.create({
                data: {
                    cliniqueId: dto.cliniqueId,
                    numeroDossier: await this.prochainNumeroDossier(dto.cliniqueId),
                    code: codePatient,
                    nom: dto.nouveauPatient.nom,
                    prenom: dto.nouveauPatient.prenom,
                    age: dto.nouveauPatient.age != null
                        ? String(dto.nouveauPatient.age)
                        : undefined,
                    sexe: dto.nouveauPatient.sexe,
                    ville: dto.nouveauPatient.ville,
                    quartier: dto.nouveauPatient.quartier,
                    profession: dto.nouveauPatient.profession,
                    telephone: dto.nouveauPatient.telephone,
                },
            });
        }
        else {
            throw new common_1.BadRequestException('Patient requis : patientId ou nouveauPatient.');
        }
        const numeroOrdre = await this.prochainNumeroOrdre(dto.cliniqueId, dto.serviceId);
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
        const prestationsService = await this.prisma.prestation.findMany({
            where: {
                cliniqueId: dto.cliniqueId,
                serviceId: dto.serviceId,
                actif: true,
            },
        });
        if (prestationsService.length > 0) {
            await this.prisma.passagePrestation.createMany({
                data: prestationsService.map((p) => ({
                    passageId: passage.id,
                    prestationId: p.id,
                    libelle: p.libelle,
                    montant: p.montant,
                    serviceId: p.serviceId,
                    source: 'ACCUEIL',
                    statut: p.type === 'CONSULTATION' ? 'EN_ATTENTE' : 'NON_PRESCRITE',
                })),
            });
        }
        const resultat = await this.avecStatutVerifie(passage);
        let impression = null;
        if (this.impressionService.getConfig().autoPrint) {
            try {
                impression = await this.impressionService.imprimerTicketPassage(passage.id);
                if (!impression.ok) {
                    this.logger.warn(`Impression auto ticket #${passage.id}: ${impression.message}`);
                }
            }
            catch (err) {
                this.logger.error(`Erreur impression auto ticket #${passage.id}: ${err.message}`);
            }
        }
        return { ...resultat, impression };
    }
    async modifierPassage(id, dto) {
        const passage = await this.prisma.passage.findUnique({ where: { id } });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        if (dto.patient) {
            await this.prisma.patient.update({
                where: { id: passage.patientId },
                data: {
                    nom: dto.patient.nom,
                    prenom: dto.patient.prenom,
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
    async prochainNumeroOrdre(cliniqueId, serviceId) {
        const d = new Date();
        const debutMois = new Date(d.getFullYear(), d.getMonth(), 1);
        const nb = await this.prisma.passage.count({
            where: { cliniqueId, serviceId, createdAt: { gte: debutMois } },
        });
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });
        const prefixe = service?.code || 'SRV';
        return `${prefixe}-${String(nb + 1).padStart(3, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
    }
    async prochainNumeroDossier(cliniqueId) {
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
    async genererCodeUnique() {
        const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        for (let essai = 0; essai < 10; essai++) {
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += alphabet[Math.floor(Math.random() * alphabet.length)];
            }
            const existe = await this.prisma.patient.findUnique({ where: { code } });
            if (!existe)
                return code;
        }
        throw new Error('Impossible de générer un code patient unique.');
    }
    debutJour(d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    async avecStatutVerifie(passage) {
        if (STATUTS_ACTIFS.includes(passage.statut) &&
            passage.expireLe.getTime() < Date.now()) {
            const maj = await this.prisma.passage.update({
                where: { id: passage.id },
                data: { statut: 'EXPIRE' },
            });
            return { ...passage, statut: maj.statut };
        }
        return passage;
    }
};
exports.AccueilService = AccueilService;
exports.AccueilService = AccueilService = AccueilService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        impression_service_1.ImpressionService])
], AccueilService);
//# sourceMappingURL=accueil.service.js.map