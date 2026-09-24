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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterniteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const includeVisite = {
    agent: {
        select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
        },
    },
};
let MaterniteService = class MaterniteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async prochainNumero(cliniqueId) {
        const nb = await this.prisma.grossesse.count({ where: { cliniqueId } });
        return `GRO-${String(nb + 1).padStart(4, '0')}`;
    }
    calculerDpa(ddr) {
        const dpa = new Date(ddr.getTime() + 280 * 24 * 3600 * 1000);
        return dpa;
    }
    async creerGrossesse(dto) {
        const patient = await this.prisma.patient.findUnique({ where: { id: dto.patientId } });
        if (!patient)
            throw new common_1.NotFoundException('Patiente introuvable.');
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
            },
            include: { patient: true },
        });
    }
    async modifierGrossesse(id, dto) {
        const g = await this.prisma.grossesse.findUnique({ where: { id } });
        if (!g)
            throw new common_1.NotFoundException('Grossesse introuvable.');
        const data = {
            gravidite: dto.gravidite,
            parite: dto.parite,
            antecedentsObstetricaux: dto.antecedentsObstetricaux,
            facteursRisque: dto.facteursRisque,
            statut: dto.statut,
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
    async grossesses(query) {
        const recherche = query.search?.trim().toUpperCase() ?? '';
        const where = {
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
    async detailGrossesse(id) {
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
        if (!g)
            throw new common_1.NotFoundException('Grossesse introuvable.');
        return g;
    }
    async creerVisite(grossesseId, dto, agentId) {
        const g = await this.prisma.grossesse.findUnique({ where: { id: grossesseId } });
        if (!g)
            throw new common_1.NotFoundException('Grossesse introuvable.');
        const nb = await this.prisma.visiteCpn.count({ where: { grossesseId } });
        return this.prisma.visiteCpn.create({
            data: {
                grossesseId,
                numero: nb + 1,
                date: new Date(dto.date),
                ageGestationnelSA: dto.ageGestationnelSA,
                poids: dto.poids,
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
            },
            include: includeVisite,
        });
    }
    async modifierVisite(id, dto) {
        const v = await this.prisma.visiteCpn.findUnique({ where: { id } });
        if (!v)
            throw new common_1.NotFoundException('Visite introuvable.');
        return this.prisma.visiteCpn.update({
            where: { id },
            data: {
                date: dto.date ? new Date(dto.date) : undefined,
                ageGestationnelSA: dto.ageGestationnelSA,
                poids: dto.poids,
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
            },
            include: includeVisite,
        });
    }
    async creerAccouchement(grossesseId, dto, agentId) {
        const g = await this.prisma.grossesse.findUnique({ where: { id: grossesseId } });
        if (!g)
            throw new common_1.NotFoundException('Grossesse introuvable.');
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
            },
        });
        await this.prisma.grossesse.update({
            where: { id: grossesseId },
            data: { statut: 'ACCOUCHEE' },
        });
        return accouchement;
    }
    async modifierAccouchement(id, dto) {
        const a = await this.prisma.accouchement.findUnique({ where: { id } });
        if (!a)
            throw new common_1.NotFoundException('Accouchement introuvable.');
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
            },
        });
    }
    async accouchements(query) {
        const recherche = query.search?.trim().toUpperCase() ?? '';
        const where = { grossesse: { cliniqueId: query.cliniqueId } };
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
};
exports.MaterniteService = MaterniteService;
exports.MaterniteService = MaterniteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaterniteService);
//# sourceMappingURL=maternite.service.js.map