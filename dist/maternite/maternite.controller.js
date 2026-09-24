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
exports.MaterniteController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const maternite_dto_1 = require("./dto/maternite.dto");
const maternite_service_1 = require("./maternite.service");
let MaterniteController = class MaterniteController {
    constructor(materniteService) {
        this.materniteService = materniteService;
    }
    grossesses(cliniqueId, search, statut, page, perPage) {
        return this.materniteService.grossesses({
            cliniqueId,
            search,
            statut,
            page: page ? Number(page) : undefined,
            perPage: perPage ? Number(perPage) : undefined,
        });
    }
    detail(id) {
        return this.materniteService.detailGrossesse(id);
    }
    creer(dto) {
        return this.materniteService.creerGrossesse(dto);
    }
    modifier(id, dto) {
        return this.materniteService.modifierGrossesse(id, dto);
    }
    creerVisite(id, dto, req) {
        return this.materniteService.creerVisite(id, dto, req.user.id);
    }
    modifierVisite(id, dto) {
        return this.materniteService.modifierVisite(id, dto);
    }
    creerAccouchement(id, dto, req) {
        return this.materniteService.creerAccouchement(id, dto, req.user.id);
    }
    modifierAccouchement(id, dto) {
        return this.materniteService.modifierAccouchement(id, dto);
    }
    accouchements(cliniqueId, search, page, perPage) {
        return this.materniteService.accouchements({
            cliniqueId,
            search,
            page: page ? Number(page) : undefined,
            perPage: perPage ? Number(perPage) : undefined,
        });
    }
};
exports.MaterniteController = MaterniteController;
__decorate([
    (0, common_1.Get)('grossesses'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('statut')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "grossesses", null);
__decorate([
    (0, common_1.Get)('grossesses/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)('grossesses'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [maternite_dto_1.CreateGrossesseDto]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "creer", null);
__decorate([
    (0, common_1.Patch)('grossesses/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, maternite_dto_1.UpdateGrossesseDto]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "modifier", null);
__decorate([
    (0, common_1.Post)('grossesses/:id/cpn'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, maternite_dto_1.CreateVisiteCpnDto, Object]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "creerVisite", null);
__decorate([
    (0, common_1.Patch)('cpn/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, maternite_dto_1.UpdateVisiteCpnDto]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "modifierVisite", null);
__decorate([
    (0, common_1.Post)('grossesses/:id/accouchement'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, maternite_dto_1.CreateAccouchementDto, Object]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "creerAccouchement", null);
__decorate([
    (0, common_1.Patch)('accouchements/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, maternite_dto_1.UpdateAccouchementDto]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "modifierAccouchement", null);
__decorate([
    (0, common_1.Get)('accouchements'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "accouchements", null);
exports.MaterniteController = MaterniteController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('maternite'),
    __metadata("design:paramtypes", [maternite_service_1.MaterniteService])
], MaterniteController);
//# sourceMappingURL=maternite.controller.js.map