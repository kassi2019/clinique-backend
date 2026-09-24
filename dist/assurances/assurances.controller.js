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
exports.AssurancesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const assurances_service_1 = require("./assurances.service");
let AssurancesController = class AssurancesController {
    constructor(assurancesService) {
        this.assurancesService = assurancesService;
    }
    lister(cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.assurancesService.listerAssurances(Number(cliniqueId));
    }
    facturation(cliniqueId, debut, fin, assuranceId, page, perPage) {
        if (!cliniqueId)
            return { lignes: [], total: 0, parAssurance: [] };
        return this.assurancesService.facturation(Number(cliniqueId), {
            debut,
            fin,
            assuranceId: assuranceId ? Number(assuranceId) : undefined,
            page: page ? Number(page) : 1,
            perPage: perPage ? Number(perPage) : 20,
        });
    }
    creer(cliniqueId, dto) {
        return this.assurancesService.creerAssurance(Number(cliniqueId), dto);
    }
    importer(cliniqueId, dto) {
        return this.assurancesService.importerAssurances(Number(cliniqueId), dto.lignes ?? []);
    }
    modifier(id, dto) {
        return this.assurancesService.modifierAssurance(id, dto);
    }
    desactiver(id) {
        return this.assurancesService.desactiverAssurance(id);
    }
    creerFormule(dto) {
        return this.assurancesService.creerFormule(Number(dto.assuranceId), dto);
    }
    modifierFormule(id, dto) {
        return this.assurancesService.modifierFormule(id, dto);
    }
    desactiverFormule(id) {
        return this.assurancesService.desactiverFormule(id);
    }
    creerCouverture(dto) {
        return this.assurancesService.creerCouverture(Number(dto.formuleId), dto);
    }
    modifierCouverture(id, dto) {
        return this.assurancesService.modifierCouverture(id, dto);
    }
    desactiverCouverture(id) {
        return this.assurancesService.desactiverCouverture(id);
    }
    assurancesDuPatient(patientId) {
        return this.assurancesService.assurancesDuPatient(patientId);
    }
    ajouterPatientAssurance(patientId, dto) {
        return this.assurancesService.ajouterPatientAssurance(patientId, dto);
    }
    desactiverPatientAssurance(id) {
        return this.assurancesService.desactiverPatientAssurance(id);
    }
};
exports.AssurancesController = AssurancesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "lister", null);
__decorate([
    (0, common_1.Get)('facturation'),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __param(1, (0, common_1.Query)('debut')),
    __param(2, (0, common_1.Query)('fin')),
    __param(3, (0, common_1.Query)('assuranceId')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "facturation", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "creer", null);
__decorate([
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Query)('cliniqueId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "importer", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "modifier", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "desactiver", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('formules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "creerFormule", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('formules/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "modifierFormule", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('formules/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "desactiverFormule", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('couvertures'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "creerCouverture", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('couvertures/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "modifierCouverture", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('couvertures/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "desactiverCouverture", null);
__decorate([
    (0, common_1.Get)('patients/:patientId'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "assurancesDuPatient", null);
__decorate([
    (0, common_1.Post)('patients/:patientId'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "ajouterPatientAssurance", null);
__decorate([
    (0, common_1.Delete)('patients/rattachements/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AssurancesController.prototype, "desactiverPatientAssurance", null);
exports.AssurancesController = AssurancesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('assurances'),
    __metadata("design:paramtypes", [assurances_service_1.AssurancesService])
], AssurancesController);
//# sourceMappingURL=assurances.controller.js.map