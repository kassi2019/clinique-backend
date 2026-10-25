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
const recherche_patient_1 = require("../common/recherche-patient");
const consultations_service_1 = require("../consultations/consultations.service");
const includeRealisation = {
    agent: {
        select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
        },
    },
};
const prestationsSoinPayees = {
    statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
    prestation: { type: 'SOIN' },
};
const passageAvecSoins = (cliniqueId) => ({
    cliniqueId,
    OR: [
        { statut: 'ACTIF', prestations: { some: prestationsSoinPayees } },
        { prescriptionsSoins: { some: {} } },
    ],
});
let SoinsService = class SoinsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    lignesSoins(passageId) {
        return this.prisma.passagePrestation.findMany({
            where: { passageId, statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] }, prestation: { type: 'SOIN' } },
            include: { service: { select: { nom: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async fileAttente(cliniqueId) {
        const passages = await this.prisma.passage.findMany({
            where: {
                cliniqueId,
                OR: [
                    { statut: 'ACTIF', prestations: { some: prestationsSoinPayees } },
                    { prescriptionsSoins: { some: { statut: 'EN_COURS' } } },
                ],
            },
            include: {
                patient: true,
                service: { select: { nom: true } },
                prestations: {
                    where: prestationsSoinPayees,
                    include: { soin: { select: { statut: true } } },
                },
                prescriptionsSoins: { where: { statut: 'EN_COURS' }, select: { id: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        return passages
            .map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            patient: p.patient,
            service: p.service,
            createdAt: p.createdAt,
            nbSoins: this.nbSoinsAFaire(p),
        }))
            .filter((p) => p.nbSoins > 0);
    }
    nbSoinsAFaire(p) {
        const prestations = p.statut === 'ACTIF'
            ? p.prestations.filter((l) => !l.soin || l.soin.statut !== 'REALISE').length
            : 0;
        return prestations + p.prescriptionsSoins.length;
    }
    async rechercher(reference, cliniqueId) {
        const ref = reference.trim().toUpperCase();
        if (!ref)
            return [];
        const refSans = ref.replace(/[\s-]/g, '');
        const passages = await this.prisma.passage.findMany({
            where: {
                AND: [
                    passageAvecSoins(cliniqueId),
                    {
                        OR: [
                            { numeroOrdre: { contains: ref } },
                            { patient: { is: { code: refSans } } },
                            { patient: { is: (0, recherche_patient_1.critereNomPrenoms)(ref) } },
                        ],
                    },
                ],
            },
            include: {
                patient: true,
                service: { select: { nom: true } },
                prestations: {
                    where: prestationsSoinPayees,
                    include: { soin: { select: { statut: true } } },
                },
                prescriptionsSoins: { where: { statut: 'EN_COURS' }, select: { id: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return passages.map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            patient: p.patient,
            service: p.service,
            nbSoins: this.nbSoinsAFaire(p),
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
        const prescrits = await this.prisma.prescriptionSoin.findMany({
            where: { passageId },
            ...consultations_service_1.includeSoinsPrescrits,
        });
        return { passage, prestations, soins, prescrits };
    }
    async administrer(prescriptionSoinId, date, observations, agentId) {
        const soin = await this.prisma.prescriptionSoin.findUnique({
            where: { id: prescriptionSoinId },
            include: { _count: { select: { administrations: true } } },
        });
        if (!soin)
            throw new common_1.NotFoundException('Soin introuvable.');
        if (soin.statut !== 'EN_COURS') {
            throw new common_1.BadRequestException(soin.statut === 'ARRETE' ? 'Ce soin a été arrêté par le médecin.' : 'Ce soin est déjà terminé.');
        }
        const faites = soin._count.administrations + 1;
        await this.prisma.$transaction([
            this.prisma.administrationSoin.create({
                data: {
                    prescriptionSoinId,
                    date: new Date(date),
                    observations: observations?.trim() || null,
                    agentId,
                },
            }),
            ...(faites >= soin.nbAdministrations
                ? [this.prisma.prescriptionSoin.update({ where: { id: prescriptionSoinId }, data: { statut: 'TERMINE' } })]
                : []),
        ]);
        return this.prisma.prescriptionSoin.findUnique({
            where: { id: prescriptionSoinId },
            include: consultations_service_1.includeSoinsPrescrits.include,
        });
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
        const whereAdmin = {
            prescriptionSoin: { cliniqueId },
            ...(debut ? { date: { gte: debut, lte: fin } } : {}),
            ...(ref
                ? {
                    OR: [
                        { prescriptionSoin: { typeSoin: { contains: ref } } },
                        { prescriptionSoin: { lignes: { some: { medicamentNom: { contains: ref } } } } },
                        { prescriptionSoin: { passage: { numeroOrdre: { contains: ref } } } },
                        { prescriptionSoin: { patient: { nom: { contains: ref } } } },
                        { prescriptionSoin: { patient: { prenom: { contains: ref } } } },
                        { prescriptionSoin: { patient: { code: { contains: ref.replace(/[\s-]/g, '') } } } },
                    ],
                }
                : {}),
        };
        const agent = { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } };
        const jusqua = page * perPage;
        const [realisations, administrations, totalR, totalA] = await Promise.all([
            this.prisma.realisationSoin.findMany({
                where,
                include: {
                    soin: {
                        include: {
                            patient: { select: { nom: true, prenom: true, code: true } },
                            passage: { select: { numeroOrdre: true } },
                        },
                    },
                    agent,
                },
                orderBy: { date: 'desc' },
                take: jusqua,
            }),
            this.prisma.administrationSoin.findMany({
                where: whereAdmin,
                include: {
                    prescriptionSoin: {
                        include: {
                            patient: { select: { nom: true, prenom: true, code: true } },
                            passage: { select: { numeroOrdre: true } },
                            lignes: { select: { medicamentNom: true, dose: true, unite: true, voie: true } },
                        },
                    },
                    agent,
                },
                orderBy: { date: 'desc' },
                take: jusqua,
            }),
            this.prisma.realisationSoin.count({ where }),
            this.prisma.administrationSoin.count({ where: whereAdmin }),
        ]);
        const lignes = [
            ...realisations,
            ...administrations.map((a) => ({
                id: `A${a.id}`,
                date: a.date,
                observations: a.observations,
                agent: a.agent,
                soin: {
                    libelle: [
                        a.prescriptionSoin.typeSoin,
                        ...a.prescriptionSoin.lignes.map((l) => [l.medicamentNom, l.dose, l.unite, l.voie].filter(Boolean).join(' ')),
                    ].join(' — '),
                    patient: a.prescriptionSoin.patient,
                    passage: a.prescriptionSoin.passage,
                },
            })),
        ].sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime());
        const total = totalR + totalA;
        const data = lignes.slice((page - 1) * perPage, jusqua);
        return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
    }
};
exports.SoinsService = SoinsService;
exports.SoinsService = SoinsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SoinsService);
//# sourceMappingURL=soins.service.js.map