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
exports.ImagerieService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const N = (x) => Number(x);
const includeExamen = {
    validePar: {
        select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
        },
    },
};
let ImagerieService = class ImagerieService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async imaServiceId(cliniqueId) {
        const ima = await this.prisma.service.findFirst({
            where: { cliniqueId, code: 'IMA' },
        });
        return ima?.id ?? null;
    }
    async fileAttente(cliniqueId) {
        const imaId = await this.imaServiceId(cliniqueId);
        if (!imaId)
            return [];
        const passages = await this.prisma.passage.findMany({
            where: {
                cliniqueId,
                statut: 'ACTIF',
                prestations: {
                    some: {
                        statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
                        OR: [{ serviceId: imaId }, { prestation: { serviceId: imaId } }],
                    },
                },
            },
            include: {
                patient: true,
                service: { select: { nom: true } },
                prestations: {
                    where: {
                        statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
                        OR: [{ serviceId: imaId }, { prestation: { serviceId: imaId } }],
                    },
                },
                examensImagerie: { select: { passagePrestationId: true, statut: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        return passages
            .filter((p) => p.prestations.some((l) => {
            const examen = p.examensImagerie.find((e) => e.passagePrestationId === l.id);
            return !examen || examen.statut !== 'VALIDE';
        }))
            .map((p) => ({
            id: p.id,
            numeroOrdre: p.numeroOrdre,
            patient: p.patient,
            service: p.service,
            createdAt: p.createdAt,
            nbExamens: p.prestations.filter((l) => {
                const examen = p.examensImagerie.find((e) => e.passagePrestationId === l.id);
                return !examen || examen.statut !== 'VALIDE';
            }).length,
        }));
    }
    async rechercher(reference, cliniqueId) {
        const ref = reference.trim().toUpperCase();
        const refSans = ref.replace(/[\s-]/g, '');
        if (!ref)
            return [];
        const imaId = await this.imaServiceId(cliniqueId);
        if (!imaId)
            return [];
        const filtreImaPayes = {
            statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
            OR: [{ serviceId: imaId }, { prestation: { serviceId: imaId } }],
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
                prestations: { some: filtreImaPayes },
            },
            include: {
                patient: true,
                service: { select: { id: true, code: true, nom: true } },
                prestations: {
                    where: filtreImaPayes,
                    include: { service: { select: { nom: true } } },
                },
                examensImagerie: true,
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
            nbExamensIma: p.prestations.length,
            nbExamensTraites: p.examensImagerie.length,
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
                examensImagerie: { include: includeExamen, orderBy: { createdAt: 'asc' } },
            },
        });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const historique = await this.prisma.examenImagerie.findMany({
            where: { patientId: passage.patientId },
            include: {
                passage: {
                    select: {
                        numeroOrdre: true,
                        createdAt: true,
                        service: { select: { nom: true } },
                    },
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
                referent: passage.referent,
                prestationDemandee: passage.prestationDemandee,
                createdAt: passage.createdAt,
                patient: passage.patient,
                service: passage.service,
                prestations: passage.prestations.map((l) => ({ ...l, montant: N(l.montant) })),
                examens: passage.examensImagerie,
            },
            historique,
        };
    }
    async enregistrerCr(passageId, dto) {
        const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        if (passage.statut !== 'ACTIF') {
            throw new common_1.BadRequestException('Code non activé : paiement requis.');
        }
        const imaId = await this.imaServiceId(passage.cliniqueId);
        if (!imaId)
            throw new common_1.BadRequestException('Aucun service d\'imagerie configuré.');
        const ligne = await this.prisma.passagePrestation.findFirst({
            where: { id: dto.passagePrestationId, passageId, statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] } },
            include: { prestation: true },
        });
        if (!ligne)
            throw new common_1.BadRequestException('Examen non payé ou inexistant.');
        if (ligne.serviceId !== imaId && ligne.prestation?.serviceId !== imaId) {
            throw new common_1.BadRequestException('Cette prestation ne relève pas de l\'imagerie.');
        }
        const existant = await this.prisma.examenImagerie.findUnique({
            where: { passagePrestationId: ligne.id },
        });
        if (existant && existant.statut === 'VALIDE') {
            throw new common_1.BadRequestException('Examen déjà validé : compte rendu verrouillé.');
        }
        if (!dto.indication?.trim() &&
            !dto.technique?.trim() &&
            !dto.resultat?.trim() &&
            !dto.conclusion?.trim()) {
            throw new common_1.BadRequestException('Renseignez au moins une section du compte rendu.');
        }
        return this.prisma.examenImagerie.upsert({
            where: { passagePrestationId: ligne.id },
            update: {
                indication: dto.indication ?? null,
                technique: dto.technique ?? null,
                resultat: dto.resultat ?? null,
                conclusion: dto.conclusion ?? null,
            },
            create: {
                passageId,
                passagePrestationId: ligne.id,
                cliniqueId: passage.cliniqueId,
                patientId: passage.patientId,
                libelle: ligne.libelle,
                indication: dto.indication ?? null,
                technique: dto.technique ?? null,
                resultat: dto.resultat ?? null,
                conclusion: dto.conclusion ?? null,
            },
            include: includeExamen,
        });
    }
    async valider(examenId, utilisateurId) {
        const examen = await this.prisma.examenImagerie.findUnique({
            where: { id: examenId },
        });
        if (!examen)
            throw new common_1.NotFoundException('Examen introuvable.');
        if (examen.statut !== 'RESULTATS') {
            throw new common_1.BadRequestException('Saisir le compte rendu avant validation.');
        }
        return this.prisma.examenImagerie.update({
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
            createdAt: { gte: debut, lte: fin },
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
            this.prisma.examenImagerie.findMany({
                where,
                include: {
                    passage: { select: { numeroOrdre: true, createdAt: true } },
                    patient: { select: { nom: true, prenom: true, code: true, sexe: true, age: true } },
                    validePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            this.prisma.examenImagerie.count({ where }),
        ]);
        return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
    }
    parseChamps(champsJson) {
        if (!champsJson)
            return [];
        try {
            const v = JSON.parse(champsJson);
            return Array.isArray(v) ? v : [];
        }
        catch {
            return [];
        }
    }
    genererTexte(texte, champs, valeurs) {
        return String(texte ?? '').replace(/\{(\w+)\}/g, (tout, code) => {
            const champ = (champs ?? []).find((c) => c.code === code);
            const v = valeurs && valeurs[code] != null ? String(valeurs[code]).trim() : '';
            if (v) {
                if (champ?.type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
                    const [a, m, j] = v.split('-');
                    return `${j}/${m}/${a}`;
                }
                return v;
            }
            return champ?.defaut ?? '......';
        });
    }
    async fichesTypes(cliniqueId) {
        return this.prisma.ficheEchographie.findMany({
            where: { cliniqueId, actif: true },
            orderBy: { libelle: 'asc' },
        });
    }
    async creerFicheType(dto) {
        return this.prisma.ficheEchographie.create({
            data: {
                cliniqueId: dto.cliniqueId,
                libelle: dto.libelle,
                titre: dto.titre,
                texte: dto.texte,
                champs: dto.champs,
            },
        });
    }
    async modifierFicheType(id, dto) {
        return this.prisma.ficheEchographie.update({
            where: { id },
            data: {
                libelle: dto.libelle,
                titre: dto.titre,
                texte: dto.texte,
                champs: dto.champs,
                actif: dto.actif,
            },
        });
    }
    async basculerFicheType(id) {
        const t = await this.prisma.ficheEchographie.findUnique({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException('Type de fiche introuvable.');
        return this.prisma.ficheEchographie.update({
            where: { id },
            data: { actif: !t.actif },
        });
    }
    async fichesPassage(passageId) {
        return this.prisma.ficheExamenImagerie.findMany({
            where: { passageId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async creerFiche(passageId, dto, medecinId) {
        const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
        if (!passage)
            throw new common_1.NotFoundException('Passage introuvable.');
        const type = await this.prisma.ficheEchographie.findUnique({ where: { id: dto.typeFicheId } });
        if (!type)
            throw new common_1.NotFoundException('Type de fiche introuvable.');
        const champs = this.parseChamps(type.champs);
        const valeurs = dto.valeurs ?? {};
        const texte = dto.texte?.trim()
            ? dto.texte
            : this.genererTexte(type.texte, champs, valeurs);
        if (!texte.trim())
            throw new common_1.BadRequestException('Le texte du compte rendu est vide.');
        return this.prisma.ficheExamenImagerie.create({
            data: {
                cliniqueId: passage.cliniqueId,
                passageId,
                patientId: passage.patientId,
                typeFicheId: type.id,
                libelleType: type.libelle,
                texte,
                valeurs: Object.keys(valeurs).length ? JSON.stringify(valeurs) : null,
                indication: dto.indication,
                prescripteur: dto.prescripteur,
                medecinId,
            },
        });
    }
    async modifierFiche(id, dto) {
        const fiche = await this.prisma.ficheExamenImagerie.findUnique({
            where: { id },
            include: { typeFiche: { select: { texte: true, champs: true } } },
        });
        if (!fiche)
            throw new common_1.NotFoundException('Fiche introuvable.');
        let texte = dto.texte ?? undefined;
        let valeurs = fiche.valeurs;
        if (dto.valeurs) {
            valeurs = JSON.stringify(dto.valeurs);
            if (!texte?.trim()) {
                texte = this.genererTexte(fiche.typeFiche.texte, this.parseChamps(fiche.typeFiche.champs), dto.valeurs);
            }
        }
        return this.prisma.ficheExamenImagerie.update({
            where: { id },
            data: {
                texte,
                valeurs,
                indication: dto.indication,
                prescripteur: dto.prescripteur,
            },
        });
    }
    async imprimerFiche(ficheId) {
        const fiche = await this.prisma.ficheExamenImagerie.findUnique({
            where: { id: ficheId },
            include: {
                patient: true,
                passage: { select: { numeroOrdre: true } },
                clinique: { select: { nom: true, adresse: true, telephone: true } },
                typeFiche: { select: { titre: true, titre2: true, libelle: true } },
                medecin: { select: { personnel: { select: { nom: true, prenom: true } } } },
            },
        });
        if (!fiche)
            throw new common_1.NotFoundException('Fiche introuvable.');
        const nomMedecin = fiche.medecin?.personnel
            ? `Dr ${fiche.medecin.personnel.nom} ${fiche.medecin.personnel.prenom}`
            : '';
        const date = new Date(fiche.createdAt).toLocaleDateString('fr-FR');
        const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #000; margin: 14mm; }
  .entete { text-align: center; margin-bottom: 6mm; }
  .entete .img { font-size: 15px; font-weight: 800; letter-spacing: 1px; }
  .entete .rep { font-size: 12px; font-weight: 700; margin-top: 2px; }
  .entete .dev { font-style: italic; font-size: 11px; margin-top: 1px; }
  .regle { border-bottom: 1.2px solid #000; margin: 4mm 0; }
  .titre { text-align: center; font-size: 15px; font-weight: 800; text-decoration: underline; letter-spacing: 1px; margin: 4mm 0; }
  .champs { display: flex; flex-wrap: wrap; gap: 3mm 10mm; margin-bottom: 4mm; }
  .champ { font-size: 12px; }
  .champ b { display: inline-block; min-width: 90px; }
  .corps { white-space: pre-wrap; line-height: 1.55; margin-top: 3mm; }
  .signature { margin-top: 22mm; display: flex; justify-content: space-between; align-items: flex-end; }
  .cachet { border: 1px solid #000; border-radius: 6px; width: 52mm; height: 26mm; text-align: center; font-size: 11px; color: #555; font-style: italic; display: flex; align-items: center; justify-content: center; }
  .medecin { font-weight: 800; text-align: right; }
</style></head><body>
  <div class="entete">
    <div class="img">IMAGERIE MÉDICALE</div>
    <div class="rep">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
    <div class="dev">Union - Discipline - Travail</div>
  </div>
  <div class="regle"></div>
  <div class="titre">${(fiche.typeFiche?.titre || fiche.typeFiche?.libelle || '').toUpperCase()}</div>
  ${fiche.typeFiche?.titre2 ? `<div class="titre">${fiche.typeFiche.titre2.toUpperCase()}</div>` : ''}
  <div class="champs">
    <span class="champ"><b>Date :</b> ${date}</span>
    <span class="champ"><b>Nom :</b> ${fiche.patient.nom}</span>
    <span class="champ"><b>Prénom(s) :</b> ${fiche.patient.prenom}</span>
    <span class="champ"><b>Âge :</b> ${fiche.patient.age ?? ''}</span>
    <span class="champ"><b>Indication :</b> ${fiche.indication ?? ''}</span>
    <span class="champ"><b>Prescripteur :</b> ${fiche.prescripteur ?? ''}</span>
  </div>
  <div class="regle"></div>
  <div class="corps">${fiche.texte.replace(/</g, '&lt;')}</div>
  <div class="signature">
    <div class="cachet">Signature et cachet</div>
    <div class="medecin">${nomMedecin}<br>Le Médecin</div>
  </div>
</body></html>`;
        const config = await this.prisma.imprimante.findFirst({
            where: { cliniqueId: fiche.cliniqueId, poste: 'A4', actif: true },
        });
        await this.prisma.impressionFile.create({
            data: {
                cliniqueId: fiche.cliniqueId,
                poste: 'A4',
                libelle: `Fiche échographie ${fiche.libelleType} — ${fiche.patient.nom} ${fiche.patient.prenom}`,
                contenu: html,
                format: 'A4',
                partage: config?.nom ?? null,
                nom: config?.nom ?? null,
                statut: 'EN_ATTENTE',
            },
        });
        return { ok: true, message: 'Fiche envoyée à l’imprimante A4 du poste.' };
    }
};
exports.ImagerieService = ImagerieService;
exports.ImagerieService = ImagerieService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImagerieService);
//# sourceMappingURL=imagerie.service.js.map