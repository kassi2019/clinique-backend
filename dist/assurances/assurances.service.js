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
exports.AssurancesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const N = (x) => Number(x);
let AssurancesService = class AssurancesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listerAssurances(cliniqueId) {
        return this.prisma.assurance.findMany({
            where: { cliniqueId },
            include: {
                formules: {
                    include: {
                        couvertures: {
                            include: { prestation: { select: { id: true, libelle: true, code: true, montant: true } } },
                        },
                    },
                    orderBy: { libelle: 'asc' },
                },
            },
            orderBy: { libelle: 'asc' },
        });
    }
    async creerAssurance(cliniqueId, dto) {
        return this.prisma.assurance.create({
            data: {
                cliniqueId,
                code: dto.code.trim().toUpperCase(),
                libelle: dto.libelle.trim(),
                telephone: dto.telephone ?? null,
                email: dto.email ?? null,
                adresse: dto.adresse ?? null,
                numeroAgrement: dto.numeroAgrement ?? null,
            },
        });
    }
    async importerAssurances(cliniqueId, lignes) {
        let ajoutes = 0;
        for (const l of lignes) {
            const code = String(l.code ?? '').trim().toUpperCase();
            const libelle = String(l.libelle ?? '').trim();
            if (!code || !libelle)
                continue;
            const existe = await this.prisma.assurance.findUnique({
                where: { cliniqueId_code: { cliniqueId, code } },
            });
            if (existe)
                continue;
            await this.prisma.assurance.create({
                data: {
                    cliniqueId,
                    code,
                    libelle,
                    telephone: l.telephone ?? null,
                    email: l.email ?? null,
                    adresse: l.adresse ?? null,
                    numeroAgrement: l.numeroAgrement ?? null,
                },
            });
            ajoutes++;
        }
        return { ajoutes, total: lignes.length };
    }
    async modifierAssurance(id, dto) {
        const a = await this.prisma.assurance.findUnique({ where: { id } });
        if (!a)
            throw new common_1.NotFoundException('Assurance introuvable.');
        return this.prisma.assurance.update({
            where: { id },
            data: {
                code: dto.code?.trim().toUpperCase(),
                libelle: dto.libelle?.trim(),
                telephone: dto.telephone ?? null,
                email: dto.email ?? null,
                adresse: dto.adresse ?? null,
                numeroAgrement: dto.numeroAgrement ?? null,
            },
        });
    }
    async desactiverAssurance(id) {
        const a = await this.prisma.assurance.findUnique({ where: { id } });
        if (!a)
            throw new common_1.NotFoundException('Assurance introuvable.');
        return this.prisma.assurance.update({
            where: { id },
            data: { statut: a.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF' },
        });
    }
    async creerFormule(assuranceId, dto) {
        const a = await this.prisma.assurance.findUnique({ where: { id: assuranceId } });
        if (!a)
            throw new common_1.NotFoundException('Assurance introuvable.');
        return this.prisma.formuleAssurance.create({
            data: {
                assuranceId,
                code: dto.code.trim().toUpperCase(),
                libelle: dto.libelle.trim(),
                description: dto.description ?? null,
                dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
                dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
            },
        });
    }
    async modifierFormule(id, dto) {
        const f = await this.prisma.formuleAssurance.findUnique({ where: { id } });
        if (!f)
            throw new common_1.NotFoundException('Formule introuvable.');
        return this.prisma.formuleAssurance.update({
            where: { id },
            data: {
                code: dto.code?.trim().toUpperCase(),
                libelle: dto.libelle?.trim(),
                description: dto.description ?? null,
                dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
                dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
            },
        });
    }
    async desactiverFormule(id) {
        const f = await this.prisma.formuleAssurance.findUnique({ where: { id } });
        if (!f)
            throw new common_1.NotFoundException('Formule introuvable.');
        return this.prisma.formuleAssurance.update({
            where: { id },
            data: { statut: f.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF' },
        });
    }
    async creerCouverture(formuleId, dto) {
        const f = await this.prisma.formuleAssurance.findUnique({ where: { id: formuleId } });
        if (!f)
            throw new common_1.NotFoundException('Formule introuvable.');
        if (dto.tauxCouverture == null || dto.tauxCouverture < 0 || dto.tauxCouverture > 100) {
            throw new common_1.BadRequestException('Le taux de couverture doit être entre 0 et 100.');
        }
        try {
            return await this.prisma.couverturePrestation.create({
                data: {
                    formuleId,
                    prestationId: dto.prestationId,
                    tauxCouverture: dto.tauxCouverture,
                    plafond: dto.plafond ?? null,
                    dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
                    dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
                },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.BadRequestException('Une couverture existe déjà pour cette prestation et cette formule.');
            }
            throw e;
        }
    }
    async modifierCouverture(id, dto) {
        const c = await this.prisma.couverturePrestation.findUnique({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Couverture introuvable.');
        if (dto.tauxCouverture != null && (dto.tauxCouverture < 0 || dto.tauxCouverture > 100)) {
            throw new common_1.BadRequestException('Le taux de couverture doit être entre 0 et 100.');
        }
        return this.prisma.couverturePrestation.update({
            where: { id },
            data: {
                tauxCouverture: dto.tauxCouverture,
                plafond: dto.plafond ?? null,
                dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
                dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
            },
        });
    }
    async desactiverCouverture(id) {
        const c = await this.prisma.couverturePrestation.findUnique({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Couverture introuvable.');
        return this.prisma.couverturePrestation.update({
            where: { id },
            data: { statut: c.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF' },
        });
    }
    async assurancesDuPatient(patientId) {
        return this.prisma.patientAssurance.findMany({
            where: { patientId },
            include: {
                assurance: { select: { id: true, code: true, libelle: true } },
                formule: { select: { id: true, code: true, libelle: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async couvertureActiveDuPatient(patientId) {
        const aujourdHui = new Date();
        const actifs = await this.prisma.patientAssurance.findMany({
            where: {
                patientId,
                statut: 'ACTIF',
                OR: [
                    { dateDebut: null },
                    { dateDebut: { lte: aujourdHui } },
                ],
            },
            include: {
                assurance: true,
                formule: { include: { couvertures: { include: { prestation: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return (actifs.find((a) => !a.dateFin || new Date(a.dateFin) >= aujourdHui) ?? null);
    }
    async ajouterPatientAssurance(patientId, dto) {
        const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient)
            throw new common_1.NotFoundException('Patient introuvable.');
        return this.prisma.patientAssurance.create({
            data: {
                patientId,
                assuranceId: dto.assuranceId,
                formuleId: dto.formuleId,
                numeroAssure: dto.numeroAssure ?? null,
                numeroCarte: dto.numeroCarte ?? null,
                nomAssurePrincipal: dto.nomAssurePrincipal ?? null,
                typeBeneficiaire: dto.typeBeneficiaire ?? null,
                dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : null,
                dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
            },
        });
    }
    async desactiverPatientAssurance(id) {
        const a = await this.prisma.patientAssurance.findUnique({ where: { id } });
        if (!a)
            throw new common_1.NotFoundException('Rattachement introuvable.');
        return this.prisma.patientAssurance.update({
            where: { id },
            data: { statut: a.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF' },
        });
    }
    async facturation(cliniqueId, opts) {
        const debut = opts.debut
            ? new Date(`${opts.debut}T00:00:00`)
            : new Date(new Date().setHours(0, 0, 0, 0));
        const fin = opts.fin
            ? new Date(`${opts.fin}T23:59:59.999`)
            : new Date(new Date().setHours(23, 59, 59, 999));
        const page = opts.page ?? 1;
        const perPage = opts.perPage ?? 20;
        const where = {
            assuranceId: { not: null },
            createdAt: { gte: debut, lte: fin },
        };
        if (opts.assuranceId)
            where.assuranceId = opts.assuranceId;
        const [lignes, total, toutes] = await this.prisma.$transaction([
            this.prisma.priseEnCharge.findMany({
                where: {
                    ...where,
                    paiement: { cliniqueId, statut: 'VALIDE' },
                },
                include: {
                    paiement: {
                        select: {
                            numeroRecu: true,
                            createdAt: true,
                            passage: {
                                select: {
                                    numeroOrdre: true,
                                    patient: { select: { nom: true, prenom: true, code: true } },
                                },
                            },
                        },
                    },
                    assurance: { select: { id: true, code: true, libelle: true } },
                    formule: { select: { id: true, code: true, libelle: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            this.prisma.priseEnCharge.count({
                where: { ...where, paiement: { cliniqueId, statut: 'VALIDE' } },
            }),
            this.prisma.priseEnCharge.findMany({
                where: { ...where, paiement: { cliniqueId, statut: 'VALIDE' } },
                select: {
                    montantAssurance: true,
                    montantPatient: true,
                    montantTotal: true,
                    assurance: { select: { id: true, libelle: true, code: true } },
                },
            }),
        ]);
        const parAssuranceMap = new Map();
        for (const l of toutes) {
            const key = l.assurance?.id ?? 0;
            const e = parAssuranceMap.get(key) ?? {
                assurance: l.assurance ? `${l.assurance.code} — ${l.assurance.libelle}` : '—',
                totalAssurance: 0,
                totalPatient: 0,
                totalFacture: 0,
                nbLignes: 0,
            };
            e.totalAssurance += N(l.montantAssurance);
            e.totalPatient += N(l.montantPatient);
            e.totalFacture += N(l.montantTotal);
            e.nbLignes += 1;
            parAssuranceMap.set(key, e);
        }
        return {
            periode: {
                debut: debut.toISOString().slice(0, 10),
                fin: fin.toISOString().slice(0, 10),
            },
            lignes: lignes.map((l) => ({
                id: l.id,
                createdAt: l.createdAt,
                numeroRecu: l.paiement.numeroRecu,
                patient: l.paiement.passage.patient,
                numeroOrdre: l.paiement.passage.numeroOrdre,
                assurance: l.assurance,
                formule: l.formule,
                tauxParametre: l.tauxParametre,
                tauxApplique: l.tauxApplique,
                montantTotal: N(l.montantTotal),
                montantAssurance: N(l.montantAssurance),
                montantPatient: N(l.montantPatient),
                motifModification: l.motifModification,
            })),
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
            parAssurance: [...parAssuranceMap.values()],
        };
    }
    async tauxApplicable(patientId, prestationId) {
        const rattachement = await this.couvertureActiveDuPatient(patientId);
        if (!rattachement)
            return null;
        const aujourdHui = new Date();
        const couverture = rattachement.formule.couvertures.find((c) => c.prestationId === prestationId &&
            c.statut === 'ACTIF' &&
            (!c.dateDebut || new Date(c.dateDebut) <= aujourdHui) &&
            (!c.dateFin || new Date(c.dateFin) >= aujourdHui));
        if (!couverture)
            return null;
        return {
            assurance: { id: rattachement.assurance.id, code: rattachement.assurance.code, libelle: rattachement.assurance.libelle },
            formule: { id: rattachement.formule.id, code: rattachement.formule.code, libelle: rattachement.formule.libelle },
            numeroAssure: rattachement.numeroAssure,
            taux: couverture.tauxCouverture,
            plafond: couverture.plafond ? N(couverture.plafond) : null,
        };
    }
};
exports.AssurancesService = AssurancesService;
exports.AssurancesService = AssurancesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssurancesService);
//# sourceMappingURL=assurances.service.js.map