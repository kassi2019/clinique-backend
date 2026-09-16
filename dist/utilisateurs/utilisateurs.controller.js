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
exports.UtilisateursController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const create_utilisateur_dto_1 = require("./dto/create-utilisateur.dto");
const update_utilisateur_dto_1 = require("./dto/update-utilisateur.dto");
const utilisateurs_service_1 = require("./utilisateurs.service");
let UtilisateursController = class UtilisateursController {
    constructor(utilisateursService) {
        this.utilisateursService = utilisateursService;
    }
    findAll(page, perPage) {
        return this.utilisateursService.findAll({
            page: page ? Number(page) : undefined,
            perPage: perPage !== undefined ? Number(perPage) : undefined,
        });
    }
    findOne(id) {
        return this.utilisateursService.findOne(id);
    }
    create(dto) {
        return this.utilisateursService.create(dto);
    }
    update(id, dto) {
        return this.utilisateursService.update(id, dto);
    }
    resetMotDePasse(id, dto) {
        if (!dto.motDePasse || dto.motDePasse.length < 6) {
            throw new common_1.BadRequestException('Le mot de passe doit contenir au moins 6 caractères.');
        }
        return this.utilisateursService.resetMotDePasse(id, dto.motDePasse);
    }
    remove(id) {
        return this.utilisateursService.remove(id);
    }
};
exports.UtilisateursController = UtilisateursController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UtilisateursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UtilisateursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_utilisateur_dto_1.CreateUtilisateurDto]),
    __metadata("design:returntype", void 0)
], UtilisateursController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_utilisateur_dto_1.UpdateUtilisateurDto]),
    __metadata("design:returntype", void 0)
], UtilisateursController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/reinitialiser-mot-de-passe'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_utilisateur_dto_1.ResetMotDePasseDto]),
    __metadata("design:returntype", void 0)
], UtilisateursController.prototype, "resetMotDePasse", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UtilisateursController.prototype, "remove", null);
exports.UtilisateursController = UtilisateursController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Controller)('utilisateurs'),
    __metadata("design:paramtypes", [utilisateurs_service_1.UtilisateursService])
], UtilisateursController);
//# sourceMappingURL=utilisateurs.controller.js.map