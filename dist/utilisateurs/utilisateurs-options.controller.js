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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilisateursOptionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let UtilisateursOptionsController = class UtilisateursOptionsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async lister(cliniqueId) {
        const id = Number(cliniqueId);
        const utilisateurs = await this.prisma.utilisateur.findMany({
            where: Number.isInteger(id) && id > 0 ? { personnel: { cliniqueId: id } } : {},
            select: { id: true, matricule: true, personnel: { select: { nom: true, prenom: true } } },
        });
        return utilisateurs
            .map((u) => ({
            id: u.id,
            nom: `${u.personnel.nom} ${u.personnel.prenom}`.trim() || u.matricule,
        }))
            .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
    }
};
exports.UtilisateursOptionsController = UtilisateursOptionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UtilisateursOptionsController.prototype, "lister", null);
exports.UtilisateursOptionsController = UtilisateursOptionsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('utilisateurs-options'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UtilisateursOptionsController);
//# sourceMappingURL=utilisateurs-options.controller.js.map