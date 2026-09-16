"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccueilModule = void 0;
const common_1 = require("@nestjs/common");
const impression_module_1 = require("../impression/impression.module");
const accueil_controller_1 = require("./accueil.controller");
const accueil_service_1 = require("./accueil.service");
let AccueilModule = class AccueilModule {
};
exports.AccueilModule = AccueilModule;
exports.AccueilModule = AccueilModule = __decorate([
    (0, common_1.Module)({
        imports: [impression_module_1.ImpressionModule],
        controllers: [accueil_controller_1.AccueilController],
        providers: [accueil_service_1.AccueilService],
    })
], AccueilModule);
//# sourceMappingURL=accueil.module.js.map