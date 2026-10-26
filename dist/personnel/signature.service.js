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
exports.SignatureService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const FORMAT_IMAGE = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
const TAILLE_MAX = 2_000_000;
let SignatureService = class SignatureService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async lire(personnelId) {
        const p = await this.prisma.personnel.findUnique({
            where: { id: personnelId },
            select: { id: true, nom: true, prenom: true, signature: true, cachet: true },
        });
        if (!p)
            throw new common_1.NotFoundException('Personnel introuvable.');
        return p;
    }
    async enregistrer(personnelId, dto) {
        await this.lire(personnelId);
        const data = {};
        for (const champ of ['signature', 'cachet']) {
            const v = dto[champ];
            if (v === undefined)
                continue;
            if (v !== null && (typeof v !== 'string' || !FORMAT_IMAGE.test(v))) {
                throw new common_1.BadRequestException(`Image de ${champ} invalide (PNG ou JPEG attendu).`);
            }
            if (v && v.length > TAILLE_MAX) {
                throw new common_1.BadRequestException(`Image de ${champ} trop lourde : réduisez-la ou recadrez-la.`);
            }
            data[champ] = v;
        }
        await this.prisma.personnel.update({ where: { id: personnelId }, data });
        return this.lire(personnelId);
    }
    async personnelDe(utilisateurId, pourModifier = false) {
        const u = await this.prisma.utilisateur.findUnique({
            where: { id: utilisateurId },
            select: { personnelId: true, role: { select: { signatureAutorisee: true } } },
        });
        if (!u)
            throw new common_1.NotFoundException('Compte introuvable.');
        if (pourModifier && !u.role.signatureAutorisee) {
            throw new common_1.ForbiddenException("Votre rôle n'est pas autorisé à utiliser une signature : voyez l'administrateur.");
        }
        return u.personnelId;
    }
};
exports.SignatureService = SignatureService;
exports.SignatureService = SignatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SignatureService);
//# sourceMappingURL=signature.service.js.map