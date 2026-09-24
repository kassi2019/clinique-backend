"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacieModule = void 0;
const common_1 = require("@nestjs/common");
const impression_module_1 = require("../impression/impression.module");
const pharmacie_controller_1 = require("./pharmacie.controller");
const pharmacie_service_1 = require("./pharmacie.service");
const taches_seuils_service_1 = require("./taches-seuils.service");
let PharmacieModule = class PharmacieModule {
};
exports.PharmacieModule = PharmacieModule;
exports.PharmacieModule = PharmacieModule = __decorate([
    (0, common_1.Module)({
        imports: [impression_module_1.ImpressionModule],
        controllers: [pharmacie_controller_1.PharmacieController],
        providers: [pharmacie_service_1.PharmacieService, taches_seuils_service_1.TachesSeuilsService],
        exports: [pharmacie_service_1.PharmacieService],
    })
], PharmacieModule);
//# sourceMappingURL=pharmacie.module.js.map