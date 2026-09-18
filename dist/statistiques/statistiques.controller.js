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
exports.StatistiquesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const statistiques_service_1 = require("./statistiques.service");
let StatistiquesController = class StatistiquesController {
    constructor(statistiquesService) {
        this.statistiquesService = statistiquesService;
    }
    tableauBord(jour, cliniqueId) {
        if (!cliniqueId)
            return {};
        return this.statistiquesService.tableauBord(Number(cliniqueId), jour);
    }
    frequentation(debut, fin, page, perPage, cliniqueId) {
        if (!cliniqueId)
            return {};
        return this.statistiquesService.frequentation(Number(cliniqueId), debut, fin, page ? Number(page) : 1, perPage ? Number(perPage) : 20);
    }
    recettes(debut, fin, cliniqueId) {
        if (!cliniqueId)
            return {};
        return this.statistiquesService.recettes(Number(cliniqueId), debut, fin);
    }
    laboratoire(debut, fin, cliniqueId) {
        if (!cliniqueId)
            return {};
        return this.statistiquesService.laboratoire(Number(cliniqueId), debut, fin);
    }
    imagerie(debut, fin, cliniqueId) {
        if (!cliniqueId)
            return {};
        return this.statistiquesService.imagerie(Number(cliniqueId), debut, fin);
    }
    hospitalisation(debut, fin, cliniqueId) {
        if (!cliniqueId)
            return {};
        return this.statistiquesService.hospitalisation(Number(cliniqueId), debut, fin);
    }
    pharmacie(debut, fin, cliniqueId) {
        if (!cliniqueId)
            return {};
        return this.statistiquesService.pharmacie(Number(cliniqueId), debut, fin);
    }
    maternite(debut, fin, cliniqueId) {
        if (!cliniqueId)
            return {};
        return this.statistiquesService.maternite(Number(cliniqueId), debut, fin);
    }
};
exports.StatistiquesController = StatistiquesController;
__decorate([
    (0, common_1.Get)('tableau-bord'),
    __param(0, (0, common_1.Query)('jour')),
    __param(1, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StatistiquesController.prototype, "tableauBord", null);
__decorate([
    (0, common_1.Get)('frequentation'),
    __param(0, (0, common_1.Query)('debut')),
    __param(1, (0, common_1.Query)('fin')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __param(4, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], StatistiquesController.prototype, "frequentation", null);
__decorate([
    (0, common_1.Get)('recettes'),
    __param(0, (0, common_1.Query)('debut')),
    __param(1, (0, common_1.Query)('fin')),
    __param(2, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatistiquesController.prototype, "recettes", null);
__decorate([
    (0, common_1.Get)('laboratoire'),
    __param(0, (0, common_1.Query)('debut')),
    __param(1, (0, common_1.Query)('fin')),
    __param(2, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatistiquesController.prototype, "laboratoire", null);
__decorate([
    (0, common_1.Get)('imagerie'),
    __param(0, (0, common_1.Query)('debut')),
    __param(1, (0, common_1.Query)('fin')),
    __param(2, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatistiquesController.prototype, "imagerie", null);
__decorate([
    (0, common_1.Get)('hospitalisation'),
    __param(0, (0, common_1.Query)('debut')),
    __param(1, (0, common_1.Query)('fin')),
    __param(2, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatistiquesController.prototype, "hospitalisation", null);
__decorate([
    (0, common_1.Get)('pharmacie'),
    __param(0, (0, common_1.Query)('debut')),
    __param(1, (0, common_1.Query)('fin')),
    __param(2, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatistiquesController.prototype, "pharmacie", null);
__decorate([
    (0, common_1.Get)('maternite'),
    __param(0, (0, common_1.Query)('debut')),
    __param(1, (0, common_1.Query)('fin')),
    __param(2, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatistiquesController.prototype, "maternite", null);
exports.StatistiquesController = StatistiquesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('statistiques'),
    __metadata("design:paramtypes", [statistiques_service_1.StatistiquesService])
], StatistiquesController);
//# sourceMappingURL=statistiques.controller.js.map