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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AjouterPrestationDto = exports.AnnulerPaiementDto = exports.EncaisserDto = exports.MODES_PAIEMENT = void 0;
const class_validator_1 = require("class-validator");
exports.MODES_PAIEMENT = ['ESPECES', 'MOBILE_MONEY', 'CARTE'];
class EncaisserDto {
}
exports.EncaisserDto = EncaisserDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], EncaisserDto.prototype, "lignesIds", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.MODES_PAIEMENT),
    __metadata("design:type", String)
], EncaisserDto.prototype, "modePaiement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], EncaisserDto.prototype, "tauxApplique", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncaisserDto.prototype, "motifTaux", void 0);
class AnnulerPaiementDto {
}
exports.AnnulerPaiementDto = AnnulerPaiementDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnnulerPaiementDto.prototype, "motif", void 0);
class AjouterPrestationDto {
}
exports.AjouterPrestationDto = AjouterPrestationDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AjouterPrestationDto.prototype, "prestationId", void 0);
//# sourceMappingURL=encaisser.dto.js.map