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
const recherche_patient_1 = require("../common/recherche-patient");
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
                cliniqueId,
                medicaments: { some: {} },
                createdAt: { gte: debut, lte: fin },
                statut: filtres.statut === 'TRAITEE' ? 'TRAITEE' : 'EN_ATTENTE',
            };
            if (filtres.medecinId)
                where.consultation = { medecinId: filtres.medecinId };
            const ordonnances = await this.prisma.ordonnance.findMany({
                where,
                include: {
                    consultation: {
                        select: {
                            id: true,
                            medecin: {
                                select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
                            },
                            patient: { select: { nom: true, prenom: true, code: true } },
                            passage: { select: { numeroOrdre: true } },
                        },
                    },
                    _count: { select: { medicaments: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
            return {
                liste: true,
                ordonnances: ordonnances.map((o) => ({
                    id: o.id,
                    consultationId: o.consultation.id,
                    numeroOrdonnance: o.numero,
                    ordonnanceStatut: o.statut,
                    createdAt: o.createdAt,
                    patient: o.consultation.patient,
                    passage: o.consultation.passage,
                    medecin: o.consultation.medecin,
                    nbMedicaments: o._count.medicaments,
                })),
            };
        }
        const chiffresOrdo = refSans.match(/^(?:ORD)?(\d+)$/)?.[1];
        const numerosOrdo = [ref, ...(chiffresOrdo ? [`ORD-${chiffresOrdo.padStart(5, '0')}`] : [])];
        const correspondOrdo = (numero) => numerosOrdo.some((n) => numero.toUpperCase().includes(n));
        const passages = await this.prisma.passage.findMany({
            where: {
                cliniqueId,
                OR: [
                    { numeroOrdre: { contains: ref } },
                    { patient: { is: { code: refSans } } },
                    { patient: { is: (0, recherche_patient_1.critereNomPrenoms)(ref) } },
                    {
                        consultations: {
                            some: { ordonnances: { some: { OR: numerosOrdo.map((n) => ({ numero: { contains: n } })) } } },
                        },
                    },
                ],
            },
            include: {
                patient: true,
                consultations: {
                    include: {
                        ordonnances: {
                            include: {
                                medicaments: true,
                                dispensations: { include: { lignes: true, paiement: true } },
                            },
                            orderBy: { id: 'asc' },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        const parNumero = refSans.startsWith('ORD') &&
            passages.some((p) => p.consultations.some((c) => c.ordonnances.some((o) => correspondOrdo(o.numero))));
        return passages
            .map((p) => ({
            liste: false,
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            createdAt: p.createdAt,
            patient: p.patient,
            ordonnances: p.consultations.flatMap((c) => c.ordonnances
                .filter((o) => o.medicaments.length > 0 && (!parNumero || correspondOrdo(o.numero)))
                .map((o) => ({
                id: o.id,
                consultationId: c.id,
                statut: c.statut,
                valideeLe: c.valideeLe,
                createdAt: o.createdAt,
                numeroOrdonnance: o.numero,
                ordonnanceStatut: o.statut,
                medicaments: o.medicaments,
                dispensations: o.dispensations.map((d) => ({
                    ...d,
                    montantTotal: N(d.montantTotal),
                    lignes: d.lignes.map((l) => ({ ...l, montant: N(l.montant), prixUnitaire: N(l.prixUnitaire) })),
                    paiement: d.paiement ? { ...d.paiement, montantTotal: N(d.paiement.montantTotal) } : null,
                })),
            }))),
        }))
            .filter((p) => p.ordonnances.length > 0);
    }
    async ordonnanceDeConsultation(consultationId) {
        const ordonnance = (await this.prisma.ordonnance.findFirst({
            where: { consultationId, statut: 'EN_ATTENTE', medicaments: { some: {} } },
            orderBy: { id: 'asc' },
        })) ??
            (await this.prisma.ordonnance.findFirst({
                where: { consultationId },
                orderBy: { id: 'desc' },
            }));
        if (!ordonnance)
            throw new common_1.NotFoundException('Ordonnance introuvable.');
        return ordonnance.id;
    }
    async detailOrdonnance(ordonnanceId) {
        const ordonnance = await this.prisma.ordonnance.findUnique({
            where: { id: ordonnanceId },
            include: {
                consultation: {
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
        if (!ordonnance)
            throw new common_1.NotFoundException('Ordonnance introuvable.');
        if (ordonnance.medicaments.length === 0) {
            throw new common_1.BadRequestException('Cette ordonnance ne contient aucun médicament.');
        }
        const consultation = {
            ...ordonnance.consultation,
            medicaments: ordonnance.medicaments,
            dispensations: ordonnance.dispensations,
        };
        const couverture = await this.couverturePharmacie(consultation.patientId);
        return {
            ordonnance: {
                id: ordonnance.id,
                numero: ordonnance.numero,
                statut: ordonnance.statut,
                createdAt: ordonnance.createdAt,
            },
            assurance: couverture
                ? {
                    assurance: couverture.assurance.libelle,
                    formule: couverture.formule.libelle,
                    numeroAssure: couverture.numeroAssure,
                    taux: couverture.formule.tauxPharmacie ?? 0,
                }
                : null,
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
    async dispenser(ordonnanceId, lignes, pharmacienId) {
        const ordonnance = await this.prisma.ordonnance.findUnique({
            where: { id: ordonnanceId },
            include: { consultation: { include: { passage: true } } },
        });
        if (!ordonnance)
            throw new common_1.NotFoundException('Ordonnance introuvable.');
        const consultation = ordonnance.consultation;
        const consultationId = consultation.id;
        let dispensation = await this.prisma.dispensation.findFirst({
            where: { ordonnanceId, statut: 'EN_COURS' },
        });
        if (!dispensation) {
            dispensation = await this.prisma.dispensation.create({
                data: { consultationId, ordonnanceId, pharmacienId },
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
            if (!prescription || prescription.ordonnanceId !== ordonnanceId) {
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
    async couverturePharmacie(patientId) {
        const aujourdHui = new Date();
        const actifs = await this.prisma.patientAssurance.findMany({
            where: {
                patientId,
                statut: 'ACTIF',
                assurance: { statut: 'ACTIF' },
                formule: { statut: 'ACTIF' },
                OR: [{ dateDebut: null }, { dateDebut: { lte: aujourdHui } }],
            },
            include: { assurance: true, formule: true },
            orderBy: { createdAt: 'desc' },
        });
        return actifs.find((a) => !a.dateFin || new Date(a.dateFin) >= aujourdHui) ?? null;
    }
    async payer(dispensationId, modePaiement, caissierId, options = {}) {
        const dispensation = await this.prisma.dispensation.findUnique({
            where: { id: dispensationId },
            include: { paiement: true, consultation: { include: { passage: true } } },
        });
        if (!dispensation)
            throw new common_1.NotFoundException('Dispensation introuvable.');
        if (dispensation.paiement && dispensation.paiement.statut === 'VALIDE') {
            throw new common_1.BadRequestException('Cette dispensation est déjà payée.');
        }
        const type = ['CREDIT', 'CAS_SOCIAL'].includes(options.type ?? '') ? options.type : 'COMPTANT';
        if (type !== 'COMPTANT' && !options.motif?.trim()) {
            throw new common_1.BadRequestException('Indiquez le motif du crédit ou du cas social.');
        }
        const total = N(dispensation.montantTotal);
        const couverture = await this.couverturePharmacie(dispensation.consultation.patientId);
        const taux = Math.min(100, Math.max(0, couverture?.formule.tauxPharmacie ?? 0));
        const montantAssurance = Math.round((total * taux) / 100);
        const montantPatient = type === 'CAS_SOCIAL' ? 0 : total - montantAssurance;
        const montantEncaisse = type === 'COMPTANT' ? montantPatient : 0;
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
                modePaiement: type === 'COMPTANT' ? modePaiement : type,
                type,
                montantAssurance,
                montantPatient,
                montantEncaisse,
                assuranceId: taux > 0 ? couverture.assuranceId : null,
                formuleId: taux > 0 ? couverture.formuleId : null,
                tauxAssurance: taux > 0 ? taux : null,
                motif: options.motif?.trim() || null,
                regleLe: type === 'CREDIT' ? null : new Date(),
            },
        });
        await this.prisma.dispensation.update({
            where: { id: dispensationId },
            data: { statut: 'CLOTUREE', clotureeLe: new Date() },
        });
        if (dispensation.ordonnanceId) {
            await this.prisma.ordonnance.update({
                where: { id: dispensation.ordonnanceId },
                data: { statut: 'TRAITEE' },
            });
        }
        const enAttente = await this.prisma.ordonnance.count({
            where: {
                consultationId: dispensation.consultationId,
                statut: 'EN_ATTENTE',
                medicaments: { some: {} },
            },
        });
        await this.prisma.consultation.update({
            where: { id: dispensation.consultationId },
            data: { ordonnanceStatut: enAttente === 0 ? 'TRAITEE' : 'EN_ATTENTE' },
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
            paiement: {
                ...paiement,
                montantTotal: N(paiement.montantTotal),
                montantAssurance: N(paiement.montantAssurance),
                montantPatient: N(paiement.montantPatient ?? paiement.montantTotal),
                montantEncaisse: N(paiement.montantEncaisse ?? paiement.montantTotal),
                assurance: couverture && taux > 0 ? couverture.assurance.libelle : null,
            },
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
    async credits(cliniqueId) {
        const paiements = await this.prisma.pharmaciePaiement.findMany({
            where: {
                statut: 'VALIDE',
                dispensation: { consultation: { passage: { cliniqueId } } },
                OR: [{ type: 'CREDIT', regleLe: null }, { type: 'CAS_SOCIAL' }],
            },
            include: {
                dispensation: {
                    select: {
                        ordonnance: { select: { numero: true } },
                        consultation: {
                            select: {
                                patient: { select: { nom: true, prenom: true, code: true, telephone: true } },
                                passage: { select: { numeroOrdre: true } },
                            },
                        },
                    },
                },
                caissier: { select: { personnel: { select: { nom: true, prenom: true } } } },
                assurance: { select: { libelle: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
        const lignes = paiements.map((p) => ({
            id: p.id,
            type: p.type,
            numeroRecu: p.numeroRecu,
            createdAt: p.createdAt,
            motif: p.motif,
            montantTotal: N(p.montantTotal),
            montantAssurance: N(p.montantAssurance),
            montantPatient: N(p.montantPatient ?? 0),
            assurance: p.assurance?.libelle ?? null,
            numeroOrdonnance: p.dispensation.ordonnance?.numero ?? null,
            numeroOrdre: p.dispensation.consultation.passage.numeroOrdre,
            patient: p.dispensation.consultation.patient,
            par: p.caissier?.personnel ? `${p.caissier.personnel.nom} ${p.caissier.personnel.prenom}` : '—',
        }));
        const credits = lignes.filter((l) => l.type === 'CREDIT');
        return {
            credits,
            casSociaux: lignes.filter((l) => l.type === 'CAS_SOCIAL'),
            totalCredits: credits.reduce((s, l) => s + l.montantPatient, 0),
        };
    }
    async reglerCredit(paiementId, modePaiement) {
        const paiement = await this.prisma.pharmaciePaiement.findUnique({ where: { id: paiementId } });
        if (!paiement)
            throw new common_1.NotFoundException('Paiement introuvable.');
        if (paiement.type !== 'CREDIT' || paiement.statut !== 'VALIDE') {
            throw new common_1.BadRequestException("Ce reçu n'est pas un crédit en cours.");
        }
        if (paiement.regleLe)
            throw new common_1.BadRequestException('Ce crédit est déjà réglé.');
        const maj = await this.prisma.pharmaciePaiement.update({
            where: { id: paiementId },
            data: {
                montantEncaisse: paiement.montantPatient ?? paiement.montantTotal,
                modePaiement: modePaiement || 'ESPECES',
                regleLe: new Date(),
            },
        });
        return { ...maj, montantTotal: N(maj.montantTotal), montantEncaisse: N(maj.montantEncaisse) };
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
        return medicaments.map((m) => {
            const statut = this.statutStock(m.stock, m.seuilAlerte);
            return {
                ...m,
                prixVente: m.prixVente ? N(m.prixVente) : null,
                lots: m.lots.map((l) => ({
                    ...l,
                    datePeremption: l.datePeremption,
                    perime: new Date(l.datePeremption).getTime() < Date.now(),
                    peremptionProche: new Date(l.datePeremption).getTime() < dans90Jours.getTime(),
                })),
                alerteStock: statut.code === 'SOUS_STOCK' || statut.code === 'RUPTURE',
                statutStock: statut,
            };
        });
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
        await this.prisma.mouvementStock.create({
            data: {
                medicamentId: dto.medicamentId,
                type: 'INVENTAIRE',
                quantite: ecart,
                stockAvant: medicament.stock,
                stockApres: dto.quantiteReelle,
                reference: 'Inventaire',
                utilisateurId,
                commentaire: dto.commentaire,
            },
        });
        return this.prisma.medicament.update({
            where: { id: dto.medicamentId },
            data: { stock: dto.quantiteReelle },
        });
    }
    async recalculerSeuil(medicamentId) {
        const depuis = new Date(Date.now() - 30 * 24 * 3600 * 1000);
        const agg = await this.prisma.mouvementStock.aggregate({
            where: { medicamentId, type: 'SORTIE', createdAt: { gte: depuis } },
            _sum: { quantite: true },
        });
        const consommation = Math.abs(agg._sum.quantite ?? 0);
        const qs = Math.round(consommation / 30);
        await this.prisma.medicament.update({
            where: { id: medicamentId },
            data: { seuilAlerte: qs },
        });
        return { consommation30j: consommation, qs };
    }
    statutStock(stockDisponible, qs) {
        if (stockDisponible <= 0)
            return { code: 'RUPTURE', libelle: 'Rupture', couleur: '#dc2626' };
        if (qs === 0)
            return { code: 'SANS_CONSOMMATION', libelle: 'Sans consommation', couleur: '#111827' };
        const ratio = stockDisponible / qs;
        if (ratio > 20)
            return { code: 'SURSTOCK', libelle: 'Surstock', couleur: '#2563eb' };
        if (ratio > 5)
            return { code: 'BIEN_STOCKE', libelle: 'Bien stocké', couleur: '#16a34a' };
        return { code: 'SOUS_STOCK', libelle: 'Sous stock', couleur: '#eab308' };
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
        await this.prisma.mouvementStock.create({
            data: {
                medicamentId: lot.medicamentId,
                type: 'INVENTAIRE',
                quantite: ecart,
                stockAvant: lot.quantiteRestante,
                stockApres: quantiteReelle,
                lotId,
                reference: `Inventaire lot ${lot.numeroLot}`,
                utilisateurId,
                commentaire,
            },
        });
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
            await this.prisma.mouvementStock.create({
                data: {
                    medicamentId: lot.medicamentId,
                    type: 'INVENTAIRE',
                    quantite: ecart,
                    stockAvant: lot.quantiteRestante,
                    stockApres: quantiteReelle,
                    lotId: lot.id,
                    reference: `Inventaire lot ${lot.numeroLot}`,
                    utilisateurId,
                },
            });
            if (ecart !== 0) {
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
    async ficheInventaire(cliniqueId, debut, fin) {
        const jourDebut = debut
            ? new Date(`${debut}T00:00:00`)
            : new Date(new Date().setHours(0, 0, 0, 0));
        const dernierJour = fin ?? debut;
        const jourFin = dernierJour
            ? new Date(`${dernierJour}T23:59:59.999`)
            : new Date(new Date().setHours(23, 59, 59, 999));
        const mouvements = await this.prisma.mouvementStock.findMany({
            where: {
                type: 'INVENTAIRE',
                medicament: { cliniqueId },
                createdAt: { gte: jourDebut, lte: jourFin },
            },
            include: {
                medicament: { select: { nom: true, dosage: true, forme: true, prixVente: true } },
                lot: { select: { numeroLot: true, datePeremption: true, prixAchat: true } },
                utilisateur: {
                    select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
                },
            },
            orderBy: [{ medicament: { nom: 'asc' } }, { createdAt: 'asc' }],
        });
        const lignes = mouvements.map((m) => {
            const prix = Number(m.lot?.prixAchat ?? m.medicament.prixVente ?? 0);
            return {
                id: m.id,
                date: m.createdAt,
                medicament: `${m.medicament.nom} ${m.medicament.dosage ?? ''}`.trim(),
                forme: m.medicament.forme,
                lot: m.lot?.numeroLot ?? '—',
                peremption: m.lot?.datePeremption ?? null,
                stockAvant: m.stockAvant,
                stockApres: m.stockApres,
                ecart: m.quantite,
                prixUnitaire: prix,
                valeurEcart: m.quantite * prix,
                par: m.utilisateur?.personnel
                    ? `${m.utilisateur.personnel.nom} ${m.utilisateur.personnel.prenom}`
                    : 'Système',
                commentaire: m.commentaire ?? '',
            };
        });
        const avecEcart = lignes.filter((l) => l.ecart !== 0);
        return {
            lignes,
            resume: {
                lotsComptes: lignes.length,
                lotsAvecEcart: avecEcart.length,
                lotsConformes: lignes.length - avecEcart.length,
                manquants: avecEcart.filter((l) => l.ecart < 0).reduce((s, l) => s + l.ecart, 0),
                excedents: avecEcart.filter((l) => l.ecart > 0).reduce((s, l) => s + l.ecart, 0),
                valeurEcarts: lignes.reduce((s, l) => s + l.valeurEcart, 0),
                agents: [...new Set(lignes.map((l) => l.par))],
            },
        };
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
    async retirerLot(lotId, dto, utilisateurId) {
        const lot = await this.prisma.lot.findUnique({
            where: { id: lotId },
            include: { medicament: true },
        });
        if (!lot)
            throw new common_1.NotFoundException('Lot introuvable.');
        if (!dto.quantite || dto.quantite <= 0 || dto.quantite > lot.quantiteRestante) {
            throw new common_1.BadRequestException(`Quantité invalide : le lot contient ${lot.quantiteRestante} unité(s) restante(s).`);
        }
        const libelleMotif = PharmacieService_1.MOTIFS_RETRAIT[dto.motif] ?? dto.motif ?? 'Retrait';
        const [majLot] = await this.prisma.$transaction([
            this.prisma.lot.update({
                where: { id: lotId },
                data: { quantiteRestante: lot.quantiteRestante - dto.quantite },
            }),
            this.prisma.medicament.update({
                where: { id: lot.medicamentId },
                data: { stock: Math.max(0, lot.medicament.stock - dto.quantite) },
            }),
            this.prisma.mouvementStock.create({
                data: {
                    medicamentId: lot.medicamentId,
                    type: 'RETRAIT',
                    quantite: -dto.quantite,
                    lotId,
                    reference: libelleMotif,
                    commentaire: dto.commentaire ?? null,
                    utilisateurId,
                },
            }),
        ]);
        return majLot;
    }
    async retirerPerimesAuto(cliniqueId) {
        const lots = await this.prisma.lot.findMany({
            where: {
                medicament: { cliniqueId },
                quantiteRestante: { gt: 0 },
                datePeremption: { lt: new Date() },
            },
            include: { medicament: true },
        });
        for (const lot of lots) {
            await this.prisma.$transaction([
                this.prisma.lot.update({
                    where: { id: lot.id },
                    data: { quantiteRestante: 0 },
                }),
                this.prisma.medicament.update({
                    where: { id: lot.medicamentId },
                    data: { stock: Math.max(0, lot.medicament.stock - lot.quantiteRestante) },
                }),
                this.prisma.mouvementStock.create({
                    data: {
                        medicamentId: lot.medicamentId,
                        type: 'RETRAIT',
                        quantite: -lot.quantiteRestante,
                        lotId: lot.id,
                        reference: 'Périmé (auto)',
                        commentaire: `Retrait automatique — péremption ${lot.datePeremption.toISOString().slice(0, 10)}`,
                    },
                }),
            ]);
        }
        const quantiteRetiree = lots.reduce((s, l) => s + l.quantiteRestante, 0);
        return { lotsRetires: lots.length, quantiteRetiree };
    }
    async peremptionsProches(cliniqueId, jours = 30) {
        const limite = new Date(Date.now() + jours * 24 * 3600 * 1000);
        return this.prisma.lot.findMany({
            where: {
                medicament: { cliniqueId },
                quantiteRestante: { gt: 0 },
                datePeremption: { lte: limite },
            },
            include: { medicament: { select: { id: true, nom: true, dosage: true } } },
            orderBy: [{ datePeremption: 'asc' }, { medicament: { nom: 'asc' } }],
        });
    }
    async retraits(cliniqueId, debut, fin) {
        const where = {
            type: 'RETRAIT',
            medicament: { cliniqueId },
        };
        if (debut && /^\d{4}-\d{2}-\d{2}$/.test(debut)) {
            where.createdAt = { gte: new Date(`${debut}T00:00:00`) };
        }
        if (fin && /^\d{4}-\d{2}-\d{2}$/.test(fin)) {
            where.createdAt = { ...(where.createdAt ?? {}), lte: new Date(`${fin}T23:59:59.999`) };
        }
        return this.prisma.mouvementStock.findMany({
            where,
            include: {
                medicament: { select: { nom: true, dosage: true } },
                lot: { select: { numeroLot: true, datePeremption: true, prixAchat: true } },
                utilisateur: {
                    select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 500,
        });
    }
    async detailFinancier(cliniqueId, type, debut, fin) {
        const periode = {};
        if (debut && /^\d{4}-\d{2}-\d{2}$/.test(debut))
            periode.gte = new Date(`${debut}T00:00:00`);
        if (fin && /^\d{4}-\d{2}-\d{2}$/.test(fin))
            periode.lte = new Date(`${fin}T23:59:59.999`);
        const dansPeriode = (champ) => Object.keys(periode).length ? { [champ]: periode } : {};
        if (type === 'recus') {
            const lots = await this.prisma.lot.findMany({
                where: { medicament: { cliniqueId }, ...dansPeriode('createdAt') },
                include: { medicament: { select: { nom: true, dosage: true } } },
                orderBy: { createdAt: 'desc' },
            });
            return lots.map((l) => ({
                date: l.createdAt,
                medicament: `${l.medicament?.nom ?? ''} ${l.medicament?.dosage ?? ''}`.trim(),
                lot: l.numeroLot,
                quantite: l.quantiteInitiale,
                prixAchat: Number(l.prixAchat ?? 0),
                montant: l.quantiteInitiale * Number(l.prixAchat ?? 0),
            }));
        }
        if (type === 'vendus') {
            const ds = await this.prisma.dispensation.findMany({
                where: {
                    statut: 'CLOTUREE',
                    consultation: { passage: { cliniqueId } },
                    ...dansPeriode('createdAt'),
                },
                include: {
                    consultation: {
                        select: {
                            passage: {
                                select: {
                                    numeroOrdre: true,
                                    patient: { select: { nom: true, prenom: true } },
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            return ds.map((d) => ({
                date: d.createdAt,
                patient: `${d.consultation?.passage?.patient?.nom ?? ''} ${d.consultation?.passage?.patient?.prenom ?? ''}`.trim(),
                numeroOrdre: d.consultation?.passage?.numeroOrdre ?? '—',
                montant: Number(d.montantTotal),
            }));
        }
        if (type === 'perdus') {
            const r = await this.retraits(cliniqueId, debut, fin);
            return r.map((m) => ({
                date: m.createdAt,
                medicament: `${m.medicament?.nom ?? ''} ${m.medicament?.dosage ?? ''}`.trim(),
                motif: m.reference ?? 'Retrait',
                quantite: m.quantite,
                lot: m.lot?.numeroLot ?? '—',
                montant: Math.abs(m.quantite) * Number(m.lot?.prixAchat ?? 0),
                par: m.utilisateur?.personnel
                    ? `${m.utilisateur.personnel.nom} ${m.utilisateur.personnel.prenom}`
                    : 'Système',
                commentaire: m.commentaire ?? '',
            }));
        }
        if (type === 'correctifs') {
            const inv = await this.prisma.mouvementStock.findMany({
                where: {
                    type: 'INVENTAIRE',
                    quantite: { not: 0 },
                    medicament: { cliniqueId },
                    ...dansPeriode('createdAt'),
                },
                include: {
                    medicament: { select: { nom: true, dosage: true, prixVente: true } },
                    lot: { select: { numeroLot: true, prixAchat: true } },
                    utilisateur: {
                        select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            return inv.map((m) => ({
                date: m.createdAt,
                medicament: `${m.medicament?.nom ?? ''} ${m.medicament?.dosage ?? ''}`.trim(),
                lot: m.lot?.numeroLot ?? '—',
                ecart: m.quantite,
                montant: m.quantite * Number(m.lot?.prixAchat ?? m.medicament?.prixVente ?? 0),
                par: m.utilisateur?.personnel
                    ? `${m.utilisateur.personnel.nom} ${m.utilisateur.personnel.prenom}`
                    : '—',
            }));
        }
        const lots = await this.prisma.lot.findMany({
            where: { medicament: { cliniqueId }, quantiteRestante: { gt: 0 } },
            include: { medicament: { select: { nom: true, dosage: true } } },
            orderBy: { medicament: { nom: 'asc' } },
        });
        return lots.map((l) => ({
            medicament: `${l.medicament?.nom ?? ''} ${l.medicament?.dosage ?? ''}`.trim(),
            lot: l.numeroLot,
            peremption: l.datePeremption.toISOString().slice(0, 10),
            quantite: l.quantiteRestante,
            prixAchat: Number(l.prixAchat ?? 0),
            montant: l.quantiteRestante * Number(l.prixAchat ?? 0),
        }));
    }
    async pointsFinanciers(cliniqueId, debut, fin) {
        const periode = {};
        if (debut && /^\d{4}-\d{2}-\d{2}$/.test(debut))
            periode.gte = new Date(`${debut}T00:00:00`);
        if (fin && /^\d{4}-\d{2}-\d{2}$/.test(fin))
            periode.lte = new Date(`${fin}T23:59:59.999`);
        const dansPeriode = (champ) => ({ ...(Object.keys(periode).length ? { [champ]: periode } : {}) });
        const lotsPeriode = await this.prisma.lot.findMany({
            where: { medicament: { cliniqueId }, ...dansPeriode('createdAt') },
            select: { quantiteInitiale: true, prixAchat: true },
        });
        const recus = lotsPeriode.reduce((s, l) => s + l.quantiteInitiale * Number(l.prixAchat ?? 0), 0);
        const vendusAgg = await this.prisma.dispensation.aggregate({
            where: {
                statut: 'CLOTUREE',
                consultation: { passage: { cliniqueId } },
                ...dansPeriode('createdAt'),
            },
            _sum: { montantTotal: true },
        });
        const retraitsPeriode = await this.prisma.mouvementStock.findMany({
            where: { type: 'RETRAIT', medicament: { cliniqueId }, ...dansPeriode('createdAt') },
            include: { lot: { select: { prixAchat: true } } },
        });
        const perdus = retraitsPeriode.reduce((s, m) => s + Math.abs(m.quantite) * Number(m.lot?.prixAchat ?? 0), 0);
        const inventairesPeriode = await this.prisma.mouvementStock.findMany({
            where: { type: 'INVENTAIRE', medicament: { cliniqueId }, ...dansPeriode('createdAt') },
            include: { lot: { select: { prixAchat: true } }, medicament: { select: { prixVente: true } } },
        });
        const correctifs = inventairesPeriode.reduce((s, m) => s + m.quantite * Number(m.lot?.prixAchat ?? m.medicament.prixVente ?? 0), 0);
        const lotsRestants = await this.prisma.lot.findMany({
            where: { medicament: { cliniqueId }, quantiteRestante: { gt: 0 } },
            select: { quantiteRestante: true, prixAchat: true },
        });
        const restants = lotsRestants.reduce((s, l) => s + l.quantiteRestante * Number(l.prixAchat ?? 0), 0);
        return {
            periode: { debut: debut ?? null, fin: fin ?? null },
            recus,
            vendus: Number(vendusAgg._sum.montantTotal ?? 0),
            perdus,
            correctifs,
            restants,
        };
    }
};
exports.PharmacieService = PharmacieService;
PharmacieService.MOTIFS_RETRAIT = {
    RETOUR_FOURNISSEUR: 'Retour fournisseur',
    PERIME: 'Périmé',
    CASSE: 'Casse',
    PERTE: 'Perte',
    AUTRE: 'Autre',
};
exports.PharmacieService = PharmacieService = PharmacieService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        impression_service_1.ImpressionService])
], PharmacieService);
//# sourceMappingURL=pharmacie.service.js.map