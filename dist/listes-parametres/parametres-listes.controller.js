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
exports.ParametresListesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const listes_parametres_service_1 = require("./listes-parametres.service");
let ParametresListesController = class ParametresListesController {
    constructor(listes) {
        this.listes = listes;
    }
    fonctions(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'FONCTION', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerFonction(b) {
        return this.listes.creer(Number(b.cliniqueId), 'FONCTION', b.libelle);
    }
    modifierFonction(id, b) {
        return this.listes.modifier(id, 'FONCTION', b.libelle ?? '');
    }
    basculerFonction(id) {
        return this.listes.desactiver(id, 'FONCTION');
    }
    posologies(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'POSOLOGIE', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerPosologie(b) {
        return this.listes.creer(Number(b.cliniqueId), 'POSOLOGIE', b.libelle);
    }
    modifierPosologie(id, b) {
        return this.listes.modifier(id, 'POSOLOGIE', b.libelle ?? '');
    }
    basculerPosologie(id) {
        return this.listes.desactiver(id, 'POSOLOGIE');
    }
    diagnostics(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'DIAGNOSTIC', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerDiagnostic(b) {
        return this.listes.creer(Number(b.cliniqueId), 'DIAGNOSTIC', b.libelle);
    }
    modifierDiagnostic(id, b) {
        return this.listes.modifier(id, 'DIAGNOSTIC', b.libelle ?? '');
    }
    basculerDiagnostic(id) {
        return this.listes.desactiver(id, 'DIAGNOSTIC');
    }
    pathologies(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'PATHOLOGIE', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerPathologie(b) {
        return this.listes.creer(Number(b.cliniqueId), 'PATHOLOGIE', b.libelle);
    }
    modifierPathologie(id, b) {
        return this.listes.modifier(id, 'PATHOLOGIE', b.libelle ?? '');
    }
    basculerPathologie(id) {
        return this.listes.desactiver(id, 'PATHOLOGIE');
    }
    nationalites(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'NATIONALITE', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerNationalite(b) {
        return this.listes.creer(Number(b.cliniqueId), 'NATIONALITE', b.libelle);
    }
    modifierNationalite(id, b) {
        return this.listes.modifier(id, 'NATIONALITE', b.libelle ?? '');
    }
    basculerNationalite(id) {
        return this.listes.desactiver(id, 'NATIONALITE');
    }
    residences(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'RESIDENCE', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerResidence(b) {
        return this.listes.creer(Number(b.cliniqueId), 'RESIDENCE', b.libelle);
    }
    modifierResidence(id, b) {
        return this.listes.modifier(id, 'RESIDENCE', b.libelle ?? '');
    }
    basculerResidence(id) {
        return this.listes.desactiver(id, 'RESIDENCE');
    }
    fournisseurs(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'FOURNISSEUR', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerFournisseur(b) {
        return this.listes.creer(Number(b.cliniqueId), 'FOURNISSEUR', b.libelle);
    }
    modifierFournisseur(id, b) {
        return this.listes.modifier(id, 'FOURNISSEUR', b.libelle ?? '');
    }
    basculerFournisseur(id) {
        return this.listes.desactiver(id, 'FOURNISSEUR');
    }
    professions(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'PROFESSION', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerProfession(b) {
        return this.listes.creer(Number(b.cliniqueId), 'PROFESSION', b.libelle);
    }
    modifierProfession(id, b) {
        return this.listes.modifier(id, 'PROFESSION', b.libelle ?? '');
    }
    basculerProfession(id) {
        return this.listes.desactiver(id, 'PROFESSION');
    }
    motifs(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'MOTIF', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerMotif(b) {
        return this.listes.creer(Number(b.cliniqueId), 'MOTIF', b.libelle);
    }
    modifierMotif(id, b) {
        return this.listes.modifier(id, 'MOTIF', b.libelle ?? '');
    }
    basculerMotif(id) {
        return this.listes.desactiver(id, 'MOTIF');
    }
    quartiers(cliniqueId, tous, page, perPage) {
        return this.listes.findAll(cliniqueId, 'QUARTIER', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
    }
    creerQuartier(b) {
        return this.listes.creer(Number(b.cliniqueId), 'QUARTIER', b.libelle);
    }
    modifierQuartier(id, b) {
        return this.listes.modifier(id, 'QUARTIER', b.libelle ?? '');
    }
    basculerQuartier(id) {
        return this.listes.desactiver(id, 'QUARTIER');
    }
};
exports.ParametresListesController = ParametresListesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('fonctions'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "fonctions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('fonctions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerFonction", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('fonctions/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierFonction", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('fonctions/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerFonction", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('posologies'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "posologies", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('posologies'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerPosologie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('posologies/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierPosologie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('posologies/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerPosologie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('diagnostics'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "diagnostics", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('diagnostics'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerDiagnostic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('diagnostics/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierDiagnostic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('diagnostics/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerDiagnostic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('pathologies'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "pathologies", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('pathologies'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerPathologie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('pathologies/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierPathologie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('pathologies/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerPathologie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('nationalites'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "nationalites", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('nationalites'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerNationalite", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('nationalites/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierNationalite", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('nationalites/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerNationalite", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('residences'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "residences", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('residences'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerResidence", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('residences/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierResidence", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('residences/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerResidence", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('fournisseurs'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "fournisseurs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('fournisseurs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerFournisseur", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('fournisseurs/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierFournisseur", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('fournisseurs/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerFournisseur", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('professions'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "professions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('professions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerProfession", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('professions/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierProfession", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('professions/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerProfession", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('motifs'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "motifs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('motifs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerMotif", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('motifs/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierMotif", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('motifs/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerMotif", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('quartiers'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('tous')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "quartiers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('quartiers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "creerQuartier", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Patch)('quartiers/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "modifierQuartier", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Delete)('quartiers/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParametresListesController.prototype, "basculerQuartier", null);
exports.ParametresListesController = ParametresListesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [listes_parametres_service_1.ListesParametresService])
], ParametresListesController);
//# sourceMappingURL=parametres-listes.controller.js.map