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
exports.RapportsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rapports_service_1 = require("./rapports.service");
let RapportsController = class RapportsController {
    constructor(rapportsService) {
        this.rapportsService = rapportsService;
    }
    lister(cliniqueId) {
        return this.rapportsService.lister(cliniqueId);
    }
    getRapport(cliniqueId, mois, annee) {
        return this.rapportsService.getRapport(cliniqueId, mois, annee);
    }
    update(id, body) {
        return this.rapportsService.update(id, body);
    }
    reimporterEntete(id) {
        return this.rapportsService.reimporterEntete(id);
    }
    saveValeurs(id, body) {
        return this.rapportsService.saveValeurs(id, body.tableau, body.valeurs ?? []);
    }
    preRemplir(id) {
        return this.rapportsService.preRemplir(id);
    }
};
exports.RapportsController = RapportsController;
__decorate([
    (0, common_1.Get)('sig/liste'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "lister", null);
__decorate([
    (0, common_1.Get)('sig'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('mois', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('annee', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "getRapport", null);
__decorate([
    (0, common_1.Patch)('sig/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('sig/:id/reimporter-entete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "reimporterEntete", null);
__decorate([
    (0, common_1.Put)('sig/:id/valeurs'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "saveValeurs", null);
__decorate([
    (0, common_1.Post)('sig/:id/pre-remplir'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "preRemplir", null);
exports.RapportsController = RapportsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('rapports'),
    __metadata("design:paramtypes", [rapports_service_1.RapportsService])
], RapportsController);
//# sourceMappingURL=rapports.controller.js.map