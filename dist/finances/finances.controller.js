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
exports.FinancesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const onglet_decorator_1 = require("../auth/onglet.decorator");
const onglet_guard_1 = require("../auth/onglet.guard");
const finances_guard_1 = require("./finances.guard");
const finances_service_1 = require("./finances.service");
let FinancesController = class FinancesController {
    constructor(finances) {
        this.finances = finances;
    }
    monService(req) {
        return this.finances.monService(req.user.id);
    }
    prendre(req) {
        return this.finances.prendreService(req.user.id);
    }
    terminer(req) {
        return this.finances.terminerService(req.user.id);
    }
    presence(req) {
        return this.finances.presence(req.user.id);
    }
    enService(cliniqueId) {
        return this.finances.enService(cliniqueId);
    }
    services(cliniqueId, mois, personnelId) {
        return this.finances.services(cliniqueId, mois, personnelId ? Number(personnelId) : undefined);
    }
    modifierService(id, dto, req) {
        return this.finances.modifierService(id, dto ?? {}, req.user.id);
    }
    remunerations(cliniqueId) {
        return this.finances.remunerations(cliniqueId);
    }
    definirRemuneration(personnelId, dto) {
        return this.finances.definirRemuneration(personnelId, dto ?? {});
    }
    genererFiches(dto) {
        return this.finances.genererFiches(Number(dto.cliniqueId), dto.mois);
    }
    fiches(cliniqueId, mois) {
        return this.finances.fiches(cliniqueId, mois);
    }
    detailFiche(id) {
        return this.finances.detailFiche(id);
    }
    modifierFiche(id, dto) {
        return this.finances.modifierFiche(id, dto ?? {});
    }
    statutFiche(id, dto, req) {
        return this.finances.changerStatutFiche(id, dto.statut, req.user.id);
    }
};
exports.FinancesController = FinancesController;
__decorate([
    (0, common_1.Get)('mon-service'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "monService", null);
__decorate([
    (0, common_1.Post)('mon-service/prendre'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "prendre", null);
__decorate([
    (0, common_1.Post)('mon-service/terminer'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "terminer", null);
__decorate([
    (0, common_1.Post)('mon-service/presence'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "presence", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, onglet_decorator_1.Onglet)('FINANCES.DIRECT'),
    (0, common_1.Get)('en-service'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "enService", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, onglet_decorator_1.Onglet)('FINANCES.SERVICES'),
    (0, common_1.Get)('services'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('mois')),
    __param(2, (0, common_1.Query)('personnelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "services", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, onglet_decorator_1.Onglet)('FINANCES.SERVICES'),
    (0, common_1.Patch)('services/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "modifierService", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, common_1.Get)('remunerations'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "remunerations", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, onglet_decorator_1.Onglet)('FINANCES.TARIFS'),
    (0, common_1.Put)('remunerations/:personnelId'),
    __param(0, (0, common_1.Param)('personnelId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "definirRemuneration", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, onglet_decorator_1.Onglet)('FINANCES.FICHES'),
    (0, common_1.Post)('fiches/generer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "genererFiches", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, onglet_decorator_1.Onglet)('FINANCES.FICHES'),
    (0, common_1.Get)('fiches'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('mois')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "fiches", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, onglet_decorator_1.Onglet)('FINANCES.FICHES'),
    (0, common_1.Get)('fiches/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "detailFiche", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, onglet_decorator_1.Onglet)('FINANCES.FICHES'),
    (0, common_1.Patch)('fiches/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "modifierFiche", null);
__decorate([
    (0, common_1.UseGuards)(finances_guard_1.FinancesGuard),
    (0, onglet_decorator_1.Onglet)('FINANCES.FICHES'),
    (0, common_1.Post)('fiches/:id/statut'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], FinancesController.prototype, "statutFiche", null);
exports.FinancesController = FinancesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, onglet_guard_1.OngletGuard),
    (0, common_1.Controller)('finances'),
    __metadata("design:paramtypes", [finances_service_1.FinancesService])
], FinancesController);
//# sourceMappingURL=finances.controller.js.map