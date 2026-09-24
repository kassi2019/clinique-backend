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
var TachesSeuilsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TachesSeuilsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const pharmacie_service_1 = require("./pharmacie.service");
let TachesSeuilsService = TachesSeuilsService_1 = class TachesSeuilsService {
    constructor(prisma, pharmacie) {
        this.prisma = prisma;
        this.pharmacie = pharmacie;
        this.logger = new common_1.Logger(TachesSeuilsService_1.name);
    }
    async recalculerSeuilsQuotidien() {
        try {
            const cliniques = await this.prisma.clinique.findMany({
                where: { statut: 'ACTIF' },
                select: { id: true },
            });
            let total = 0;
            for (const c of cliniques) {
                const r = await this.pharmacie.recalculerTousSeuils(c.id);
                total += r.recalcules;
            }
            this.logger.log(`Seuils automatiques recalculés : ${total} médicament(s) sur ${cliniques.length} clinique(s).`);
        }
        catch (e) {
            this.logger.error(`Échec du recalcul des seuils : ${e.message}`);
        }
    }
};
exports.TachesSeuilsService = TachesSeuilsService;
__decorate([
    (0, schedule_1.Cron)('0 3 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TachesSeuilsService.prototype, "recalculerSeuilsQuotidien", null);
exports.TachesSeuilsService = TachesSeuilsService = TachesSeuilsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pharmacie_service_1.PharmacieService])
], TachesSeuilsService);
//# sourceMappingURL=taches-seuils.service.js.map