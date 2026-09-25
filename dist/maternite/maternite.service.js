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
                numeroGestante: dto.numeroGestante,
                modeEntree: dto.modeEntree,
                antecedentsMedicaux: dto.antecedentsMedicaux,
                antecedentsChirurgicaux: dto.antecedentsChirurgicaux,
                enfantsVivants: dto.enfantsVivants,
                enfantsDecedes: dto.enfantsDecedes,
                cesariennes: dto.cesariennes,
                avortements: dto.avortements,
                toxemie: dto.toxemie,
                vatStatut: dto.vatStatut,
                vat1: dto.vat1 ? new Date(dto.vat1) : undefined,
                vat2: dto.vat2 ? new Date(dto.vat2) : undefined,
                vatRappel: dto.vatRappel ? new Date(dto.vatRappel) : undefined,
                statutVih: dto.statutVih,
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
            numeroGestante: dto.numeroGestante,
            modeEntree: dto.modeEntree,
            antecedentsMedicaux: dto.antecedentsMedicaux,
            antecedentsChirurgicaux: dto.antecedentsChirurgicaux,
            enfantsVivants: dto.enfantsVivants,
            enfantsDecedes: dto.enfantsDecedes,
            cesariennes: dto.cesariennes,
            avortements: dto.avortements,
            toxemie: dto.toxemie,
            vatStatut: dto.vatStatut,
            vat1: dto.vat1 ? new Date(dto.vat1) : undefined,
            vat2: dto.vat2 ? new Date(dto.vat2) : undefined,
            vatRappel: dto.vatRappel ? new Date(dto.vatRappel) : undefined,
            statutVih: dto.statutVih,
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
                taille: dto.taille,
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
                risqueDepiste: dto.risqueDepiste,
                malnutrition: dto.malnutrition,
                anemie: dto.anemie,
                syphilisPositif: dto.syphilisPositif,
                agHbsPositif: dto.agHbsPositif,
                spDose: dto.spDose,
                mildaRemise: dto.mildaRemise,
                ferFolate: dto.ferFolate,
                deparasitee: dto.deparasitee,
                counselingPfppi: dto.counselingPfppi,
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
                taille: dto.taille,
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
                risqueDepiste: dto.risqueDepiste,
                malnutrition: dto.malnutrition,
                anemie: dto.anemie,
                syphilisPositif: dto.syphilisPositif,
                agHbsPositif: dto.agHbsPositif,
                spDose: dto.spDose,
                mildaRemise: dto.mildaRemise,
                ferFolate: dto.ferFolate,
                deparasitee: dto.deparasitee,
                counselingPfppi: dto.counselingPfppi,
            },
            include: includeVisite,
        });
    }
    champsRegistreAccouchement(dto) {
        return {
            modeEntree: dto.modeEntree,
            numeroAccouchement: dto.numeroAccouchement,
            heureArrivee: dto.heureArrivee ? new Date(dto.heureArrivee) : undefined,
            motifAdmission: dto.motifAdmission,
            enTravail: dto.enTravail,
            contractions: dto.contractions,
            pocheEauxIntacte: dto.pocheEauxIntacte,
            ruptureHeures: dto.ruptureHeures,
            liquideAspect: dto.liquideAspect,
            antecedentsMedicaux: dto.antecedentsMedicaux,
            htaConnue: dto.htaConnue,
            diabeteConnu: dto.diabeteConnu,
            antecedentsChirurgicaux: dto.antecedentsChirurgicaux,
            gemellite: dto.gemellite,
            prematurite: dto.prematurite,
            enfantsVivants: dto.enfantsVivants,
            enfantsDecedes: dto.enfantsDecedes,
            cesariennes: dto.cesariennes,
            avortements: dto.avortements,
            toxemie: dto.toxemie,
            statutVihAccueil: dto.statutVihAccueil,
            sousTarvCpn: dto.sousTarvCpn,
            numeroPec: dto.numeroPec,
            ageGrossessePremiereCpn: dto.ageGrossessePremiereCpn,
            nombreCpn: dto.nombreCpn,
            offreTestVih: dto.offreTestVih,
            resultatTestVih: dto.resultatTestVih,
            delivranceLe: dto.delivranceLe ? new Date(dto.delivranceLe) : undefined,
            revisionUterine: dto.revisionUterine,
            ubt: dto.ubt,
            hppi: dto.hppi,
            perimetreCranienEnfant: dto.perimetreCranienEnfant,
            reanimationNn: dto.reanimationNn,
            decedeMaternite: dto.decedeMaternite,
            interventionMedecin: dto.interventionMedecin,
            sortieMereLe: dto.sortieMereLe ? new Date(dto.sortieMereLe) : undefined,
            sortieMereMode: dto.sortieMereMode,
        };
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
                vatStatut: dto.vatStatut,
                mortNeType: dto.mortNeType,
                declarationNaissanceRenseignee: dto.declarationNaissanceRenseignee,
                declarationNaissanceComplete: dto.declarationNaissanceComplete,
                evacueeAvant: dto.evacueeAvant,
                evacueeApres: dto.evacueeApres,
                nouveauNeEvacue: dto.nouveauNeEvacue,
                nouveauNeProtegeTetanos: dto.nouveauNeProtegeTetanos,
                accouchementMultiple: dto.accouchementMultiple,
                ...this.champsRegistreAccouchement(dto),
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
                vatStatut: dto.vatStatut,
                mortNeType: dto.mortNeType,
                declarationNaissanceRenseignee: dto.declarationNaissanceRenseignee,
                declarationNaissanceComplete: dto.declarationNaissanceComplete,
                evacueeAvant: dto.evacueeAvant,
                evacueeApres: dto.evacueeApres,
                nouveauNeEvacue: dto.nouveauNeEvacue,
                nouveauNeProtegeTetanos: dto.nouveauNeProtegeTetanos,
                accouchementMultiple: dto.accouchementMultiple,
                ...this.champsRegistreAccouchement(dto),
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
                vatStatut: dto.vatStatut,
                mortNeType: dto.mortNeType,
                declarationNaissanceRenseignee: dto.declarationNaissanceRenseignee,
                declarationNaissanceComplete: dto.declarationNaissanceComplete,
                evacueeAvant: dto.evacueeAvant,
                evacueeApres: dto.evacueeApres,
                nouveauNeEvacue: dto.nouveauNeEvacue,
                nouveauNeProtegeTetanos: dto.nouveauNeProtegeTetanos,
                accouchementMultiple: dto.accouchementMultiple,
                ...this.champsRegistreAccouchement(dto),
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
    async fileAttente(cliniqueId) {
        const passages = await this.prisma.passage.findMany({
            where: {
                cliniqueId,
                statut: 'ACTIF',
                materniteTraiteLe: null,
                prestations: {
                    some: { statut: 'PAYEE', prestation: { type: 'MATERNITE' } },
                },
            },
            include: {
                patient: true,
                service: { select: { nom: true } },
                prestations: {
                    where: { statut: 'PAYEE', prestation: { type: 'MATERNITE' } },
                    select: { libelle: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return passages.map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            patient: p.patient,
            service: p.service,
            createdAt: p.createdAt,
            actes: p.prestations.map((l) => l.libelle),
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
                prestations: { some: { statut: 'PAYEE', prestation: { type: 'MATERNITE' } } },
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
                    where: { statut: 'PAYEE', prestation: { type: 'MATERNITE' } },
                    select: { libelle: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return passages.map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            patient: p.patient,
            service: p.service,
            createdAt: p.createdAt,
            actes: p.prestations.map((l) => l.libelle),
            traite: p.materniteTraiteLe !== null,
        }));
    }
    async traites(cliniqueId, jour, page = 1, perPage = 10) {
        const debut = jour ? new Date(`${jour}T00:00:00`) : undefined;
        const fin = jour ? new Date(`${jour}T23:59:59.999`) : undefined;
        const where = {
            cliniqueId,
            materniteTraiteLe: { not: null },
            ...(debut ? { materniteTraiteLe: { gte: debut, lte: fin } } : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.passage.findMany({
                where,
                include: { patient: true, service: { select: { nom: true } } },
                orderBy: { materniteTraiteLe: 'desc' },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            this.prisma.passage.count({ where }),
        ]);
        return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
    }
    async detailPassage(passageId) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
            include: {
                patient: true,
                service: { select: { nom: true } },
                prestations: {
                    where: { statut: 'PAYEE' },
                    include: { prestation: true },
                },
                consultations: {
                    take: 1,
                    orderBy: { id: 'desc' },
                    include: { medicaments: true },
                },
            },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const { consultations, ...reste } = passage;
        const passageReponse = { ...reste, consultation: consultations?.[0] ?? null };
        const dossier = await this.prisma.grossesse.findFirst({
            where: { patientId: passage.patientId },
            orderBy: { createdAt: 'desc' },
            include: {
                visites: { include: includeVisite, orderBy: { numero: 'asc' } },
                accouchement: true,
            },
        });
        const [cpons, pfs] = await Promise.all([
            this.prisma.consultationPostnatale.findMany({
                where: { passageId },
                include: { agent: { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } } },
                orderBy: { date: 'desc' },
            }),
            this.prisma.consultationPf.findMany({
                where: { passageId },
                include: { agent: { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } } },
                orderBy: { date: 'desc' },
            }),
        ]);
        return { passage: passageReponse, dossier, cpons, pfs };
    }
    async terminerPassage(passageId) {
        const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        return this.prisma.passage.update({
            where: { id: passageId },
            data: { materniteTraiteLe: new Date() },
        });
    }
    async assurerConsultation(passageId, agentId) {
        const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const existante = await this.prisma.consultation.findUnique({
            where: { passageId },
        });
        if (existante)
            return existante;
        return this.prisma.consultation.create({
            data: {
                passageId,
                patientId: passage.patientId,
                medecinId: agentId,
                motif: passage.motif ?? 'Consultation maternité',
            },
        });
    }
    async dossierPatient(patientId) {
        const dossier = await this.prisma.grossesse.findFirst({
            where: { patientId },
            orderBy: { createdAt: 'desc' },
            include: {
                visites: { include: includeVisite, orderBy: { numero: 'asc' } },
                accouchement: true,
            },
        });
        if (!dossier)
            throw new common_1.NotFoundException('Aucun dossier de grossesse pour cette patiente.');
        return dossier;
    }
    async creerCpon(passageId, dto, agentId) {
        const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        return this.prisma.consultationPostnatale.create({
            data: {
                cliniqueId: passage.cliniqueId,
                passageId,
                patientId: passage.patientId,
                grossesseId: dto.grossesseId ?? undefined,
                date: new Date(dto.date),
                modeEntree: dto.modeEntree,
                numeroGestanteReport: dto.numeroGestanteReport,
                typeCpon: dto.typeCpon,
                dateAccouchement: dto.dateAccouchement ? new Date(dto.dateAccouchement) : undefined,
                lieuAccouchement: dto.lieuAccouchement,
                modeAccouchement: dto.modeAccouchement,
                numeroDepistagePec: dto.numeroDepistagePec,
                statutVih: dto.statutVih,
                examenMere: dto.examenMere,
                examenEnfant: dto.examenEnfant,
                conseils: dto.conseils,
                observations: dto.observations,
                agentId,
            },
        });
    }
    async modifierCpon(id, dto) {
        const c = await this.prisma.consultationPostnatale.findUnique({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Consultation postnatale introuvable.');
        return this.prisma.consultationPostnatale.update({
            where: { id },
            data: {
                date: dto.date ? new Date(dto.date) : undefined,
                modeEntree: dto.modeEntree,
                grossesseId: dto.grossesseId,
                numeroGestanteReport: dto.numeroGestanteReport,
                typeCpon: dto.typeCpon,
                dateAccouchement: dto.dateAccouchement ? new Date(dto.dateAccouchement) : undefined,
                lieuAccouchement: dto.lieuAccouchement,
                modeAccouchement: dto.modeAccouchement,
                numeroDepistagePec: dto.numeroDepistagePec,
                statutVih: dto.statutVih,
                examenMere: dto.examenMere,
                examenEnfant: dto.examenEnfant,
                conseils: dto.conseils,
                observations: dto.observations,
            },
        });
    }
    async creerPf(passageId, dto, agentId) {
        const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        return this.prisma.consultationPf.create({
            data: {
                cliniqueId: passage.cliniqueId,
                passageId,
                patientId: passage.patientId,
                date: new Date(dto.date),
                methode: dto.methode,
                nouvelleUtilisatrice: dto.nouvelleUtilisatrice ?? true,
                protégée: dto.protégée ?? false,
                perdueDeVue: dto.perdueDeVue ?? false,
                abandon: dto.abandon ?? false,
                arretRetrait: dto.arretRetrait ?? false,
                conseilPostpartum: dto.conseilPostpartum ?? false,
                produitPostpartumImmediat: dto.produitPostpartumImmediat ?? false,
                produitPostAbortum: dto.produitPostAbortum ?? false,
                femmesFormeesAutoInjection: dto.femmesFormeesAutoInjection ?? false,
                istPresente: dto.istPresente ?? false,
                seropositive: dto.seropositive ?? false,
                nourrisson0_6: dto.nourrisson0_6 ?? false,
                nourrisson6: dto.nourrisson6 ?? false,
                observations: dto.observations,
                agentId,
            },
        });
    }
    async modifierPf(id, dto) {
        const p = await this.prisma.consultationPf.findUnique({ where: { id } });
        if (!p)
            throw new common_1.NotFoundException('Consultation PF introuvable.');
        return this.prisma.consultationPf.update({
            where: { id },
            data: {
                date: dto.date ? new Date(dto.date) : undefined,
                methode: dto.methode,
                nouvelleUtilisatrice: dto.nouvelleUtilisatrice,
                protégée: dto.protégée,
                perdueDeVue: dto.perdueDeVue,
                abandon: dto.abandon,
                arretRetrait: dto.arretRetrait,
                conseilPostpartum: dto.conseilPostpartum,
                produitPostpartumImmediat: dto.produitPostpartumImmediat,
                produitPostAbortum: dto.produitPostAbortum,
                femmesFormeesAutoInjection: dto.femmesFormeesAutoInjection,
                istPresente: dto.istPresente,
                seropositive: dto.seropositive,
                nourrisson0_6: dto.nourrisson0_6,
                nourrisson6: dto.nourrisson6,
                observations: dto.observations,
            },
        });
    }
};
exports.MaterniteService = MaterniteService;
exports.MaterniteService = MaterniteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaterniteService);
//# sourceMappingURL=maternite.service.js.map