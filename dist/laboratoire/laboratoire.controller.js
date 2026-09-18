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
exports.LaboratoireController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const laboratoire_dto_1 = require("./dto/laboratoire.dto");
const laboratoire_service_1 = require("./laboratoire.service");
let LaboratoireController = class LaboratoireController {
    constructor(laboratoireService) {
        this.laboratoireService = laboratoireService;
    }
    rechercher(code, cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.laboratoireService.rechercher(code ?? '', Number(cliniqueId));
    }
    detailPassage(id) {
        return this.laboratoireService.detailPassage(id);
    }
    enregistrerPrelevement(id, dto, req) {
        return this.laboratoireService.enregistrerPrelevement(id, dto.passagePrestationId, req.user.id);
    }
    enregistrerResultats(id, dto) {
        return this.laboratoireService.enregistrerResultats(id, dto);
    }
    valider(id, req) {
        return this.laboratoireService.valider(id, req.user.id);
    }
    historique(jour, recherche, page, perPage, cliniqueId) {
        if (!cliniqueId)
            return { data: [], total: 0, page: 1, perPage: 10, totalPages: 0 };
        return this.laboratoireService.historique({
            jour,
            recherche,
            page: page ? Number(page) : 1,
            perPage: perPage ? Number(perPage) : 10,
            cliniqueId: Number(cliniqueId),
        });
    }
};
exports.LaboratoireController = LaboratoireController;
__decorate([
    (0, common_1.Get)('recherche'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LaboratoireController.prototype, "rechercher", null);
__decorate([
    (0, common_1.Get)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LaboratoireController.prototype, "detailPassage", null);
__decorate([
    (0, common_1.Post)('passages/:id/prelevements'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, laboratoire_dto_1.EnregistrerPrelevementDto, Object]),
    __metadata("design:returntype", void 0)
], LaboratoireController.prototype, "enregistrerPrelevement", null);
__decorate([
    (0, common_1.Put)('examens/:id/resultats'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, laboratoire_dto_1.EnregistrerResultatsDto]),
    __metadata("design:returntype", void 0)
], LaboratoireController.prototype, "enregistrerResultats", null);
__decorate([
    (0, common_1.Post)('examens/:id/valider'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LaboratoireController.prototype, "valider", null);
__decorate([
    (0, common_1.Get)('examens'),
    __param(0, (0, common_1.Query)('jour')),
    __param(1, (0, common_1.Query)('recherche')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __param(4, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], LaboratoireController.prototype, "historique", null);
exports.LaboratoireController = LaboratoireController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('laboratoire'),
    __metadata("design:paramtypes", [laboratoire_service_1.LaboratoireService])
], LaboratoireController);
//# sourceMappingURL=laboratoire.controller.js.map