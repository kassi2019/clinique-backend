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
exports.AccueilController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const accueil_service_1 = require("./accueil.service");
const create_passage_dto_1 = require("./dto/create-passage.dto");
let AccueilController = class AccueilController {
    constructor(accueilService) {
        this.accueilService = accueilService;
    }
    rechercherPatients(search, cliniqueId) {
        return this.accueilService.rechercherPatients(search ?? '', cliniqueId ? Number(cliniqueId) : undefined);
    }
    listerPassages(cliniqueId, date, debut, fin, constantes, search, serviceId, page, perPage) {
        return this.accueilService.listerPassages(cliniqueId, {
            date,
            debut,
            fin,
            constantes: constantes === 'OUI' || constantes === 'NON' ? constantes : undefined,
            search,
            serviceId: serviceId ? Number(serviceId) : undefined,
            page: page ? Number(page) : undefined,
            perPage: perPage !== undefined ? Number(perPage) : undefined,
        });
    }
    passageParReference(code, cliniqueId) {
        return this.accueilService.passageParReference(code, cliniqueId ? Number(cliniqueId) : undefined);
    }
    findOne(id) {
        return this.accueilService.findOne(id);
    }
    creerPassage(dto) {
        return this.accueilService.creerPassage(dto);
    }
    modifierPassage(id, dto) {
        return this.accueilService.modifierPassage(id, dto);
    }
};
exports.AccueilController = AccueilController;
__decorate([
    (0, common_1.Get)('patients'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AccueilController.prototype, "rechercherPatients", null);
__decorate([
    (0, common_1.Get)('passages'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('debut')),
    __param(3, (0, common_1.Query)('fin')),
    __param(4, (0, common_1.Query)('constantes')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('serviceId')),
    __param(7, (0, common_1.Query)('page')),
    __param(8, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AccueilController.prototype, "listerPassages", null);
__decorate([
    (0, common_1.Get)('passages/code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AccueilController.prototype, "passageParReference", null);
__decorate([
    (0, common_1.Get)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AccueilController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('passages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_passage_dto_1.CreatePassageDto]),
    __metadata("design:returntype", void 0)
], AccueilController.prototype, "creerPassage", null);
__decorate([
    (0, common_1.Patch)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_passage_dto_1.UpdatePassageDto]),
    __metadata("design:returntype", void 0)
], AccueilController.prototype, "modifierPassage", null);
exports.AccueilController = AccueilController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('accueil'),
    __metadata("design:paramtypes", [accueil_service_1.AccueilService])
], AccueilController);
//# sourceMappingURL=accueil.controller.js.map