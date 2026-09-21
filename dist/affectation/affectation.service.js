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
var AffectationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffectationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AffectationService = AffectationService_1 = class AffectationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AffectationService_1.name);
    }
    async medecinsDisponibles(cliniqueId) {
        const limite = new Date(Date.now() - AffectationService_1.SEUIL_ACTIVITE_MS);
        return this.prisma.utilisateur.findMany({
            where: {
                statut: 'ACTIF',
                disponibilite: 'DISPONIBLE',
                derniereActivite: { gte: limite },
                role: { code: 'MEDECIN' },
                personnel: { cliniqueId },
            },
            select: {
                id: true,
                personnel: { select: { nom: true, prenom: true } },
                _count: {
                    select: {
                        affectations: {
                            where: { statut: { in: ['EN_ATTENTE', 'EN_CONSULTATION'] } },
                        },
                    },
                },
                affectations: {
                    where: { statut: { in: ['EN_ATTENTE', 'EN_CONSULTATION'] } },
                    orderBy: { dateAffectation: 'desc' },
                    take: 1,
                    select: { dateAffectation: true },
                },
            },
        });
    }
    async assignerPassage(passageId) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
        });
        if (!passage)
            return null;
        const existante = await this.prisma.affectation.findUnique({
            where: { passageId },
        });
        if (existante)
            return existante;
        const medecins = await this.medecinsDisponibles(passage.cliniqueId);
        let medecinId = null;
        if (medecins.length > 0) {
            const minimum = Math.min(...medecins.map((m) => m._count.affectations));
            const candidats = medecins.filter((m) => m._count.affectations === minimum);
            candidats.sort((a, b) => (a.affectations[0]?.dateAffectation?.getTime() ?? 0) -
                (b.affectations[0]?.dateAffectation?.getTime() ?? 0));
            medecinId = candidats[0].id;
        }
        return this.prisma.affectation.create({
            data: {
                cliniqueId: passage.cliniqueId,
                passageId,
                medecinId,
                statut: 'EN_ATTENTE',
            },
            include: {
                medecin: {
                    select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
                },
                passage: {
                    select: { numeroOrdre: true, patient: { select: { nom: true, prenom: true } } },
                },
            },
        });
    }
    async redistribuerNonAffectees(cliniqueId) {
        const nonAffectees = await this.prisma.affectation.findMany({
            where: { cliniqueId, medecinId: null, statut: 'EN_ATTENTE' },
            orderBy: { dateAffectation: 'asc' },
        });
        let redistribuees = 0;
        for (const a of nonAffectees) {
            const medecins = await this.medecinsDisponibles(cliniqueId);
            if (medecins.length === 0)
                break;
            const minimum = Math.min(...medecins.map((m) => m._count.affectations));
            const candidats = medecins.filter((m) => m._count.affectations === minimum);
            candidats.sort((x, y) => (x.affectations[0]?.dateAffectation?.getTime() ?? 0) -
                (y.affectations[0]?.dateAffectation?.getTime() ?? 0));
            await this.prisma.affectation.update({
                where: { id: a.id },
                data: { medecinId: candidats[0].id, dateAffectation: new Date() },
            });
            redistribuees += 1;
        }
        return redistribuees;
    }
    async annulerAffectation(passageId) {
        const affectation = await this.prisma.affectation.findUnique({
            where: { passageId },
        });
        if (!affectation || affectation.statut === 'TERMINE')
            return null;
        return this.prisma.affectation.update({
            where: { id: affectation.id },
            data: { statut: 'ANNULE' },
        });
    }
};
exports.AffectationService = AffectationService;
AffectationService.SEUIL_ACTIVITE_MS = 2 * 60 * 1000;
exports.AffectationService = AffectationService = AffectationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AffectationService);
//# sourceMappingURL=affectation.service.js.map