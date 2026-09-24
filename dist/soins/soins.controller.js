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
exports.SoinsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const soins_service_1 = require("./soins.service");
let SoinsController = class SoinsController {
    constructor(soinsService) {
        this.soinsService = soinsService;
    }
    fileAttente(cliniqueId) {
        return this.soinsService.fileAttente(cliniqueId);
    }
    rechercher(code, cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.soinsService.rechercher(code ?? '', cliniqueId);
    }
    detailPassage(id) {
        return this.soinsService.detailPassage(id);
    }
    realiser(id, body, req) {
        return this.soinsService.realiser(Number(body.passagePrestationId), body.date ?? new Date().toISOString(), body.observations, req.user.id);
    }
    realisations(cliniqueId, page, perPage, jour, recherche) {
        return this.soinsService.realisations(cliniqueId, page ? Number(page) : 1, perPage ? Number(perPage) : 10, jour, recherche);
    }
};
exports.SoinsController = SoinsController;
__decorate([
    (0, common_1.Get)('file'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SoinsController.prototype, "fileAttente", null);
__decorate([
    (0, common_1.Get)('recherche'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SoinsController.prototype, "rechercher", null);
__decorate([
    (0, common_1.Get)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SoinsController.prototype, "detailPassage", null);
__decorate([
    (0, common_1.Post)('passages/:id/realiser'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], SoinsController.prototype, "realiser", null);
__decorate([
    (0, common_1.Get)('realisations'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('perPage')),
    __param(3, (0, common_1.Query)('jour')),
    __param(4, (0, common_1.Query)('recherche')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String]),
    __metadata("design:returntype", void 0)
], SoinsController.prototype, "realisations", null);
exports.SoinsController = SoinsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('soins'),
    __metadata("design:paramtypes", [soins_service_1.SoinsService])
], SoinsController);
//# sourceMappingURL=soins.controller.js.map