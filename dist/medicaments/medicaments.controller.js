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
exports.MedicamentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let MedicamentsController = class MedicamentsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(cliniqueId) {
        const where = cliniqueId ? { cliniqueId: Number(cliniqueId) } : {};
        return this.prisma.medicament.findMany({
            where,
            orderBy: { nom: 'asc' },
        });
    }
    async create(dto) {
        return this.prisma.medicament.create({
            data: {
                cliniqueId: dto.cliniqueId,
                nom: dto.nom,
                forme: dto.forme,
                dosage: dto.dosage,
                stock: dto.stock !== undefined ? Number(dto.stock) : 0,
                prixVente: dto.prixVente !== undefined ? Number(dto.prixVente) : undefined,
                seuilAlerte: dto.seuilAlerte !== undefined ? Number(dto.seuilAlerte) : 0,
                uniteVente: dto.uniteVente ?? 'BOITE',
                consommable: dto.consommable === true || dto.consommable === 'true',
            },
        });
    }
    async update(id, dto) {
        return this.prisma.medicament.update({
            where: { id },
            data: {
                nom: dto.nom,
                forme: dto.forme,
                dosage: dto.dosage,
                stock: dto.stock !== undefined ? Number(dto.stock) : undefined,
                prixVente: dto.prixVente !== undefined ? Number(dto.prixVente) : undefined,
                seuilAlerte: dto.seuilAlerte !== undefined ? Number(dto.seuilAlerte) : undefined,
                uniteVente: dto.uniteVente,
                actif: dto.actif,
                consommable: dto.consommable !== undefined
                    ? dto.consommable === true || dto.consommable === 'true'
                    : undefined,
            },
        });
    }
    async remove(id) {
        return this.prisma.medicament.update({
            where: { id },
            data: { actif: false },
        });
    }
    async importer(dto) {
        const lignes = dto.lignes ?? [];
        const cliniqueId = Number(dto.cliniqueId);
        if (!cliniqueId)
            throw new Error('cliniqueId obligatoire.');
        let ajoutes = 0;
        for (const l of lignes) {
            const nom = String(l.nom ?? '').trim();
            if (!nom)
                continue;
            const existe = await this.prisma.medicament.findUnique({
                where: { cliniqueId_nom: { cliniqueId, nom } },
            });
            if (existe)
                continue;
            await this.prisma.medicament.create({
                data: {
                    cliniqueId,
                    nom,
                    forme: l.forme || undefined,
                    dosage: l.dosage || undefined,
                    stock: Number(l.stock) || 0,
                    prixVente: l.prixVente != null && l.prixVente !== '' ? Number(l.prixVente) : undefined,
                    seuilAlerte: Number(l.seuilAlerte) || 0,
                    uniteVente: l.uniteVente ?? 'BOITE',
                    consommable: l.consommable === true || l.consommable === 'true' || String(l.consommable).toLowerCase() === 'oui',
                },
            });
            ajoutes++;
        }
        return { ajoutes, total: lignes.length };
    }
};
exports.MedicamentsController = MedicamentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicamentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicamentsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicamentsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicamentsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicamentsController.prototype, "importer", null);
exports.MedicamentsController = MedicamentsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('medicaments'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MedicamentsController);
//# sourceMappingURL=medicaments.controller.js.map