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
exports.PersonnelController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const create_personnel_dto_1 = require("./dto/create-personnel.dto");
const update_personnel_dto_1 = require("./dto/update-personnel.dto");
const personnel_service_1 = require("./personnel.service");
let PersonnelController = class PersonnelController {
    constructor(personnelService) {
        this.personnelService = personnelService;
    }
    findAll(search, statut, cliniqueId, page, perPage) {
        return this.personnelService.findAll({
            search,
            statut,
            cliniqueId: cliniqueId ? Number(cliniqueId) : undefined,
            page: page ? Number(page) : undefined,
            perPage: perPage !== undefined ? Number(perPage) : undefined,
        });
    }
    findOne(id) {
        return this.personnelService.findOne(id);
    }
    create(dto) {
        return this.personnelService.create(dto);
    }
    update(id, dto) {
        return this.personnelService.update(id, dto);
    }
    remove(id) {
        return this.personnelService.remove(id);
    }
};
exports.PersonnelController = PersonnelController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('statut')),
    __param(2, (0, common_1.Query)('cliniqueId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_personnel_dto_1.CreatePersonnelDto]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_personnel_dto_1.UpdatePersonnelDto]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "remove", null);
exports.PersonnelController = PersonnelController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Controller)('personnel'),
    __metadata("design:paramtypes", [personnel_service_1.PersonnelService])
], PersonnelController);
//# sourceMappingURL=personnel.controller.js.map