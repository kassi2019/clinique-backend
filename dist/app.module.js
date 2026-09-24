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
const schedule_1 = require("@nestjs/schedule");
const accueil_module_1 = require("./accueil/accueil.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const caisse_module_1 = require("./caisse/caisse.module");
const consultations_module_1 = require("./consultations/consultations.module");
const medicaments_module_1 = require("./medicaments/medicaments.module");
const pharmacie_module_1 = require("./pharmacie/pharmacie.module");
const auth_module_1 = require("./auth/auth.module");
const assurances_module_1 = require("./assurances/assurances.module");
const cliniques_module_1 = require("./cliniques/cliniques.module");
const impression_module_1 = require("./impression/impression.module");
const imagerie_module_1 = require("./imagerie/imagerie.module");
const hospitalisation_module_1 = require("./hospitalisation/hospitalisation.module");
const laboratoire_module_1 = require("./laboratoire/laboratoire.module");
const modules_module_1 = require("./modules/modules.module");
const parametres_module_1 = require("./parametres/parametres.module");
const personnel_module_1 = require("./personnel/personnel.module");
const prestations_module_1 = require("./prestations/prestations.module");
const prisma_module_1 = require("./prisma/prisma.module");
const roles_module_1 = require("./roles/roles.module");
const services_module_1 = require("./services/services.module");
const statistiques_module_1 = require("./statistiques/statistiques.module");
const utilisateurs_module_1 = require("./utilisateurs/utilisateurs.module");
const listes_parametres_module_1 = require("./listes-parametres/listes-parametres.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            assurances_module_1.AssurancesModule,
            accueil_module_1.AccueilModule,
            caisse_module_1.CaisseModule,
            consultations_module_1.ConsultationsModule,
            medicaments_module_1.MedicamentsModule,
            pharmacie_module_1.PharmacieModule,
            laboratoire_module_1.LaboratoireModule,
            imagerie_module_1.ImagerieModule,
            hospitalisation_module_1.HospitalisationModule,
            cliniques_module_1.CliniquesModule,
            services_module_1.ServicesModule,
            personnel_module_1.PersonnelModule,
            utilisateurs_module_1.UtilisateursModule,
            roles_module_1.RolesModule,
            modules_module_1.ModulesModule,
            prestations_module_1.PrestationsModule,
            parametres_module_1.ParametresModule,
            impression_module_1.ImpressionModule,
            statistiques_module_1.StatistiquesModule,
            listes_parametres_module_1.ListesParametresModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map