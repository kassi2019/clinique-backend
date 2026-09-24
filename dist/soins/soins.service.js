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
exports.SoinsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const includeRealisation = {
    agent: {
        select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
        },
    },
};
let SoinsService = class SoinsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    lignesSoins(passageId) {
        return this.prisma.passagePrestation.findMany({
            where: { passageId, statut: 'PAYEE', prestation: { type: 'SOIN' } },
            include: { service: { select: { nom: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async fileAttente(cliniqueId) {
        const passages = await this.prisma.passage.findMany({
            where: {
                cliniqueId,
                statut: 'ACTIF',
                prestations: {
                    some: { statut: 'PAYEE', prestation: { type: 'SOIN' } },
                },
            },
            include: {
                patient: true,
                service: { select: { nom: true } },
                prestations: {
                    where: { statut: 'PAYEE', prestation: { type: 'SOIN' } },
                    include: { soin: { select: { statut: true } } },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return passages
            .filter((p) => p.prestations.some((l) => !l.soin || l.soin.statut !== 'REALISE'))
            .map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            patient: p.patient,
            service: p.service,
            createdAt: p.createdAt,
            nbSoins: p.prestations.filter((l) => !l.soin || l.soin.statut !== 'REALISE').length,
        }));
    }
    async rechercher(reference, cliniqueId) {
        const ref = reference.trim().toUpperCase();
        if (!ref)
            return [];
        const refSans = ref.replace(/[\s-]/g, '');
        const passages = await this.prisma.passage.findMany({
            where: {
                cliniqueId,
                statut: 'ACTIF',
                prestations: { some: { statut: 'PAYEE', prestation: { type: 'SOIN' } } },
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
                    where: { statut: 'PAYEE', prestation: { type: 'SOIN' } },
                    include: { soin: { select: { statut: true } } },
                },
            },
            take: 20,
        });
        return passages.map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            patient: p.patient,
            service: p.service,
            nbSoins: p.prestations.filter((l) => !l.soin || l.soin.statut !== 'REALISE').length,
        }));
    }
    async detailPassage(passageId) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
            include: { patient: true, service: { select: { nom: true } } },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const prestations = await this.lignesSoins(passageId);
        const soins = await this.prisma.soin.findMany({
            where: { passageId },
            include: { realisations: { include: includeRealisation, orderBy: { date: 'desc' } } },
        });
        return { passage, prestations, soins };
    }
    async realiser(passagePrestationId, date, observations, agentId) {
        const ligne = await this.prisma.passagePrestation.findUnique({
            where: { id: passagePrestationId },
            include: {
                passage: { select: { id: true, cliniqueId: true, patientId: true, statut: true } },
                prestation: true,
            },
        });
        if (!ligne)
            throw new common_1.NotFoundException('Prestation introuvable.');
        if (ligne.statut !== 'PAYEE') {
            throw new common_1.BadRequestException('Soin non payé : paiement requis avant réalisation.');
        }
        if (ligne.prestation?.type !== 'SOIN') {
            throw new common_1.BadRequestException('Cette prestation ne relève pas du module Soins.');
        }
        if (ligne.passage.statut !== 'ACTIF') {
            throw new common_1.BadRequestException('Code non activé : paiement requis avant réalisation.');
        }
        const soin = await this.prisma.soin.upsert({
            where: { passagePrestationId },
            update: { statut: 'REALISE' },
            create: {
                passageId: ligne.passageId,
                passagePrestationId,
                cliniqueId: ligne.passage.cliniqueId,
                patientId: ligne.passage.patientId,
                libelle: ligne.libelle,
                statut: 'REALISE',
            },
        });
        await this.prisma.realisationSoin.create({
            data: {
                soinId: soin.id,
                date: new Date(date),
                observations: observations?.trim() || null,
                agentId,
            },
        });
        return this.prisma.soin.findUnique({
            where: { id: soin.id },
            include: { realisations: { include: includeRealisation, orderBy: { date: 'desc' } } },
        });
    }
    async realisations(cliniqueId, page = 1, perPage = 10, jour, recherche) {
        const debut = jour ? new Date(`${jour}T00:00:00`) : undefined;
        const fin = jour ? new Date(`${jour}T23:59:59.999`) : undefined;
        const ref = recherche?.trim().toUpperCase();
        const where = {
            soin: { cliniqueId },
            ...(debut ? { date: { gte: debut, lte: fin } } : {}),
            ...(ref
                ? {
                    OR: [
                        { soin: { libelle: { contains: ref } } },
                        { soin: { passage: { numeroOrdre: { contains: ref } } } },
                        { soin: { patient: { nom: { contains: ref } } } },
                        { soin: { patient: { prenom: { contains: ref } } } },
                        { soin: { patient: { code: { contains: ref.replace(/[\s-]/g, '') } } } },
                    ],
                }
                : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.realisationSoin.findMany({
                where,
                include: {
                    soin: {
                        include: {
                            patient: { select: { nom: true, prenom: true, code: true } },
                            passage: { select: { numeroOrdre: true } },
                        },
                    },
                    agent: { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } },
                },
                orderBy: { date: 'desc' },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            this.prisma.realisationSoin.count({ where }),
        ]);
        return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
    }
};
exports.SoinsService = SoinsService;
exports.SoinsService = SoinsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SoinsService);
//# sourceMappingURL=soins.service.js.map