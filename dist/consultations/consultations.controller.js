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
exports.ConsultationsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const consultations_service_1 = require("./consultations.service");
const consultation_dto_1 = require("./dto/consultation.dto");
let ConsultationsController = class ConsultationsController {
    constructor(consultationsService) {
        this.consultationsService = consultationsService;
    }
    rechercher(code, cliniqueId) {
        if (!cliniqueId)
            return [];
        return this.consultationsService.rechercher(code ?? '', cliniqueId);
    }
    detail(id) {
        return this.consultationsService.detailPassage(id);
    }
    creerOuMaj(id, dto, req) {
        return this.consultationsService.creerOuMaj(id, req.user.id, dto);
    }
    ajouterMedicament(id, dto) {
        return this.consultationsService.ajouterMedicament(id, dto);
    }
    retirerMedicament(id) {
        return this.consultationsService.retirerMedicament(id);
    }
    prescrireExamens(id, dto) {
        return this.consultationsService.prescrireExamens(id, dto.lignesIds);
    }
    retirerExamen(id) {
        return this.consultationsService.retirerExamen(id);
    }
    sauvegarderOrdonnance(id) {
        return this.consultationsService.sauvegarderOrdonnance(id);
    }
    valider(id) {
        return this.consultationsService.valider(id);
    }
};
exports.ConsultationsController = ConsultationsController;
__decorate([
    (0, common_1.Get)('recherche'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('cliniqueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "rechercher", null);
__decorate([
    (0, common_1.Get)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)('passages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, consultation_dto_1.CreerConsultationDto, Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "creerOuMaj", null);
__decorate([
    (0, common_1.Post)(':id/medicaments'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, consultation_dto_1.PrescriptionDto]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "ajouterMedicament", null);
__decorate([
    (0, common_1.Delete)('medicaments/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "retirerMedicament", null);
__decorate([
    (0, common_1.Post)(':id/examens'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, consultation_dto_1.PrescrireExamensDto]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "prescrireExamens", null);
__decorate([
    (0, common_1.Delete)('examens/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "retirerExamen", null);
__decorate([
    (0, common_1.Post)(':id/ordonnance-sauvegarder'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "sauvegarderOrdonnance", null);
__decorate([
    (0, common_1.Post)(':id/valider'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "valider", null);
exports.ConsultationsController = ConsultationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('consultations'),
    __metadata("design:paramtypes", [consultations_service_1.ConsultationsService])
], ConsultationsController);
//# sourceMappingURL=consultations.controller.js.map