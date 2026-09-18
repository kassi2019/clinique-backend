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
exports.LaboratoireService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const N = (x) => Number(x);
const includeExamen = {
    lignes: true,
    prelevePar: {
        select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
        },
    },
    validePar: {
        select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
        },
    },
};
let LaboratoireService = class LaboratoireService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async labServiceId(cliniqueId) {
        const lab = await this.prisma.service.findFirst({
            where: { cliniqueId, code: 'LAB' },
        });
        return lab?.id ?? null;
    }
    async rechercher(reference, cliniqueId) {
        const ref = reference.trim().toUpperCase();
        const refSans = ref.replace(/[\s-]/g, '');
        if (!ref)
            return [];
        const labId = await this.labServiceId(cliniqueId);
        if (!labId)
            return [];
        const filtreLabPayees = {
            statut: 'PAYEE',
            OR: [{ serviceId: labId }, { prestation: { serviceId: labId } }],
        };
        const passages = await this.prisma.passage.findMany({
            where: {
                cliniqueId,
                statut: 'ACTIF',
                OR: [
                    { numeroOrdre: { contains: ref } },
                    { patient: { is: { code: refSans } } },
                    { patient: { is: { nom: { contains: ref } } } },
                    { patient: { is: { prenom: { contains: ref } } } },
                ],
                prestations: { some: filtreLabPayees },
            },
            include: {
                patient: true,
                service: { select: { id: true, code: true, nom: true } },
                prestations: {
                    where: filtreLabPayees,
                    include: { service: { select: { nom: true } } },
                },
                examensLabo: { include: { lignes: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        return passages.map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            statut: p.statut,
            createdAt: p.createdAt,
            patient: p.patient,
            service: p.service,
            examensPayes: p.prestations.map((l) => ({ ...l, montant: N(l.montant) })),
            nbExamensLab: p.prestations.length,
            nbExamensTraites: p.examensLabo.length,
        }));
    }
    async detailPassage(passageId) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
            include: {
                patient: true,
                service: { select: { id: true, code: true, nom: true } },
                prestations: {
                    include: {
                        service: { select: { id: true, code: true, nom: true } },
                        prestation: { select: { type: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
                examensLabo: { include: includeExamen, orderBy: { preleveLe: 'asc' } },
            },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const historique = await this.prisma.examenLabo.findMany({
            where: { patientId: passage.patientId },
            include: {
                lignes: true,
                passage: {
                    select: {
                        numeroOrdre: true,
                        createdAt: true,
                        service: { select: { nom: true } },
                    },
                },
            },
            orderBy: { preleveLe: 'desc' },
        });
        return {
            passage: {
                id: passage.id,
                numeroOrdre: passage.numeroOrdre,
                statut: passage.statut,
                typePatient: passage.typePatient,
                referent: passage.referent,
                prestationDemandee: passage.prestationDemandee,
                createdAt: passage.createdAt,
                constantes: {
                    taille: passage.taille,
                    temperature: passage.temperature ? N(passage.temperature) : null,
                    pouls: passage.pouls,
                    tensionGauche: passage.tensionGauche,
                    tensionDroite: passage.tensionDroite,
                    poids: passage.poids ? N(passage.poids) : null,
                },
                patient: passage.patient,
                service: passage.service,
                prestations: passage.prestations.map((l) => ({ ...l, montant: N(l.montant) })),
                examens: passage.examensLabo,
            },
            historique,
        };
    }
    async enregistrerPrelevement(passageId, passagePrestationId, utilisateurId) {
        const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        if (passage.statut !== 'ACTIF') {
            throw new common_1.BadRequestException('Code non activé : paiement requis avant prélèvement.');
        }
        const labId = await this.labServiceId(passage.cliniqueId);
        if (!labId)
            throw new common_1.BadRequestException('Aucun service de laboratoire configuré.');
        const ligne = await this.prisma.passagePrestation.findFirst({
            where: { id: passagePrestationId, passageId, statut: 'PAYEE' },
            include: { prestation: true },
        });
        if (!ligne)
            throw new common_1.BadRequestException('Examen non payé ou inexistant.');
        if (ligne.serviceId !== labId && ligne.prestation?.serviceId !== labId) {
            throw new common_1.BadRequestException('Cette prestation ne relève pas du laboratoire.');
        }
        return this.prisma.examenLabo.upsert({
            where: { passagePrestationId: ligne.id },
            update: { preleveParId: utilisateurId, preleveLe: new Date() },
            create: {
                passageId,
                passagePrestationId: ligne.id,
                cliniqueId: passage.cliniqueId,
                patientId: passage.patientId,
                libelle: ligne.libelle,
                preleveParId: utilisateurId,
                preleveLe: new Date(),
            },
            include: includeExamen,
        });
    }
    async enregistrerResultats(examenId, dto) {
        const examen = await this.prisma.examenLabo.findUnique({ where: { id: examenId } });
        if (!examen)
            throw new common_1.NotFoundException('Examen introuvable.');
        if (examen.statut === 'VALIDE') {
            throw new common_1.BadRequestException('Examen déjà validé : résultats verrouillés.');
        }
        await this.prisma.$transaction([
            this.prisma.resultatLigne.deleteMany({ where: { examenLaboId: examenId } }),
            this.prisma.resultatLigne.createMany({
                data: dto.lignes.map((l) => ({
                    examenLaboId: examenId,
                    parametre: l.parametre,
                    valeur: l.valeur ?? null,
                    unite: l.unite ?? null,
                    normes: l.normes ?? null,
                })),
            }),
            this.prisma.examenLabo.update({
                where: { id: examenId },
                data: { statut: 'RESULTATS', conclusion: dto.conclusion ?? null },
            }),
        ]);
        return this.prisma.examenLabo.findUnique({
            where: { id: examenId },
            include: includeExamen,
        });
    }
    async valider(examenId, utilisateurId) {
        const examen = await this.prisma.examenLabo.findUnique({ where: { id: examenId } });
        if (!examen)
            throw new common_1.NotFoundException('Examen introuvable.');
        if (examen.statut !== 'RESULTATS') {
            throw new common_1.BadRequestException('Saisir les résultats avant validation.');
        }
        return this.prisma.examenLabo.update({
            where: { id: examenId },
            data: { statut: 'VALIDE', valideParId: utilisateurId, valideLe: new Date() },
            include: includeExamen,
        });
    }
    async historique(params) {
        const { jour, recherche, page, perPage, cliniqueId } = params;
        const jourRef = jour && /^\d{4}-\d{2}-\d{2}$/.test(jour) ? jour : new Date().toISOString().slice(0, 10);
        const debut = new Date(`${jourRef}T00:00:00`);
        const fin = new Date(`${jourRef}T23:59:59.999`);
        const where = {
            cliniqueId,
            preleveLe: { gte: debut, lte: fin },
        };
        const ref = recherche?.trim().toUpperCase();
        if (ref) {
            where.OR = [
                { passage: { numeroOrdre: { contains: ref } } },
                { patient: { nom: { contains: ref } } },
                { patient: { prenom: { contains: ref } } },
            ];
        }
        const [data, total] = await this.prisma.$transaction([
            this.prisma.examenLabo.findMany({
                where,
                include: {
                    lignes: true,
                    passage: { select: { numeroOrdre: true, createdAt: true } },
                    patient: { select: { nom: true, prenom: true, code: true, sexe: true, age: true } },
                    prelevePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
                    validePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
                },
                orderBy: { preleveLe: 'desc' },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            this.prisma.examenLabo.count({ where }),
        ]);
        return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
    }
};
exports.LaboratoireService = LaboratoireService;
exports.LaboratoireService = LaboratoireService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LaboratoireService);
//# sourceMappingURL=laboratoire.service.js.map