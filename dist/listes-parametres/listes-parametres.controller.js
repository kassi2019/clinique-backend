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
exports.ListesParametresController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const listes_parametres_service_1 = require("./listes-parametres.service");
let ListesParametresController = class ListesParametresController {
    constructor(listesService) {
        this.listesService = listesService;
    }
    findAll(cliniqueId, code, tous, page, perPage) {
        return this.listesService.findAll(cliniqueId, code, tous === '1' || tous === 'true', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creer(body) {
        return this.listesService.creer(Number(body.cliniqueId), body.code, body.libelle);
    }
    importer(body) {
        return this.listesService.importer(Number(body.cliniqueId), body.code, body.libelles ?? []);
    }
    modifier(id, code, body) {
        return this.listesService.modifier(id, code ?? 'NATIONALITE', body.libelle ?? '');
    }
    desactiver(id, code) {
        return this.listesService.desactiver(id, code ?? 'NATIONALITE');
    }
};
exports.ListesParametresController = ListesParametresController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Query)('tous')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ListesParametresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListesParametresController.prototype, "creer", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListesParametresController.prototype, "importer", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], ListesParametresController.prototype, "modifier", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ListesParametresController.prototype, "desactiver", null);
exports.ListesParametresController = ListesParametresController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('listes-parametres'),
    __metadata("design:paramtypes", [listes_parametres_service_1.ListesParametresService])
], ListesParametresController);
//# sourceMappingURL=listes-parametres.controller.js.map