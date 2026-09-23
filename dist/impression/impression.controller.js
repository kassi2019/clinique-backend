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
exports.ImpressionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const impression_service_1 = require("./impression.service");
let ImpressionController = class ImpressionController {
    constructor(impressionService) {
        this.impressionService = impressionService;
    }
    async getConfig(cliniqueId) {
        if (!cliniqueId)
            return { printers: [] };
        const printers = await this.impressionService.getConfigs(Number(cliniqueId));
        return { printers };
    }
    imprimerTicket(id) {
        return this.impressionService.imprimerTicketPassage(id);
    }
    imprimerRecu(id) {
        return this.impressionService.imprimerRecuPaiement(id);
    }
    imprimerOrdonnance(id) {
        return this.impressionService.imprimerOrdonnance(id);
    }
    imprimerRecuPharmacie(id) {
        return this.impressionService.imprimerRecuPharmacie(id);
    }
    async listPrinters() {
        const printers = await this.impressionService.listWindowsPrinters();
        return { printers };
    }
    getFile(poste, cliniqueId) {
        return this.impressionService.getFileAttente(poste ?? 'TICKET', cliniqueId ? Number(cliniqueId) : undefined);
    }
    updateStatut(id, body) {
        return this.impressionService.updateStatutFile(id, body.statut, body.erreur);
    }
    updateConfig(body) {
        return this.impressionService.updateConfig(Number(body.cliniqueId), body.poste, {
            type: body.type,
            nom: body.nom,
            partage: body.partage,
            ip: body.ip,
            port: body.port != null ? Number(body.port) : undefined,
            largeur: body.largeur != null ? Number(body.largeur) : undefined,
            autoPrint: body.autoPrint,
        });
    }
    test(body) {
        return this.impressionService.testPrinter(Number(body.cliniqueId), body.poste ?? 'TICKET');
    }
};
exports.ImpressionController = ImpressionController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('config'),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImpressionController.prototype, "getConfig", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ImpressionController.prototype, "imprimerTicket", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('paiements/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ImpressionController.prototype, "imprimerRecu", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('consultations/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ImpressionController.prototype, "imprimerOrdonnance", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('pharmacie-paiements/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ImpressionController.prototype, "imprimerRecuPharmacie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Get)('printers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImpressionController.prototype, "listPrinters", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('file'),
    __param(0, (0, common_1.Query)('poste')),
    __param(1, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ImpressionController.prototype, "getFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('file/:id/statut'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ImpressionController.prototype, "updateStatut", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Put)('config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImpressionController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImpressionController.prototype, "test", null);
exports.ImpressionController = ImpressionController = __decorate([
    (0, common_1.Controller)('impression'),
    __metadata("design:paramtypes", [impression_service_1.ImpressionService])
], ImpressionController);
//# sourceMappingURL=impression.controller.js.map