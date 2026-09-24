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
exports.PharmacieController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const pharmacie_service_1 = require("./pharmacie.service");
let PharmacieController = class PharmacieController {
    constructor(pharmacieService) {
        this.pharmacieService = pharmacieService;
    }
    rechercherOrdonnances(code, cliniqueId, medecinId, statut, debut, fin) {
        if (!cliniqueId)
            return { liste: true, ordonnances: [] };
        return this.pharmacieService.rechercherOrdonnances(code ?? '', cliniqueId, {
            medecinId: medecinId ? Number(medecinId) : undefined,
            statut,
            debut,
            fin,
        });
    }
    detailOrdonnance(id) {
        return this.pharmacieService.detailOrdonnance(id);
    }
    dispenser(consultationId, dto, req) {
        return this.pharmacieService.dispenser(consultationId, dto.lignes ?? [], req.user.id);
    }
    cloturer(id) {
        return this.pharmacieService.cloturer(id);
    }
    payer(id, dto, req) {
        return this.pharmacieService.payer(id, dto.modePaiement, req.user.id);
    }
    annulerPaiement(id, dto) {
        return this.pharmacieService.annulerPaiement(id, dto.motif);
    }
    stocks(cliniqueId, search) {
        if (!cliniqueId)
            return [];
        return this.pharmacieService.stocks(cliniqueId, search);
    }
    entrerStock(dto, req) {
        return this.pharmacieService.entrerStock(dto, req.user.id);
    }
    inventaire(dto, req) {
        return this.pharmacieService.inventaire(dto, req.user.id);
    }
    inventaireMultiple(dto, req) {
        return this.pharmacieService.inventaireMultiple(dto.lignes ?? [], req.user.id);
    }
    lots(medicamentId) {
        return this.pharmacieService.lots(medicamentId);
    }
    lotsClinique(cliniqueId) {
        return this.pharmacieService.lotsClinique(cliniqueId);
    }
    inventaireLot(id, dto, req) {
        return this.pharmacieService.inventaireLot(id, Number(dto.quantiteReelle) || 0, dto.commentaire, req.user.id);
    }
    mouvements(medicamentId) {
        return this.pharmacieService.mouvements(medicamentId);
    }
    alertes(cliniqueId) {
        if (!cliniqueId)
            return { stockBas: [], peremptions: [] };
        return this.pharmacieService.alertes(cliniqueId);
    }
    recalculerSeuils(cliniqueId) {
        return this.pharmacieService.recalculerTousSeuils(cliniqueId);
    }
    consommables(cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.pharmacieService.consommables(cliniqueId);
    }
    creerConsommable(dto) {
        return this.pharmacieService.creerConsommable(dto);
    }
    majConsommable(id, dto) {
        return this.pharmacieService.majConsommable(id, dto);
    }
    mouvementConsommable(id, dto, req) {
        return this.pharmacieService.mouvementConsommable(id, dto, req.user.id);
    }
    mouvementsConsommable(id) {
        return this.pharmacieService.mouvementsConsommable(id);
    }
};
exports.PharmacieController = PharmacieController;
__decorate([
    (0, common_1.Get)('ordonnances'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('medecinId')),
    __param(3, (0, common_1.Query)('statut')),
    __param(4, (0, common_1.Query)('debut')),
    __param(5, (0, common_1.Query)('fin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "rechercherOrdonnances", null);
__decorate([
    (0, common_1.Get)('consultations/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "detailOrdonnance", null);
__decorate([
    (0, common_1.Post)('dispensations/:consultationId'),
    __param(0, (0, common_1.Param)('consultationId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "dispenser", null);
__decorate([
    (0, common_1.Post)('dispensations/:id/cloturer'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "cloturer", null);
__decorate([
    (0, common_1.Post)('dispensations/:id/payer'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "payer", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('paiements/:id/annuler'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "annulerPaiement", null);
__decorate([
    (0, common_1.Get)('stocks'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "stocks", null);
__decorate([
    (0, common_1.Post)('entrees'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "entrerStock", null);
__decorate([
    (0, common_1.Post)('inventaire'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "inventaire", null);
__decorate([
    (0, common_1.Post)('lots/inventaire-multiple'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "inventaireMultiple", null);
__decorate([
    (0, common_1.Get)('lots/:medicamentId'),
    __param(0, (0, common_1.Param)('medicamentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "lots", null);
__decorate([
    (0, common_1.Get)('lots'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "lotsClinique", null);
__decorate([
    (0, common_1.Post)('lots/:id/inventaire'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "inventaireLot", null);
__decorate([
    (0, common_1.Get)('mouvements/:medicamentId'),
    __param(0, (0, common_1.Param)('medicamentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "mouvements", null);
__decorate([
    (0, common_1.Get)('alertes'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "alertes", null);
__decorate([
    (0, common_1.Post)('seuils/recalculer'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "recalculerSeuils", null);
__decorate([
    (0, common_1.Get)('consommables'),
    __param(0, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "consommables", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('consommables'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "creerConsommable", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATEUR'),
    (0, common_1.Post)('consommables/:id/maj'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "majConsommable", null);
__decorate([
    (0, common_1.Post)('consommables/:id/mouvement'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "mouvementConsommable", null);
__decorate([
    (0, common_1.Get)('consommables/:id/mouvements'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PharmacieController.prototype, "mouvementsConsommable", null);
exports.PharmacieController = PharmacieController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('pharmacie'),
    __metadata("design:paramtypes", [pharmacie_service_1.PharmacieService])
], PharmacieController);
//# sourceMappingURL=pharmacie.controller.js.map