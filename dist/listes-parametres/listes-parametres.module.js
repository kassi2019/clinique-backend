"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListesParametresModule = void 0;
const common_1 = require("@nestjs/common");
const listes_parametres_controller_1 = require("./listes-parametres.controller");
const listes_parametres_service_1 = require("./listes-parametres.service");
const parametres_listes_controller_1 = require("./parametres-listes.controller");
let ListesParametresModule = class ListesParametresModule {
};
exports.ListesParametresModule = ListesParametresModule;
exports.ListesParametresModule = ListesParametresModule = __decorate([
    (0, common_1.Module)({
        controllers: [listes_parametres_controller_1.ListesParametresController, parametres_listes_controller_1.ParametresListesController],
        providers: [listes_parametres_service_1.ListesParametresService],
        exports: [listes_parametres_service_1.ListesParametresService],
    })
], ListesParametresModule);
//# sourceMappingURL=listes-parametres.module.js.map