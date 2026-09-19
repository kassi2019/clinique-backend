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
exports.ConsultationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const includeConsultation = {
    medicaments: true,
    medecin: {
        select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
        },
    },
};
let ConsultationsService = class ConsultationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async rechercher(reference, cliniqueId) {
        const ref = reference.trim().toUpperCase();
        const refSansTiret = ref.replace(/[\s-]/g, '');
        if (!ref)
            return [];
        let passage = await this.prisma.passage.findFirst({
            where: {
                cliniqueId,
                numeroOrdre: { contains: ref },
            },
            include: {
                patient: true,
                service: { select: { id: true, code: true, nom: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!passage) {
            const patient = await this.prisma.patient.findFirst({
                where: { cliniqueId, code: refSansTiret },
            });
            if (patient) {
                passage = await this.prisma.passage.findFirst({
                    where: { patientId: patient.id },
                    include: {
                        patient: true,
                        service: { select: { id: true, code: true, nom: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                });
            }
        }
        if (!passage)
            return [];
        return [
            {
                id: passage.id,
                numeroOrdre: passage.numeroOrdre,
                statut: passage.statut,
                typePatient: passage.typePatient,
                createdAt: passage.createdAt,
                patient: passage.patient,
                service: passage.service,
                consultable: passage.statut === 'ACTIF',
            },
        ];
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
                examensLabo: { select: { passagePrestationId: true, statut: true } },
                examensImagerie: { select: { passagePrestationId: true, statut: true } },
                consultations: { include: includeConsultation },
            },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const historique = await this.prisma.consultation.findMany({
            where: { patientId: passage.patientId },
            include: {
                medicaments: true,
                medecin: {
                    select: {
                        matricule: true,
                        personnel: { select: { nom: true, prenom: true } },
                    },
                },
                passage: {
                    select: { numeroOrdre: true, createdAt: true, service: { select: { nom: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            passage: {
                id: passage.id,
                numeroOrdre: passage.numeroOrdre,
                statut: passage.statut,
                typePatient: passage.typePatient,
                createdAt: passage.createdAt,
                constantes: {
                    taille: passage.taille,
                    temperature: passage.temperature ? Number(passage.temperature) : null,
                    pouls: passage.pouls,
                    tensionGauche: passage.tensionGauche,
                    tensionDroite: passage.tensionDroite,
                    poids: passage.poids ? Number(passage.poids) : null,
                },
                patient: passage.patient,
                service: passage.service,
                prestations: passage.prestations.map((l) => ({
                    ...l,
                    montant: Number(l.montant),
                })),
                consultation: passage.consultations[0] ?? null,
                examensLabo: passage.examensLabo,
                examensImagerie: passage.examensImagerie,
            },
            historique,
        };
    }
    async creerOuMaj(passageId, medecinId, dto) {
        const passage = await this.prisma.passage.findUnique({
            where: { id: passageId },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        if (passage.statut !== 'ACTIF') {
            throw new common_1.BadRequestException('Ce passage n\'est pas activé : le paiement à la caisse est requis avant la consultation.');
        }
        if (dto.patient) {
            await this.prisma.patient.update({
                where: { id: passage.patientId },
                data: {
                    profession: dto.patient.profession,
                    nationalite: dto.patient.nationalite,
                    scolarisation: dto.patient.scolarisation,
                    statutConjugal: dto.patient.statutConjugal,
                    typePopulation: dto.patient.typePopulation,
                    populationsRisque: dto.patient.populationsRisque,
                    protectionSociale: dto.patient.protectionSociale,
                    residenceHabituelle: dto.patient.residenceHabituelle,
                    residenceActuelle: dto.patient.residenceActuelle,
                },
            });
        }
        const { patient: _patient, moDebut, moFin, ...donnees } = dto;
        const consultation = await this.prisma.consultation.upsert({
            where: { passageId },
            update: {
                ...donnees,
                moDebut: moDebut ? new Date(moDebut) : undefined,
                moFin: moFin ? new Date(moFin) : undefined,
            },
            create: {
                passageId,
                patientId: passage.patientId,
                medecinId,
                ...donnees,
                moDebut: moDebut ? new Date(moDebut) : undefined,
                moFin: moFin ? new Date(moFin) : undefined,
            },
            include: includeConsultation,
        });
        await this.synchroniserFactureHospitalisation(passage.cliniqueId, passageId, dto);
        return consultation;
    }
    async synchroniserFactureHospitalisation(cliniqueId, passageId, dto) {
        if (dto.hospitalisation === true) {
            if (!dto.litId || dto.hospitalisationDureeJours == null || dto.hospitalisationDureeJours < 1) {
                return;
            }
            const lit = await this.prisma.lit.findUnique({
                where: { id: dto.litId },
                include: { chambre: true },
            });
            if (!lit || !lit.actif)
                throw new common_1.BadRequestException('Lit introuvable ou désactivé.');
            let tarif = lit.chambre.tarifJournalier;
            if (!tarif) {
                const prestationHosp = await this.prisma.prestation.findFirst({
                    where: {
                        cliniqueId,
                        type: 'HOSPITALISATION',
                        actif: true,
                        service: { code: 'HOS' },
                    },
                });
                if (!prestationHosp) {
                    throw new common_1.BadRequestException('Aucun tarif d\'hospitalisation paramétré.');
                }
                tarif = prestationHosp.montant;
            }
            const montant = tarif.mul(dto.hospitalisationDureeJours);
            const libelle = `Hospitalisation — ${dto.hospitalisationDureeJours} jour(s) — chambre ${lit.chambre.numero}`;
            const existante = await this.prisma.passagePrestation.findFirst({
                where: { passageId, statut: 'EN_ATTENTE', libelle: { startsWith: 'Hospitalisation —' } },
            });
            if (existante) {
                await this.prisma.passagePrestation.update({
                    where: { id: existante.id },
                    data: { libelle, montant },
                });
            }
            else {
                const serviceHos = await this.prisma.service.findFirst({
                    where: { cliniqueId, code: 'HOS' },
                });
                await this.prisma.passagePrestation.create({
                    data: {
                        passageId,
                        libelle,
                        montant,
                        serviceId: serviceHos?.id ?? null,
                        source: 'PRESCRIPTION',
                        statut: 'EN_ATTENTE',
                    },
                });
            }
        }
        else if (dto.hospitalisation === false) {
            const existante = await this.prisma.passagePrestation.findFirst({
                where: { passageId, statut: 'EN_ATTENTE', libelle: { startsWith: 'Hospitalisation —' } },
            });
            if (existante) {
                await this.prisma.passagePrestation.delete({ where: { id: existante.id } });
            }
        }
    }
    async ajouterMedicament(consultationId, dto) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
            include: { passage: { select: { typePatient: true } } },
        });
        if (!consultation)
            throw new common_1.NotFoundException('Consultation introuvable.');
        const estInterne = consultation.passage.typePatient !== 'EXTERNE';
        let nom = dto.nom?.trim();
        let forme = dto.forme;
        let medicamentId = dto.medicamentId;
        if (dto.medicamentId) {
            const medicament = await this.prisma.medicament.findUnique({
                where: { id: dto.medicamentId },
            });
            if (!medicament)
                throw new common_1.BadRequestException('Médicament introuvable.');
            if (estInterne && medicament.stock <= 0) {
                throw new common_1.BadRequestException(`« ${medicament.nom} » est en rupture de stock : prescription impossible pour un patient interne.`);
            }
            nom = medicament.nom;
            forme = medicament.forme ?? dto.forme;
            medicamentId = medicament.id;
        }
        if (!nom)
            throw new common_1.BadRequestException('Nom du médicament requis.');
        return this.prisma.prescription.create({
            data: {
                consultationId,
                medicamentId,
                medicamentNom: nom,
                forme,
                posologie: dto.posologie,
                quantite: dto.quantite,
                duree: dto.duree,
            },
        });
    }
    async retirerMedicament(prescriptionId) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription)
            throw new common_1.NotFoundException('Prescription introuvable.');
        return this.prisma.prescription.delete({ where: { id: prescriptionId } });
    }
    async prescrireExamens(consultationId, lignesIds) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation)
            throw new common_1.NotFoundException('Consultation introuvable.');
        const lignes = await this.prisma.passagePrestation.findMany({
            where: {
                id: { in: lignesIds },
                passageId: consultation.passageId,
                statut: 'NON_PRESCRITE',
            },
        });
        if (lignes.length !== lignesIds.length) {
            throw new common_1.BadRequestException('Certaines prestations ne peuvent pas être prescrites (déjà payées ou inexistantes).');
        }
        await this.prisma.passagePrestation.updateMany({
            where: { id: { in: lignesIds } },
            data: { statut: 'EN_ATTENTE' },
        });
        return this.prisma.passagePrestation.findMany({
            where: { id: { in: lignesIds } },
        });
    }
    async ajouterExamen(consultationId, dto) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
            include: { passage: { include: { prestations: true } } },
        });
        if (!consultation)
            throw new common_1.NotFoundException('Consultation introuvable.');
        const libelleLibre = dto.libelle?.trim();
        if (libelleLibre) {
            const doublon = consultation.passage.prestations.find((l) => l.prestationId === null &&
                l.source === 'PRESCRIPTION' &&
                l.statut === 'EXTERNE' &&
                l.libelle.toLowerCase() === libelleLibre.toLowerCase());
            if (doublon) {
                throw new common_1.BadRequestException('Cet examen libre est déjà prescrit.');
            }
            return this.prisma.passagePrestation.create({
                data: {
                    passageId: consultation.passageId,
                    libelle: libelleLibre,
                    montant: 0,
                    source: 'PRESCRIPTION',
                    statut: 'EXTERNE',
                },
            });
        }
        if (!dto.prestationId) {
            throw new common_1.BadRequestException('Choisissez un examen du catalogue ou saisissez un libellé.');
        }
        const prestation = await this.prisma.prestation.findUnique({
            where: { id: dto.prestationId },
        });
        if (!prestation || !prestation.actif) {
            throw new common_1.BadRequestException('Prestation introuvable ou inactive.');
        }
        if (prestation.type === 'CONSULTATION') {
            throw new common_1.BadRequestException('Une consultation ne peut pas être ajoutée comme examen.');
        }
        const existante = consultation.passage.prestations.find((l) => l.prestationId === dto.prestationId);
        if (existante) {
            if (existante.statut === 'EN_ATTENTE' || existante.statut === 'PAYEE') {
                throw new common_1.BadRequestException('Cet examen est déjà prescrit (ou payé).');
            }
            return this.prisma.passagePrestation.update({
                where: { id: existante.id },
                data: { statut: 'EN_ATTENTE' },
            });
        }
        return this.prisma.passagePrestation.create({
            data: {
                passageId: consultation.passageId,
                prestationId: prestation.id,
                libelle: prestation.libelle,
                montant: prestation.montant,
                serviceId: prestation.serviceId,
                source: 'PRESCRIPTION',
                statut: 'EN_ATTENTE',
            },
        });
    }
    async retirerExamen(ligneId) {
        const ligne = await this.prisma.passagePrestation.findUnique({
            where: { id: ligneId },
        });
        if (!ligne)
            throw new common_1.NotFoundException('Ligne introuvable.');
        const libreExterne = ligne.source === 'PRESCRIPTION' && ligne.statut === 'EXTERNE';
        if (ligne.statut !== 'EN_ATTENTE' && !libreExterne) {
            throw new common_1.BadRequestException('Cette prestation est déjà payée : impossible de retirer la prescription.');
        }
        if (ligne.source === 'PRESCRIPTION') {
            return this.prisma.passagePrestation.delete({ where: { id: ligneId } });
        }
        return this.prisma.passagePrestation.update({
            where: { id: ligneId },
            data: { statut: 'NON_PRESCRITE' },
        });
    }
    async sauvegarderOrdonnance(consultationId) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation)
            throw new common_1.NotFoundException('Consultation introuvable.');
        return this.prisma.consultation.update({
            where: { id: consultationId },
            data: { ordonnanceSauveeLe: new Date() },
            include: includeConsultation,
        });
    }
    async valider(consultationId) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation)
            throw new common_1.NotFoundException('Consultation introuvable.');
        return this.prisma.consultation.update({
            where: { id: consultationId },
            data: { statut: 'VALIDEE', valideeLe: new Date() },
            include: includeConsultation,
        });
    }
};
exports.ConsultationsService = ConsultationsService;
exports.ConsultationsService = ConsultationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsultationsService);
//# sourceMappingURL=consultations.service.js.map