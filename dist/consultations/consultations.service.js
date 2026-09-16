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
                    include: { service: { select: { nom: true } } },
                    orderBy: { createdAt: 'asc' },
                },
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
        return this.prisma.consultation.upsert({
            where: { passageId },
            update: dto,
            create: {
                passageId,
                patientId: passage.patientId,
                medecinId,
                ...dto,
            },
            include: includeConsultation,
        });
    }
    async ajouterMedicament(consultationId, dto) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation)
            throw new common_1.NotFoundException('Consultation introuvable.');
        let nom = dto.nom?.trim();
        let forme = dto.forme;
        let medicamentId = dto.medicamentId;
        if (dto.medicamentId) {
            const medicament = await this.prisma.medicament.findUnique({
                where: { id: dto.medicamentId },
            });
            if (!medicament)
                throw new common_1.BadRequestException('Médicament introuvable.');
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
    async retirerExamen(ligneId) {
        const ligne = await this.prisma.passagePrestation.findUnique({
            where: { id: ligneId },
        });
        if (!ligne)
            throw new common_1.NotFoundException('Ligne introuvable.');
        if (ligne.statut !== 'EN_ATTENTE') {
            throw new common_1.BadRequestException('Cette prestation est déjà payée : impossible de retirer la prescription.');
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