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
exports.ParametresController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const update_parametre_dto_1 = require("./dto/update-parametre.dto");
const parametres_service_1 = require("./parametres.service");
let ParametresController = class ParametresController {
    constructor(parametresService) {
        this.parametresService = parametresService;
    }
    findOne(cliniqueId) {
        return this.parametresService.getOrCreate(cliniqueId);
    }
    update(cliniqueId, dto) {
        return this.parametresService.update(cliniqueId, dto);
    }
};
exports.ParametresController = ParametresController;
__decorate([
    (0, common_1.Get)(':cliniqueId'),
    __param(0, (0, common_1.Param)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':cliniqueId'),
    __param(0, (0, common_1.Param)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_parametre_dto_1.UpdateParametreDto]),
    __metadata("design:returntype", void 0)
], ParametresController.prototype, "update", null);
exports.ParametresController = ParametresController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Controller)('parametres'),
    __metadata("design:paramtypes", [parametres_service_1.ParametresService])
], ParametresController);
//# sourceMappingURL=parametres.controller.js.map