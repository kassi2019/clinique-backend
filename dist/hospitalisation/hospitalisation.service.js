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
exports.HospitalisationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const N = (x) => Number(x);
const includeSejour = {
    lit: { include: { chambre: { include: { typeChambre: true } } } },
    patient: { select: { id: true, nom: true, prenom: true, code: true, sexe: true, age: true } },
    passage: { select: { numeroOrdre: true, createdAt: true } },
    sortiePar: {
        select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
    },
    ligneCaisse: { select: { id: true, statut: true, montant: true, libelle: true } },
};
let HospitalisationService = class HospitalisationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listerTypes(cliniqueId) {
        return this.prisma.typeChambre.findMany({
            where: { cliniqueId },
            include: { _count: { select: { chambres: true } } },
            orderBy: { libelle: 'asc' },
        });
    }
    async creerType(cliniqueId, dto) {
        try {
            return await this.prisma.typeChambre.create({
                data: { cliniqueId, libelle: dto.libelle.trim() },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException(`Le type « ${dto.libelle} » existe déjà.`);
            }
            throw e;
        }
    }
    async modifierType(id, dto) {
        const type = await this.prisma.typeChambre.findUnique({ where: { id } });
        if (!type)
            throw new common_1.NotFoundException('Type de chambre introuvable.');
        try {
            return await this.prisma.typeChambre.update({
                where: { id },
                data: { libelle: dto.libelle.trim() },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException(`Le type « ${dto.libelle} » existe déjà.`);
            }
            throw e;
        }
    }
    async desactiverType(id) {
        const type = await this.prisma.typeChambre.findUnique({ where: { id } });
        if (!type)
            throw new common_1.NotFoundException('Type de chambre introuvable.');
        return this.prisma.typeChambre.update({
            where: { id },
            data: { actif: !type.actif },
        });
    }
    async listerChambres(cliniqueId) {
        const chambres = await this.prisma.chambre.findMany({
            where: { cliniqueId },
            include: {
                lits: { orderBy: { numero: 'asc' } },
                typeChambre: true,
            },
            orderBy: { numero: 'asc' },
        });
        return chambres;
    }
    async creerChambre(cliniqueId, dto) {
        try {
            return await this.prisma.chambre.create({
                data: {
                    cliniqueId,
                    numero: dto.numero.trim(),
                    typeChambreId: dto.typeChambreId ?? null,
                    tarifJournalier: dto.tarifJournalier ?? null,
                },
                include: { lits: true, typeChambre: true },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException(`Une chambre avec le numéro « ${dto.numero} » existe déjà.`);
            }
            throw e;
        }
    }
    async modifierChambre(id, dto) {
        const chambre = await this.prisma.chambre.findUnique({ where: { id } });
        if (!chambre)
            throw new common_1.NotFoundException('Chambre introuvable.');
        return this.prisma.chambre.update({
            where: { id },
            data: {
                numero: dto.numero?.trim(),
                typeChambreId: dto.typeChambreId ?? null,
                tarifJournalier: dto.tarifJournalier ?? null,
            },
            include: { lits: true, typeChambre: true },
        });
    }
    async desactiverChambre(id) {
        const chambre = await this.prisma.chambre.findUnique({
            where: { id },
            include: { lits: { include: { hospitalisations: { where: { statut: 'EN_COURS' } } } } },
        });
        if (!chambre)
            throw new common_1.NotFoundException('Chambre introuvable.');
        const occupee = chambre.lits.some((l) => l.hospitalisations.length > 0);
        if (occupee) {
            throw new common_1.BadRequestException('Chambre occupée : impossible de la désactiver.');
        }
        return this.prisma.chambre.update({
            where: { id },
            data: { actif: !chambre.actif },
        });
    }
    async creerLit(chambreId, dto) {
        const chambre = await this.prisma.chambre.findUnique({ where: { id: chambreId } });
        if (!chambre)
            throw new common_1.NotFoundException('Chambre introuvable.');
        try {
            return await this.prisma.lit.create({
                data: { chambreId, numero: dto.numero.trim() },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException(`Un lit « ${dto.numero} » existe déjà dans cette chambre.`);
            }
            throw e;
        }
    }
    async desactiverLit(id) {
        const lit = await this.prisma.lit.findUnique({
            where: { id },
            include: { hospitalisations: { where: { statut: 'EN_COURS' } } },
        });
        if (!lit)
            throw new common_1.NotFoundException('Lit introuvable.');
        if (lit.hospitalisations.length > 0) {
            throw new common_1.BadRequestException('Lit occupé : impossible de le désactiver.');
        }
        return this.prisma.lit.update({
            where: { id },
            data: { actif: !lit.actif },
        });
    }
    async listerLits(cliniqueId) {
        const lits = await this.prisma.lit.findMany({
            where: { chambre: { cliniqueId } },
            include: {
                chambre: { include: { typeChambre: true } },
                hospitalisations: {
                    where: { statut: 'EN_COURS' },
                    include: {
                        patient: { select: { nom: true, prenom: true, code: true } },
                    },
                    take: 1,
                },
            },
            orderBy: [{ chambre: { numero: 'asc' } }, { numero: 'asc' }],
        });
        return lits.map((l) => ({
            id: l.id,
            numero: l.numero,
            actif: l.actif,
            chambre: l.chambre,
            label: `${l.chambre.numero}-${l.numero}`,
            occupe: l.hospitalisations.length > 0,
            sejour: l.hospitalisations[0] ?? null,
        }));
    }
    async rechercher(reference, cliniqueId) {
        const ref = reference.trim().toUpperCase();
        const refSans = ref.replace(/[\s-]/g, '');
        if (!ref)
            return [];
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
                consultations: { some: { hospitalisation: true } },
            },
            include: {
                patient: true,
                service: { select: { id: true, code: true, nom: true } },
                consultations: { where: { hospitalisation: true }, take: 1 },
                hospitalisation: true,
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
            consultation: p.consultations[0] ?? null,
            sejour: p.hospitalisation,
        }));
    }
    async detailPassage(passageId) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
            include: {
                patient: true,
                service: { select: { id: true, code: true, nom: true } },
                consultations: {
                    include: {
                        medecin: { select: { personnel: { select: { nom: true, prenom: true } } } },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                hospitalisation: { include: includeSejour },
            },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const historique = await this.prisma.hospitalisation.findMany({
            where: { patientId: passage.patientId },
            include: {
                lit: { include: { chambre: true } },
                passage: { select: { numeroOrdre: true, createdAt: true } },
            },
            orderBy: { dateEntree: 'desc' },
        });
        return {
            passage: {
                id: passage.id,
                numeroOrdre: passage.numeroOrdre,
                statut: passage.statut,
                typePatient: passage.typePatient,
                createdAt: passage.createdAt,
                patient: passage.patient,
                service: passage.service,
                consultation: passage.consultations[0] ?? null,
                sejour: passage.hospitalisation,
            },
            historique,
        };
    }
    async admettre(passageId, dto) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
            include: {
                consultations: { orderBy: { createdAt: 'desc' }, take: 1 },
                hospitalisation: true,
            },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        if (passage.statut !== 'ACTIF') {
            throw new common_1.BadRequestException('Code non activé : paiement requis avant admission.');
        }
        if (passage.hospitalisation) {
            throw new common_1.BadRequestException('Une hospitalisation existe déjà pour ce passage.');
        }
        const consultation = passage.consultations[0];
        if (!consultation || !consultation.hospitalisation) {
            throw new common_1.BadRequestException('Aucune prescription d\'hospitalisation pour ce passage.');
        }
        const litDemande = dto.litId ?? consultation.litId ?? null;
        const lit = litDemande
            ? await this.prisma.lit.findUnique({
                where: { id: litDemande },
                include: {
                    chambre: true,
                    hospitalisations: { where: { statut: 'EN_COURS' } },
                },
            })
            : null;
        if (!lit || !lit.actif)
            throw new common_1.BadRequestException('Lit introuvable ou désactivé.');
        if (lit.hospitalisations.length > 0) {
            throw new common_1.BadRequestException('Ce lit est déjà occupé.');
        }
        let tarif = lit.chambre.tarifJournalier;
        if (!tarif) {
            const prestationHosp = await this.prisma.prestation.findFirst({
                where: {
                    cliniqueId: passage.cliniqueId,
                    type: 'HOSPITALISATION',
                    actif: true,
                    service: { code: 'HOS' },
                },
            });
            tarif = prestationHosp?.montant ?? null;
        }
        return this.prisma.hospitalisation.create({
            data: {
                passageId,
                cliniqueId: passage.cliniqueId,
                patientId: passage.patientId,
                litId: lit.id,
                dateEntree: dto.dateEntree ? new Date(dto.dateEntree) : new Date(),
                dureePrevue: consultation.hospitalisationDuree ?? null,
                motif: dto.motif ?? consultation.motif ?? null,
                statut: 'EN_COURS',
                montantJournalier: tarif,
            },
            include: includeSejour,
        });
    }
    async suivi(sejourId, dto) {
        const sejour = await this.prisma.hospitalisation.findUnique({ where: { id: sejourId } });
        if (!sejour)
            throw new common_1.NotFoundException('Séjour introuvable.');
        return this.prisma.hospitalisation.update({
            where: { id: sejourId },
            data: { observations: dto.observations ?? null },
            include: includeSejour,
        });
    }
    async sortie(sejourId, dto, utilisateurId) {
        const sejour = await this.prisma.hospitalisation.findUnique({
            where: { id: sejourId },
        });
        if (!sejour)
            throw new common_1.NotFoundException('Séjour introuvable.');
        if (sejour.statut !== 'EN_COURS') {
            throw new common_1.BadRequestException('Séjour introuvable ou déjà terminé.');
        }
        const dateSortie = dto.dateSortie ? new Date(dto.dateSortie) : new Date();
        if (dateSortie < sejour.dateEntree) {
            throw new common_1.BadRequestException('La date de sortie est antérieure à l\'entrée.');
        }
        const dureeMs = dateSortie.getTime() - sejour.dateEntree.getTime();
        const nbJours = Math.max(1, Math.ceil(dureeMs / (24 * 3600 * 1000)));
        return this.prisma.hospitalisation.update({
            where: { id: sejourId },
            data: {
                statut: 'SORTI',
                dateSortie,
                sortieMotif: dto.sortieMotif,
                sortieParId: utilisateurId,
                nbJoursFactures: nbJours,
            },
            include: includeSejour,
        });
    }
    async historique(params) {
        const { jour, recherche, statut, page, perPage, cliniqueId } = params;
        const jourRef = jour && /^\d{4}-\d{2}-\d{2}$/.test(jour) ? jour : new Date().toISOString().slice(0, 10);
        const debut = new Date(`${jourRef}T00:00:00`);
        const fin = new Date(`${jourRef}T23:59:59.999`);
        const where = {
            cliniqueId,
            dateEntree: { gte: debut, lte: fin },
        };
        if (statut === 'EN_COURS' || statut === 'SORTI')
            where.statut = statut;
        const ref = recherche?.trim().toUpperCase();
        if (ref) {
            where.OR = [
                { passage: { numeroOrdre: { contains: ref } } },
                { patient: { nom: { contains: ref } } },
                { patient: { prenom: { contains: ref } } },
            ];
        }
        const [data, total] = await this.prisma.$transaction([
            this.prisma.hospitalisation.findMany({
                where,
                include: includeSejour,
                orderBy: { dateEntree: 'desc' },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            this.prisma.hospitalisation.count({ where }),
        ]);
        return {
            data: data.map((s) => ({
                ...s,
                montantJournalier: s.montantJournalier ? N(s.montantJournalier) : null,
            })),
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        };
    }
};
exports.HospitalisationService = HospitalisationService;
exports.HospitalisationService = HospitalisationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HospitalisationService);
//# sourceMappingURL=hospitalisation.service.js.map