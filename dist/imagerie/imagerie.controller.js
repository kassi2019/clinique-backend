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
exports.ImagerieController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const imagerie_dto_1 = require("./dto/imagerie.dto");
const imagerie_service_1 = require("./imagerie.service");
let ImagerieController = class ImagerieController {
    constructor(imagerieService) {
        this.imagerieService = imagerieService;
    }
    rechercher(code, cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.imagerieService.rechercher(code ?? '', Number(cliniqueId));
    }
    fileAttente(cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.imagerieService.fileAttente(Number(cliniqueId));
    }
    detailPassage(id) {
        return this.imagerieService.detailPassage(id);
    }
    enregistrerCr(id, dto, req) {
        return this.imagerieService.enregistrerCr(id, dto, req.user?.id);
    }
    valider(id, req) {
        return this.imagerieService.valider(id, req.user.id);
    }
    historique(jour, recherche, page, perPage, cliniqueId) {
        if (!cliniqueId)
            return { data: [], total: 0, page: 1, perPage: 10, totalPages: 0 };
        return this.imagerieService.historique({
            jour,
            recherche,
            page: page ? Number(page) : 1,
            perPage: perPage ? Number(perPage) : 10,
            cliniqueId: Number(cliniqueId),
        });
    }
    fichesTypes(cliniqueId) {
        return this.imagerieService.fichesTypes(cliniqueId);
    }
    creerFicheType(dto) {
        return this.imagerieService.creerFicheType(dto);
    }
    modifierFicheType(id, dto) {
        return this.imagerieService.modifierFicheType(id, dto);
    }
    basculerFicheType(id) {
        return this.imagerieService.basculerFicheType(id);
    }
    fichesPassage(id) {
        return this.imagerieService.fichesPassage(id);
    }
    creerFiche(id, dto, req) {
        return this.imagerieService.creerFiche(id, dto, req.user.id);
    }
    modifierFiche(id, dto) {
        return this.imagerieService.modifierFiche(id, dto);
    }
    imprimerFiche(id) {
        return this.imagerieService.imprimerFiche(id);
    }
};
exports.ImagerieController = ImagerieController;
__decorate([
    (0, common_1.Get)('recherche'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "rechercher", null);
__decorate([
    (0, common_1.Get)('file'),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "fileAttente", null);
__decorate([
    (0, common_1.Get)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "detailPassage", null);
__decorate([
    (0, common_1.Post)('passages/:id/examens'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, imagerie_dto_1.EnregistrerCrDto, Object]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "enregistrerCr", null);
__decorate([
    (0, common_1.Post)('examens/:id/valider'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "valider", null);
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
], ImagerieController.prototype, "historique", null);
__decorate([
    (0, common_1.Get)('fiches-types'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "fichesTypes", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('fiches-types'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "creerFicheType", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('fiches-types/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "modifierFicheType", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('fiches-types/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "basculerFicheType", null);
__decorate([
    (0, common_1.Get)('passages/:id/fiches'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "fichesPassage", null);
__decorate([
    (0, common_1.Post)('passages/:id/fiches'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "creerFiche", null);
__decorate([
    (0, common_1.Patch)('fiches/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "modifierFiche", null);
__decorate([
    (0, common_1.Post)('fiches/:id/imprimer'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ImagerieController.prototype, "imprimerFiche", null);
exports.ImagerieController = ImagerieController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('imagerie'),
    __metadata("design:paramtypes", [imagerie_service_1.ImagerieService])
], ImagerieController);
//# sourceMappingURL=imagerie.controller.js.map