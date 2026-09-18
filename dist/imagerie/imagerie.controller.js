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
    detailPassage(id) {
        return this.imagerieService.detailPassage(id);
    }
    enregistrerCr(id, dto) {
        return this.imagerieService.enregistrerCr(id, dto);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, imagerie_dto_1.EnregistrerCrDto]),
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
exports.ImagerieController = ImagerieController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('imagerie'),
    __metadata("design:paramtypes", [imagerie_service_1.ImagerieService])
], ImagerieController);
//# sourceMappingURL=imagerie.controller.js.map