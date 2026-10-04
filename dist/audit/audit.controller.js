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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditController = class AuditController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async lister(page, perPage, utilisateurId, cliniqueId, jour) {
        const p = page ? Number(page) : 1;
        const pp = perPage ? Number(perPage) : 50;
        const uid = utilisateurId ? Number(utilisateurId) : undefined;
        const cid = cliniqueId ? Number(cliniqueId) : undefined;
        const where = {
            ...(cid ? { cliniqueId: cid } : {}),
            ...(uid ? { utilisateurId: uid } : {}),
            ...(jour && /^\d{4}-\d{2}-\d{2}$/.test(jour)
                ? { createdAt: { gte: new Date(`${jour}T00:00:00`), lte: new Date(`${jour}T23:59:59.999`) } }
                : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.journalAction.findMany({
                where,
                include: {
                    utilisateur: {
                        select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (p - 1) * pp,
                take: pp,
            }),
            this.prisma.journalAction.count({ where }),
        ]);
        return { data, total, page: p, perPage: pp, totalPages: Math.ceil(total / pp) };
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('perPage')),
    __param(2, (0, common_1.Query)('utilisateurId')),
    __param(3, (0, common_1.Query)('cliniqueId')),
    __param(4, (0, common_1.Query)('jour')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "lister", null);
exports.AuditController = AuditController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('journal'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map