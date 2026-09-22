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
exports.CaisseController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const caisse_service_1 = require("./caisse.service");
const encaisser_dto_1 = require("./dto/encaisser.dto");
let CaisseController = class CaisseController {
    constructor(caisseService) {
        this.caisseService = caisseService;
    }
    rechercher(search, cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.caisseService.rechercher(search ?? '', cliniqueId);
    }
    fileAttente(cliniqueId, jour, page, perPage) {
        return this.caisseService.fileAttente(cliniqueId, page ? Number(page) : 1, perPage ? Number(perPage) : 100, jour);
    }
    payesDuJour(cliniqueId, page, perPage) {
        return this.caisseService.payesDuJour(cliniqueId, page ? Number(page) : 1, perPage ? Number(perPage) : 100);
    }
    detail(id) {
        return this.caisseService.detailPassage(id);
    }
    ajouterPrestation(id, dto) {
        return this.caisseService.ajouterPrestation(id, dto.prestationId);
    }
    retirerPrestation(id) {
        return this.caisseService.retirerPrestation(id);
    }
    encaisser(id, dto, req) {
        return this.caisseService.encaisser(id, dto, req.user.id);
    }
    annuler(id, dto) {
        return this.caisseService.annulerPaiement(id, dto.motif);
    }
};
exports.CaisseController = CaisseController;
__decorate([
    (0, common_1.Get)('recherche'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], CaisseController.prototype, "rechercher", null);
__decorate([
    (0, common_1.Get)('file-attente'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('jour')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], CaisseController.prototype, "fileAttente", null);
__decorate([
    (0, common_1.Get)('payes'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], CaisseController.prototype, "payesDuJour", null);
__decorate([
    (0, common_1.Get)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CaisseController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)('passages/:id/prestations'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, encaisser_dto_1.AjouterPrestationDto]),
    __metadata("design:returntype", void 0)
], CaisseController.prototype, "ajouterPrestation", null);
__decorate([
    (0, common_1.Delete)('prestations/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CaisseController.prototype, "retirerPrestation", null);
__decorate([
    (0, common_1.Post)('passages/:id/encaisser'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, encaisser_dto_1.EncaisserDto, Object]),
    __metadata("design:returntype", void 0)
], CaisseController.prototype, "encaisser", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('paiements/:id/annuler'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, encaisser_dto_1.AnnulerPaiementDto]),
    __metadata("design:returntype", void 0)
], CaisseController.prototype, "annuler", null);
exports.CaisseController = CaisseController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('caisse'),
    __metadata("design:paramtypes", [caisse_service_1.CaisseService])
], CaisseController);
//# sourceMappingURL=caisse.controller.js.map