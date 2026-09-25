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
    fileAttente(cliniqueId) {
        return this.materniteService.fileAttente(cliniqueId);
    }
    rechercher(code, cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.materniteService.rechercher(code ?? '', cliniqueId);
    }
    traites(cliniqueId, jour, page, perPage) {
        return this.materniteService.traites(cliniqueId, jour, page ? Number(page) : 1, perPage ? Number(perPage) : 10);
    }
    detailPassage(id) {
        return this.materniteService.detailPassage(id);
    }
    terminer(id) {
        return this.materniteService.terminerPassage(id);
    }
    assurerConsultation(id, req) {
        return this.materniteService.assurerConsultation(id, req.user.id);
    }
    dossierPatient(patientId) {
        return this.materniteService.dossierPatient(patientId);
    }
    creerCpon(id, dto, req) {
        return this.materniteService.creerCpon(id, dto, req.user.id);
    }
    modifierCpon(id, dto) {
        return this.materniteService.modifierCpon(id, dto);
    }
    creerPf(id, dto, req) {
        return this.materniteService.creerPf(id, dto, req.user.id);
    }
    modifierPf(id, dto) {
        return this.materniteService.modifierPf(id, dto);
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
    (0, common_1.Get)('file'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "fileAttente", null);
__decorate([
    (0, common_1.Get)('recherche'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "rechercher", null);
__decorate([
    (0, common_1.Get)('traites'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('jour')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "traites", null);
__decorate([
    (0, common_1.Get)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "detailPassage", null);
__decorate([
    (0, common_1.Patch)('passages/:id/terminer'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "terminer", null);
__decorate([
    (0, common_1.Post)('passages/:id/consultation'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "assurerConsultation", null);
__decorate([
    (0, common_1.Get)('grossesses/patient/:patientId'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "dossierPatient", null);
__decorate([
    (0, common_1.Post)('passages/:id/cpon'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, maternite_dto_1.CreateCponDto, Object]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "creerCpon", null);
__decorate([
    (0, common_1.Patch)('cpon/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, maternite_dto_1.UpdateCponDto]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "modifierCpon", null);
__decorate([
    (0, common_1.Post)('passages/:id/pf'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, maternite_dto_1.CreatePfDto, Object]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "creerPf", null);
__decorate([
    (0, common_1.Patch)('pf/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, maternite_dto_1.UpdatePfDto]),
    __metadata("design:returntype", void 0)
], MaterniteController.prototype, "modifierPf", null);
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