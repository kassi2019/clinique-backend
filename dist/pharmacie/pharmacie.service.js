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
var PharmacieService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacieService = void 0;
const common_1 = require("@nestjs/common");
const impression_service_1 = require("../impression/impression.service");
const prisma_service_1 = require("../prisma/prisma.service");
const N = (x) => Number(x);
let PharmacieService = PharmacieService_1 = class PharmacieService {
    constructor(prisma, impressionService) {
        this.prisma = prisma;
        this.impressionService = impressionService;
        this.logger = new common_1.Logger(PharmacieService_1.name);
    }
    async rechercherOrdonnances(reference, cliniqueId, filtres = {}) {
        const ref = reference.trim().toUpperCase();
        const refSans = ref.replace(/[\s-]/g, '');
        if (!ref) {
            const debut = filtres.debut
                ? new Date(`${filtres.debut}T00:00:00`)
                : new Date(new Date().setHours(0, 0, 0, 0));
            const fin = filtres.fin
                ? new Date(`${filtres.fin}T23:59:59.999`)
                : new Date(new Date().setHours(23, 59, 59, 999));
            const where = {
                passage: { cliniqueId },
                medicaments: { some: {} },
                createdAt: { gte: debut, lte: fin },
            };
            if (filtres.statut === 'EN_ATTENTE' || filtres.statut === 'TRAITEE') {
                where.ordonnanceStatut = filtres.statut;
            }
            else {
                where.ordonnanceStatut = 'EN_ATTENTE';
            }
            if (filtres.medecinId)
                where.medecinId = filtres.medecinId;
            const consultations = await this.prisma.consultation.findMany({
                where,
                include: {
                    medecin: {
                        select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
                    },
                    patient: { select: { nom: true, prenom: true, code: true } },
                    passage: { select: { numeroOrdre: true } },
                    _count: { select: { medicaments: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
            return {
                liste: true,
                ordonnances: consultations.map((c) => ({
                    id: c.id,
                    numeroOrdonnance: c.numeroOrdonnance ?? '—',
                    ordonnanceStatut: c.ordonnanceStatut,
                    createdAt: c.createdAt,
                    patient: c.patient,
                    passage: c.passage,
                    medecin: c.medecin,
                    nbMedicaments: c._count.medicaments,
                })),
            };
        }
        const passages = await this.prisma.passage.findMany({
            where: {
                cliniqueId,
                OR: [
                    { numeroOrdre: { contains: ref } },
                    { patient: { is: { code: refSans } } },
                    { patient: { is: { nom: { contains: ref } } } },
                    { patient: { is: { prenom: { contains: ref } } } },
                ],
            },
            include: {
                patient: true,
                consultations: {
                    include: {
                        medicaments: true,
                        dispensations: {
                            include: { lignes: true, paiement: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        return passages
            .filter((p) => p.consultations.some((c) => c.medicaments.length > 0))
            .map((p) => ({
            liste: false,
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            createdAt: p.createdAt,
            patient: p.patient,
            consultations: p.consultations.map((c) => ({
                id: c.id,
                statut: c.statut,
                valideeLe: c.valideeLe,
                numeroOrdonnance: c.numeroOrdonnance,
                ordonnanceStatut: c.ordonnanceStatut,
                medicaments: c.medicaments,
                dispensations: c.dispensations.map((d) => ({
                    ...d,
                    montantTotal: N(d.montantTotal),
                    lignes: d.lignes.map((l) => ({ ...l, montant: N(l.montant), prixUnitaire: N(l.prixUnitaire) })),
                    paiement: d.paiement ? { ...d.paiement, montantTotal: N(d.paiement.montantTotal) } : null,
                })),
            })),
        }));
    }
    async detailOrdonnance(consultationId) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
            include: {
                patient: true,
                passage: {
                    include: {
                        service: { select: { nom: true } },
                        patient: true,
                    },
                },
                medecin: {
                    select: {
                        matricule: true,
                        personnel: { select: { nom: true, prenom: true } },
                    },
                },
                medicaments: {
                    include: { medicament: { include: { lots: { where: { quantiteRestante: { gt: 0 } }, orderBy: { datePeremption: 'asc' } } } } },
                },
                dispensations: {
                    include: {
                        lignes: true,
                        paiement: true,
                        pharmacien: { select: { personnel: { select: { nom: true, prenom: true } } } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!consultation)
            throw new common_1.NotFoundException('Ordonnance introuvable.');
        if (consultation.medicaments.length === 0) {
            throw new common_1.BadRequestException('Cette consultation ne contient aucune prescription de médicament.');
        }
        return {
            consultation: {
                id: consultation.id,
                statut: consultation.statut,
                valideeLe: consultation.valideeLe,
                patient: consultation.passage.patient,
                service: consultation.passage.service,
                medecin: consultation.medecin,
            },
            prescriptions: consultation.medicaments.map((p) => ({
                id: p.id,
                medicamentNom: p.medicamentNom,
                forme: p.forme,
                posologie: p.posologie,
                quantite: p.quantite,
                duree: p.duree,
                medicament: p.medicament
                    ? {
                        id: p.medicament.id,
                        stock: p.medicament.stock,
                        prixVente: p.medicament.prixVente ? N(p.medicament.prixVente) : null,
                        uniteVente: p.medicament.uniteVente,
                        lots: p.medicament.lots.map((l) => ({
                            id: l.id,
                            numeroLot: l.numeroLot,
                            quantiteRestante: l.quantiteRestante,
                            datePeremption: l.datePeremption,
                        })),
                    }
                    : null,
            })),
            dispensations: consultation.dispensations.map((d) => ({
                ...d,
                montantTotal: N(d.montantTotal),
                lignes: d.lignes.map((l) => ({
                    ...l,
                    prixUnitaire: N(l.prixUnitaire),
                    montant: N(l.montant),
                })),
                paiement: d.paiement ? { ...d.paiement, montantTotal: N(d.paiement.montantTotal) } : null,
            })),
        };
    }
    async dispenser(consultationId, lignes, pharmacienId) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
            include: { passage: true },
        });
        if (!consultation)
            throw new common_1.NotFoundException('Ordonnance introuvable.');
        let dispensation = await this.prisma.dispensation.findFirst({
            where: { consultationId, statut: 'EN_COURS' },
        });
        if (!dispensation) {
            dispensation = await this.prisma.dispensation.create({
                data: { consultationId, pharmacienId },
            });
        }
        let total = 0;
        for (const ligne of lignes) {
            if (!ligne.quantiteDelivree || ligne.quantiteDelivree <= 0)
                continue;
            const prescription = await this.prisma.prescription.findUnique({
                where: { id: ligne.prescriptionId },
                include: { medicament: true },
            });
            if (!prescription || prescription.consultationId !== consultationId) {
                throw new common_1.BadRequestException('Prescription invalide.');
            }
            if (!prescription.medicamentId) {
                throw new common_1.BadRequestException(`« ${prescription.medicamentNom} » n'est pas au catalogue : impossible de le délivrer depuis le stock.`);
            }
            const medicament = prescription.medicament;
            if (medicament.stock < ligne.quantiteDelivree) {
                throw new common_1.BadRequestException(`Stock insuffisant pour « ${medicament.nom} » (disponible : ${medicament.stock}).`);
            }
            let restant = ligne.quantiteDelivree;
            const lots = await this.prisma.lot.findMany({
                where: { medicamentId: medicament.id, quantiteRestante: { gt: 0 } },
                orderBy: { datePeremption: 'asc' },
            });
            for (const lot of lots) {
                if (restant === 0)
                    break;
                const prise = Math.min(lot.quantiteRestante, restant);
                await this.prisma.lot.update({
                    where: { id: lot.id },
                    data: { quantiteRestante: { decrement: prise } },
                });
                await this.prisma.mouvementStock.create({
                    data: {
                        medicamentId: medicament.id,
                        type: 'SORTIE',
                        quantite: -prise,
                        lotId: lot.id,
                        reference: consultation.passage.numeroOrdre,
                        utilisateurId: pharmacienId,
                        commentaire: `Dispensation ${prescription.medicamentNom}`,
                    },
                });
                restant -= prise;
            }
            if (restant > 0) {
                throw new common_1.BadRequestException(`Stock insuffisant pour « ${medicament.nom} » (lots vides après FEFO).`);
            }
            await this.prisma.medicament.update({
                where: { id: medicament.id },
                data: { stock: { decrement: ligne.quantiteDelivree } },
            });
            this.recalculerSeuil(medicament.id).catch(() => undefined);
            const prixUnitaire = medicament.consommable
                ? 0
                : medicament.prixVente
                    ? N(medicament.prixVente)
                    : 0;
            const montant = prixUnitaire * ligne.quantiteDelivree;
            await this.prisma.ligneDispensation.create({
                data: {
                    dispensationId: dispensation.id,
                    prescriptionId: prescription.id,
                    medicamentId: medicament.id,
                    medicamentNom: medicament.nom,
                    quantitePrescrite: prescription.quantite ?? undefined,
                    quantiteDelivree: ligne.quantiteDelivree,
                    uniteVente: medicament.uniteVente,
                    prixUnitaire,
                    montant,
                },
            });
            total += montant;
        }
        await this.prisma.dispensation.update({
            where: { id: dispensation.id },
            data: { montantTotal: { increment: total } },
        });
        return this.prisma.dispensation.findUnique({
            where: { id: dispensation.id },
            include: { lignes: true, paiement: true },
        });
    }
    async cloturer(dispensationId) {
        const dispensation = await this.prisma.dispensation.findUnique({
            where: { id: dispensationId },
        });
        if (!dispensation)
            throw new common_1.NotFoundException('Dispensation introuvable.');
        return this.prisma.dispensation.update({
            where: { id: dispensationId },
            data: { statut: 'CLOTUREE', clotureeLe: new Date() },
        });
    }
    async payer(dispensationId, modePaiement, caissierId) {
        const dispensation = await this.prisma.dispensation.findUnique({
            where: { id: dispensationId },
            include: { paiement: true, consultation: { include: { passage: true } } },
        });
        if (!dispensation)
            throw new common_1.NotFoundException('Dispensation introuvable.');
        if (dispensation.paiement && dispensation.paiement.statut === 'VALIDE') {
            throw new common_1.BadRequestException('Cette dispensation est déjà payée.');
        }
        const annee = new Date().getFullYear();
        const nb = await this.prisma.pharmaciePaiement.count({
            where: { numeroRecu: { contains: `P${annee}-` } },
        });
        const numeroRecu = `P${annee}-${String(nb + 1).padStart(5, '0')}`;
        const paiement = await this.prisma.pharmaciePaiement.create({
            data: {
                dispensationId,
                caissierId,
                numeroRecu,
                montantTotal: dispensation.montantTotal,
                modePaiement,
            },
        });
        await this.prisma.dispensation.update({
            where: { id: dispensationId },
            data: { statut: 'CLOTUREE', clotureeLe: new Date() },
        });
        await this.prisma.consultation.update({
            where: { id: dispensation.consultationId },
            data: { ordonnanceStatut: 'TRAITEE' },
        });
        let impression = null;
        if ((await this.impressionService.getConfigPoste(dispensation.consultation.passage.cliniqueId, 'PHARMACIE')).autoPrint) {
            try {
                impression = await this.impressionService.imprimerRecuPharmacie(paiement.id);
            }
            catch (err) {
                this.logger.error(`Impression reçu pharmacie #${paiement.id}: ${err.message}`);
            }
        }
        const lignes = await this.prisma.ligneDispensation.findMany({
            where: { dispensationId },
            orderBy: { id: 'asc' },
        });
        return {
            paiement: { ...paiement, montantTotal: N(paiement.montantTotal) },
            lignes: lignes.map((l) => ({
                id: l.id,
                medicamentNom: l.medicamentNom,
                quantiteDelivree: l.quantiteDelivree,
                prixUnitaire: N(l.prixUnitaire),
                montant: N(l.montant),
            })),
            impression,
        };
    }
    async annulerPaiement(paiementId, motif) {
        const paiement = await this.prisma.pharmaciePaiement.findUnique({
            where: { id: paiementId },
        });
        if (!paiement)
            throw new common_1.NotFoundException('Paiement introuvable.');
        if (paiement.statut === 'ANNULE') {
            throw new common_1.BadRequestException('Ce paiement est déjà annulé.');
        }
        return this.prisma.pharmaciePaiement.update({
            where: { id: paiementId },
            data: { statut: 'ANNULE', motifAnnulation: motif, dateAnnulation: new Date() },
        });
    }
    async stocks(cliniqueId, search) {
        const where = { cliniqueId };
        if (search) {
            where.OR = [{ nom: { contains: search } }, { dosage: { contains: search } }];
        }
        const medicaments = await this.prisma.medicament.findMany({
            where,
            include: {
                lots: { where: { quantiteRestante: { gt: 0 } }, orderBy: { datePeremption: 'asc' } },
            },
            orderBy: { nom: 'asc' },
        });
        const dans90Jours = new Date(Date.now() + 90 * 24 * 3600 * 1000);
        return medicaments.map((m) => ({
            ...m,
            prixVente: m.prixVente ? N(m.prixVente) : null,
            lots: m.lots.map((l) => ({
                ...l,
                datePeremption: l.datePeremption,
                perime: new Date(l.datePeremption).getTime() < Date.now(),
                peremptionProche: new Date(l.datePeremption).getTime() < dans90Jours.getTime(),
            })),
            alerteStock: m.seuilAlerte > 0 && m.stock <= m.seuilAlerte,
        }));
    }
    async entrerStock(dto, utilisateurId) {
        const medicament = await this.prisma.medicament.findUnique({
            where: { id: dto.medicamentId },
        });
        if (!medicament)
            throw new common_1.NotFoundException('Médicament introuvable.');
        const lot = await this.prisma.lot.create({
            data: {
                medicamentId: dto.medicamentId,
                numeroLot: dto.numeroLot,
                quantiteInitiale: dto.quantite,
                quantiteRestante: dto.quantite,
                datePeremption: new Date(dto.datePeremption),
                prixAchat: dto.prixAchat,
                fournisseur: dto.fournisseur?.trim() || null,
            },
        });
        await this.prisma.mouvementStock.create({
            data: {
                medicamentId: dto.medicamentId,
                type: 'ENTREE',
                quantite: dto.quantite,
                lotId: lot.id,
                reference: dto.numeroLot,
                utilisateurId,
                commentaire: 'Entrée de stock',
            },
        });
        await this.prisma.medicament.update({
            where: { id: dto.medicamentId },
            data: { stock: { increment: dto.quantite } },
        });
        return lot;
    }
    async inventaire(dto, utilisateurId) {
        const medicament = await this.prisma.medicament.findUnique({
            where: { id: dto.medicamentId },
        });
        if (!medicament)
            throw new common_1.NotFoundException('Médicament introuvable.');
        const ecart = dto.quantiteReelle - medicament.stock;
        if (ecart !== 0) {
            await this.prisma.mouvementStock.create({
                data: {
                    medicamentId: dto.medicamentId,
                    type: 'INVENTAIRE',
                    quantite: ecart,
                    reference: 'Inventaire',
                    utilisateurId,
                    commentaire: dto.commentaire,
                },
            });
        }
        return this.prisma.medicament.update({
            where: { id: dto.medicamentId },
            data: { stock: dto.quantiteReelle },
        });
    }
    async recalculerSeuil(medicamentId) {
        const depuis = new Date(Date.now() - 60 * 24 * 3600 * 1000);
        const agg = await this.prisma.mouvementStock.aggregate({
            where: { medicamentId, type: 'SORTIE', createdAt: { gte: depuis } },
            _sum: { quantite: true },
        });
        const consommation = Math.abs(agg._sum.quantite ?? 0);
        const seuil = Math.round(consommation / 120);
        await this.prisma.medicament.update({
            where: { id: medicamentId },
            data: { seuilAlerte: seuil },
        });
        return { consommation60j: consommation, seuil };
    }
    async recalculerTousSeuils(cliniqueId) {
        const medicaments = await this.prisma.medicament.findMany({
            where: { cliniqueId },
            select: { id: true },
        });
        for (const m of medicaments) {
            await this.recalculerSeuil(m.id);
        }
        return { recalcules: medicaments.length };
    }
    async lots(medicamentId) {
        return this.prisma.lot.findMany({
            where: { medicamentId },
            orderBy: [{ datePeremption: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async lotsClinique(cliniqueId) {
        return this.prisma.lot.findMany({
            where: { medicament: { cliniqueId } },
            include: { medicament: { select: { id: true, nom: true, dosage: true } } },
            orderBy: [
                { medicament: { nom: 'asc' } },
                { datePeremption: 'asc' },
                { createdAt: 'asc' },
            ],
        });
    }
    async inventaireLot(lotId, quantiteReelle, commentaire, utilisateurId) {
        const lot = await this.prisma.lot.findUnique({ where: { id: lotId } });
        if (!lot)
            throw new common_1.NotFoundException('Lot introuvable.');
        const ecart = quantiteReelle - lot.quantiteRestante;
        if (ecart !== 0) {
            await this.prisma.mouvementStock.create({
                data: {
                    medicamentId: lot.medicamentId,
                    type: 'INVENTAIRE',
                    quantite: ecart,
                    lotId,
                    reference: `Inventaire lot ${lot.numeroLot}`,
                    utilisateurId,
                    commentaire,
                },
            });
        }
        await this.prisma.lot.update({
            where: { id: lotId },
            data: { quantiteRestante: quantiteReelle },
        });
        const total = await this.prisma.lot.aggregate({
            where: { medicamentId: lot.medicamentId },
            _sum: { quantiteRestante: true },
        });
        return this.prisma.medicament.update({
            where: { id: lot.medicamentId },
            data: { stock: total._sum.quantiteRestante ?? 0 },
        });
    }
    async inventaireMultiple(lignes, utilisateurId) {
        let ajustes = 0;
        const medicaments = new Set();
        for (const l of lignes) {
            const lot = await this.prisma.lot.findUnique({ where: { id: l.lotId } });
            if (!lot)
                continue;
            const quantiteReelle = Number(l.quantiteReelle) || 0;
            const ecart = quantiteReelle - lot.quantiteRestante;
            if (ecart !== 0) {
                await this.prisma.mouvementStock.create({
                    data: {
                        medicamentId: lot.medicamentId,
                        type: 'INVENTAIRE',
                        quantite: ecart,
                        lotId: lot.id,
                        reference: `Inventaire lot ${lot.numeroLot}`,
                        utilisateurId,
                    },
                });
                await this.prisma.lot.update({
                    where: { id: lot.id },
                    data: { quantiteRestante: quantiteReelle },
                });
                medicaments.add(lot.medicamentId);
                ajustes++;
            }
        }
        for (const medicamentId of medicaments) {
            const total = await this.prisma.lot.aggregate({
                where: { medicamentId },
                _sum: { quantiteRestante: true },
            });
            await this.prisma.medicament.update({
                where: { id: medicamentId },
                data: { stock: total._sum.quantiteRestante ?? 0 },
            });
        }
        return { ajustes, total: lignes.length };
    }
    async mouvements(medicamentId) {
        const mouvements = await this.prisma.mouvementStock.findMany({
            where: { medicamentId },
            include: {
                utilisateur: { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } },
                lot: { select: { numeroLot: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        return mouvements.map((m) => ({
            ...m,
            utilisateur: m.utilisateur
                ? {
                    matricule: m.utilisateur.matricule,
                    nom: m.utilisateur.personnel?.nom ?? '',
                    prenom: m.utilisateur.personnel?.prenom ?? '',
                }
                : null,
        }));
    }
    async alertes(cliniqueId) {
        const stocks = await this.stocks(cliniqueId);
        const dans90Jours = Date.now() + 90 * 24 * 3600 * 1000;
        return {
            stockBas: stocks.filter((m) => m.alerteStock),
            peremptions: stocks
                .flatMap((m) => m.lots.map((l) => ({ medicament: m.nom, ...l })))
                .filter((l) => new Date(l.datePeremption).getTime() < dans90Jours),
        };
    }
    async consommables(cliniqueId) {
        const liste = await this.prisma.consommable.findMany({
            where: { cliniqueId },
            orderBy: { nom: 'asc' },
        });
        return liste.map((c) => ({
            ...c,
            alerte: c.seuilAlerte > 0 && c.quantite <= c.seuilAlerte,
        }));
    }
    async creerConsommable(dto) {
        return this.prisma.consommable.create({
            data: {
                cliniqueId: dto.cliniqueId,
                nom: dto.nom,
                unite: dto.unite,
                seuilAlerte: dto.seuilAlerte ? Number(dto.seuilAlerte) : 0,
                quantite: dto.quantite ? Number(dto.quantite) : 0,
            },
        });
    }
    async majConsommable(id, dto) {
        return this.prisma.consommable.update({
            where: { id },
            data: {
                nom: dto.nom,
                unite: dto.unite,
                seuilAlerte: dto.seuilAlerte !== undefined ? Number(dto.seuilAlerte) : undefined,
                actif: dto.actif,
            },
        });
    }
    async mouvementConsommable(id, dto, utilisateurId) {
        const consommable = await this.prisma.consommable.findUnique({
            where: { id },
        });
        if (!consommable)
            throw new common_1.NotFoundException('Consommable introuvable.');
        let nouvelleQuantite = consommable.quantite;
        if (dto.type === 'ENTREE') {
            nouvelleQuantite += dto.quantite;
            await this.prisma.consommable.update({
                where: { id },
                data: { quantite: { increment: dto.quantite } },
            });
        }
        else if (dto.type === 'SORTIE') {
            if (consommable.quantite < dto.quantite) {
                throw new common_1.BadRequestException(`Quantité insuffisante (disponible : ${consommable.quantite}).`);
            }
            nouvelleQuantite -= dto.quantite;
            await this.prisma.consommable.update({
                where: { id },
                data: { quantite: { decrement: dto.quantite } },
            });
        }
        else if (dto.type === 'INVENTAIRE') {
            nouvelleQuantite = dto.quantite;
            await this.prisma.consommable.update({
                where: { id },
                data: { quantite: dto.quantite },
            });
        }
        else {
            throw new common_1.BadRequestException("Type de mouvement invalide (ENTREE/SORTIE/INVENTAIRE).");
        }
        await this.prisma.mouvementConsommable.create({
            data: {
                consommableId: id,
                type: dto.type,
                quantite: dto.type === 'SORTIE'
                    ? -dto.quantite
                    : dto.type === 'ENTREE'
                        ? dto.quantite
                        : nouvelleQuantite - consommable.quantite,
                utilisateurId,
                commentaire: dto.commentaire,
            },
        });
        return this.prisma.consommable.findUnique({ where: { id } });
    }
    async mouvementsConsommable(id) {
        return this.prisma.mouvementConsommable.findMany({
            where: { consommableId: id },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.PharmacieService = PharmacieService;
exports.PharmacieService = PharmacieService = PharmacieService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        impression_service_1.ImpressionService])
], PharmacieService);
//# sourceMappingURL=pharmacie.service.js.map