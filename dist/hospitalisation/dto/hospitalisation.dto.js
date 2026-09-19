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
exports.SortieDto = exports.MOTIFS_SORTIE = exports.SuiviDto = exports.AdmissionDto = exports.CreerLitDto = exports.CreerTypeChambreDto = exports.CreerChambreDto = void 0;
const class_validator_1 = require("class-validator");
class CreerChambreDto {
}
exports.CreerChambreDto = CreerChambreDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreerChambreDto.prototype, "numero", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreerChambreDto.prototype, "typeChambreId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreerChambreDto.prototype, "tarifJournalier", void 0);
class CreerTypeChambreDto {
}
exports.CreerTypeChambreDto = CreerTypeChambreDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreerTypeChambreDto.prototype, "libelle", void 0);
class CreerLitDto {
}
exports.CreerLitDto = CreerLitDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreerLitDto.prototype, "numero", void 0);
class AdmissionDto {
}
exports.AdmissionDto = AdmissionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AdmissionDto.prototype, "litId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionDto.prototype, "dateEntree", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionDto.prototype, "motif", void 0);
class SuiviDto {
}
exports.SuiviDto = SuiviDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SuiviDto.prototype, "observations", void 0);
exports.MOTIFS_SORTIE = ['EXEAT', 'TRANSFERT', 'DECES', 'AUTRE'];
class SortieDto {
}
exports.SortieDto = SortieDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SortieDto.prototype, "dateSortie", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.MOTIFS_SORTIE),
    __metadata("design:type", String)
], SortieDto.prototype, "sortieMotif", void 0);
//# sourceMappingURL=hospitalisation.dto.js.map