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
var CaisseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaisseService = void 0;
const common_1 = require("@nestjs/common");
const impression_service_1 = require("../impression/impression.service");
const prisma_service_1 = require("../prisma/prisma.service");
const affectation_service_1 = require("../affectation/affectation.service");
const formatMontant = (x) => Number(x);
let CaisseService = CaisseService_1 = class CaisseService {
    constructor(prisma, impressionService, affectationService) {
        this.prisma = prisma;
        this.impressionService = impressionService;
        this.affectationService = affectationService;
        this.logger = new common_1.Logger(CaisseService_1.name);
    }
    async rechercher(search, cliniqueId) {
        if (!search || search.trim().length < 2)
            return [];
        const s = search.trim().toUpperCase();
        const passages = await this.prisma.passage.findMany({
            where: {
                cliniqueId,
                OR: [
                    { numeroOrdre: { contains: s } },
                    { patient: { is: { nom: { contains: s } } } },
                    { patient: { is: { prenom: { contains: s } } } },
                    { patient: { is: { code: { contains: s } } } },
                ],
            },
            include: {
                patient: true,
                service: { select: { id: true, code: true, nom: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return passages.map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            statut: p.statut,
            createdAt: p.createdAt,
            patient: p.patient,
            service: p.service,
        }));
    }
    async detailPassage(passageId) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
            include: {
                patient: true,
                service: { select: { id: true, code: true, nom: true } },
                prestations: {
                    include: { service: { select: { nom: true } } },
                    orderBy: { createdAt: 'asc' },
                },
                paiements: {
                    include: {
                        lignes: true,
                        caissier: {
                            select: {
                                matricule: true,
                                personnel: { select: { nom: true, prenom: true } },
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        return {
            ...passage,
            prestations: passage.prestations.map((l) => ({
                ...l,
                montant: formatMontant(l.montant),
            })),
            paiements: passage.paiements.map((p) => ({
                ...p,
                montantTotal: formatMontant(p.montantTotal),
                lignes: p.lignes.map((l) => ({ ...l, montant: formatMontant(l.montant) })),
            })),
        };
    }
    async ajouterPrestation(passageId, prestationId) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const prestation = await this.prisma.prestation.findUnique({
            where: { id: prestationId },
        });
        if (!prestation || !prestation.actif) {
            throw new common_1.BadRequestException('Prestation introuvable ou inactive.');
        }
        const ligne = await this.prisma.passagePrestation.create({
            data: {
                passageId,
                prestationId: prestation.id,
                libelle: prestation.libelle,
                montant: prestation.montant,
                serviceId: prestation.serviceId,
                source: 'MANUEL',
            },
        });
        return { ...ligne, montant: formatMontant(ligne.montant) };
    }
    async retirerPrestation(ligneId) {
        const ligne = await this.prisma.passagePrestation.findUnique({
            where: { id: ligneId },
        });
        if (!ligne)
            throw new common_1.NotFoundException('Ligne introuvable.');
        if (ligne.statut !== 'EN_ATTENTE') {
            throw new common_1.BadRequestException('Cette prestation est déjà payée.');
        }
        return this.prisma.passagePrestation.delete({ where: { id: ligneId } });
    }
    async encaisser(passageId, dto, utilisateurId) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
            include: {
                patient: true,
                service: { select: { nom: true } },
            },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const lignes = await this.prisma.passagePrestation.findMany({
            where: {
                id: { in: dto.lignesIds },
                passageId,
                statut: 'EN_ATTENTE',
            },
        });
        if (lignes.length !== dto.lignesIds.length) {
            throw new common_1.BadRequestException('Certaines prestations sont déjà payées ou inexistantes.');
        }
        const montantTotal = lignes.reduce((somme, l) => somme + Number(l.montant), 0);
        const annee = new Date().getFullYear();
        const nb = await this.prisma.paiement.count({
            where: {
                cliniqueId: passage.cliniqueId,
                numeroRecu: { contains: `R${annee}-` },
            },
        });
        const numeroRecu = `R${annee}-${String(nb + 1).padStart(5, '0')}`;
        const paiement = await this.prisma.paiement.create({
            data: {
                cliniqueId: passage.cliniqueId,
                passageId: passage.id,
                caissierId: utilisateurId,
                numeroRecu,
                montantTotal,
                modePaiement: dto.modePaiement,
            },
        });
        await this.prisma.passagePrestation.updateMany({
            where: { id: { in: lignes.map((l) => l.id) } },
            data: { statut: 'PAYEE', paiementId: paiement.id },
        });
        await this.prisma.passage.update({
            where: { id: passage.id },
            data: { statut: 'ACTIF' },
        });
        const consultationPayee = await this.prisma.passagePrestation.findFirst({
            where: {
                id: { in: lignes.map((l) => l.id) },
                prestation: { type: 'CONSULTATION' },
            },
        });
        if (consultationPayee) {
            try {
                await this.affectationService.assignerPassage(passage.id);
            }
            catch (err) {
                this.logger.warn(`Affectation auto #${passage.id}: ${err.message}`);
            }
        }
        let impression = null;
        if ((await this.impressionService.getConfigPoste(passage.cliniqueId, 'RECU')).autoPrint) {
            try {
                impression = await this.impressionService.imprimerRecuPaiement(paiement.id);
                if (!impression.ok) {
                    this.logger.warn(`Impression auto reçu #${paiement.id}: ${impression.message}`);
                }
            }
            catch (err) {
                this.logger.error(`Erreur impression auto reçu #${paiement.id}: ${err.message}`);
            }
        }
        return {
            paiement: {
                ...paiement,
                montantTotal: formatMontant(paiement.montantTotal),
            },
            lignes: lignes.map((l) => ({
                id: l.id,
                libelle: l.libelle,
                montant: formatMontant(l.montant),
            })),
            passage: {
                id: passage.id,
                statut: 'ACTIF',
                numeroOrdre: passage.numeroOrdre,
            },
            patient: {
                nom: passage.patient?.nom ?? '',
                prenom: passage.patient?.prenom ?? '',
                code: passage.patient?.code ?? '',
            },
            impression,
        };
    }
    async fileAttente(cliniqueId, page = 1, perPage = 100) {
        const passages = await this.prisma.passage.findMany({
            where: { cliniqueId, prestations: { some: { statut: 'EN_ATTENTE' } } },
            include: {
                patient: { select: { nom: true, prenom: true, code: true } },
                service: { select: { nom: true } },
                prestations: { where: { statut: 'EN_ATTENTE' }, select: { montant: true } },
            },
            orderBy: { createdAt: 'asc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });
        const total = await this.prisma.passage.count({
            where: { cliniqueId, prestations: { some: { statut: 'EN_ATTENTE' } } },
        });
        const data = passages.map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            patient: p.patient,
            service: p.service,
            totalAPayer: p.prestations.reduce((s, l) => s + Number(l.montant), 0),
            nbLignes: p.prestations.length,
        }));
        return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
    }
    async payesDuJour(cliniqueId, page = 1, perPage = 100) {
        const debut = new Date();
        debut.setHours(0, 0, 0, 0);
        const [paiements, total] = await this.prisma.$transaction([
            this.prisma.paiement.findMany({
                where: { cliniqueId, statut: 'VALIDE', createdAt: { gte: debut } },
                include: {
                    passage: {
                        select: {
                            numeroOrdre: true,
                            patient: { select: { nom: true, prenom: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            this.prisma.paiement.count({
                where: { cliniqueId, statut: 'VALIDE', createdAt: { gte: debut } },
            }),
        ]);
        const data = paiements.map((p) => ({
            id: p.id,
            numeroRecu: p.numeroRecu,
            modePaiement: p.modePaiement,
            montant: Number(p.montantTotal),
            createdAt: p.createdAt,
            numeroOrdre: p.passage.numeroOrdre,
            patient: p.passage.patient,
        }));
        return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
    }
    async annulerPaiement(paiementId, motif) {
        const paiement = await this.prisma.paiement.findUnique({
            where: { id: paiementId },
        });
        if (!paiement)
            throw new common_1.NotFoundException('Paiement introuvable.');
        if (paiement.statut === 'ANNULE') {
            throw new common_1.BadRequestException('Ce paiement est déjà annulé.');
        }
        await this.prisma.paiement.update({
            where: { id: paiementId },
            data: {
                statut: 'ANNULE',
                motifAnnulation: motif,
                dateAnnulation: new Date(),
            },
        });
        await this.prisma.passagePrestation.updateMany({
            where: { paiementId },
            data: { statut: 'EN_ATTENTE', paiementId: null },
        });
        const valides = await this.prisma.paiement.count({
            where: { passageId: paiement.passageId, statut: 'VALIDE' },
        });
        if (valides === 0) {
            await this.prisma.passage.update({
                where: { id: paiement.passageId },
                data: { statut: 'EN_ATTENTE_PAIEMENT' },
            });
        }
        const consultation = await this.prisma.consultation.findUnique({
            where: { passageId: paiement.passageId },
        });
        if (!consultation || consultation.statut !== 'VALIDEE') {
            await this.affectationService.annulerAffectation(paiement.passageId);
        }
        return this.prisma.paiement.findUnique({ where: { id: paiementId } });
    }
};
exports.CaisseService = CaisseService;
exports.CaisseService = CaisseService = CaisseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        impression_service_1.ImpressionService,
        affectation_service_1.AffectationService])
], CaisseService);
//# sourceMappingURL=caisse.service.js.map