"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const accueil_module_1 = require("./accueil/accueil.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const cliniques_module_1 = require("./cliniques/cliniques.module");
const impression_module_1 = require("./impression/impression.module");
const modules_module_1 = require("./modules/modules.module");
const parametres_module_1 = require("./parametres/parametres.module");
const personnel_module_1 = require("./personnel/personnel.module");
const prestations_module_1 = require("./prestations/prestations.module");
const prisma_module_1 = require("./prisma/prisma.module");
const roles_module_1 = require("./roles/roles.module");
const services_module_1 = require("./services/services.module");
const utilisateurs_module_1 = require("./utilisateurs/utilisateurs.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            accueil_module_1.AccueilModule,
            cliniques_module_1.CliniquesModule,
            services_module_1.ServicesModule,
            personnel_module_1.PersonnelModule,
            utilisateurs_module_1.UtilisateursModule,
            roles_module_1.RolesModule,
            modules_module_1.ModulesModule,
            prestations_module_1.PrestationsModule,
            parametres_module_1.ParametresModule,
            impression_module_1.ImpressionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map