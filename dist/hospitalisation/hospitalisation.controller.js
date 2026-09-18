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
exports.HospitalisationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const hospitalisation_dto_1 = require("./dto/hospitalisation.dto");
const hospitalisation_service_1 = require("./hospitalisation.service");
let HospitalisationController = class HospitalisationController {
    constructor(hospitalisationService) {
        this.hospitalisationService = hospitalisationService;
    }
    listerTypes(cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.hospitalisationService.listerTypes(Number(cliniqueId));
    }
    creerType(cliniqueId, dto) {
        return this.hospitalisationService.creerType(Number(cliniqueId), dto);
    }
    modifierType(id, dto) {
        return this.hospitalisationService.modifierType(id, dto);
    }
    desactiverType(id) {
        return this.hospitalisationService.desactiverType(id);
    }
    listerChambres(cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.hospitalisationService.listerChambres(Number(cliniqueId));
    }
    creerChambre(cliniqueId, dto) {
        return this.hospitalisationService.creerChambre(Number(cliniqueId), dto);
    }
    modifierChambre(id, dto) {
        return this.hospitalisationService.modifierChambre(id, dto);
    }
    desactiverChambre(id) {
        return this.hospitalisationService.desactiverChambre(id);
    }
    creerLit(id, dto) {
        return this.hospitalisationService.creerLit(id, dto);
    }
    desactiverLit(id) {
        return this.hospitalisationService.desactiverLit(id);
    }
    listerLits(cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.hospitalisationService.listerLits(Number(cliniqueId));
    }
    rechercher(code, cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.hospitalisationService.rechercher(code ?? '', Number(cliniqueId));
    }
    detailPassage(id) {
        return this.hospitalisationService.detailPassage(id);
    }
    admettre(id, dto) {
        return this.hospitalisationService.admettre(id, dto);
    }
    suivi(id, dto) {
        return this.hospitalisationService.suivi(id, dto);
    }
    sortie(id, dto, req) {
        return this.hospitalisationService.sortie(id, dto, req.user.id);
    }
    historique(jour, recherche, statut, page, perPage, cliniqueId) {
        if (!cliniqueId)
            return { data: [], total: 0, page: 1, perPage: 10, totalPages: 0 };
        return this.hospitalisationService.historique({
            jour,
            recherche,
            statut,
            page: page ? Number(page) : 1,
            perPage: perPage ? Number(perPage) : 10,
            cliniqueId: Number(cliniqueId),
        });
    }
};
exports.HospitalisationController = HospitalisationController;
__decorate([
    (0, common_1.Get)('types-chambres'),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "listerTypes", null);
__decorate([
    (0, common_1.Post)('types-chambres'),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hospitalisation_dto_1.CreerTypeChambreDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "creerType", null);
__decorate([
    (0, common_1.Patch)('types-chambres/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, hospitalisation_dto_1.CreerTypeChambreDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "modifierType", null);
__decorate([
    (0, common_1.Delete)('types-chambres/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "desactiverType", null);
__decorate([
    (0, common_1.Get)('chambres'),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "listerChambres", null);
__decorate([
    (0, common_1.Post)('chambres'),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hospitalisation_dto_1.CreerChambreDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "creerChambre", null);
__decorate([
    (0, common_1.Patch)('chambres/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, hospitalisation_dto_1.CreerChambreDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "modifierChambre", null);
__decorate([
    (0, common_1.Delete)('chambres/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "desactiverChambre", null);
__decorate([
    (0, common_1.Post)('chambres/:id/lits'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, hospitalisation_dto_1.CreerLitDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "creerLit", null);
__decorate([
    (0, common_1.Delete)('lits/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "desactiverLit", null);
__decorate([
    (0, common_1.Get)('lits'),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "listerLits", null);
__decorate([
    (0, common_1.Get)('recherche'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "rechercher", null);
__decorate([
    (0, common_1.Get)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "detailPassage", null);
__decorate([
    (0, common_1.Post)('passages/:id/admissions'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, hospitalisation_dto_1.AdmissionDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "admettre", null);
__decorate([
    (0, common_1.Patch)('sejours/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, hospitalisation_dto_1.SuiviDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "suivi", null);
__decorate([
    (0, common_1.Post)('sejours/:id/sortie'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, hospitalisation_dto_1.SortieDto, Object]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "sortie", null);
__decorate([
    (0, common_1.Get)('sejours'),
    __param(0, (0, common_1.Query)('jour')),
    __param(1, (0, common_1.Query)('recherche')),
    __param(2, (0, common_1.Query)('statut')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('perPage')),
    __param(5, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "historique", null);
exports.HospitalisationController = HospitalisationController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('hospitalisation'),
    __metadata("design:paramtypes", [hospitalisation_service_1.HospitalisationService])
], HospitalisationController);
//# sourceMappingURL=hospitalisation.controller.js.map