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
exports.OngletGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../prisma/prisma.service");
const onglet_decorator_1 = require("./onglet.decorator");
const onglets_1 = require("./onglets");
let OngletGuard = class OngletGuard {
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const onglets = this.reflector.getAllAndOverride(onglet_decorator_1.ONGLET_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!onglets?.length)
            return true;
        const { user } = context.switchToHttp().getRequest();
        if (!user)
            return false;
        if (user.role === 'ADMINISTRATEUR')
            return true;
        const lignes = await this.prisma.utilisateurOnglet.findMany({
            where: { utilisateurId: user.id },
            select: { onglet: true },
        });
        const autorises = lignes.map((l) => l.onglet);
        if (!onglets.some((o) => (0, onglets_1.ongletAutorise)(autorises, o))) {
            throw new common_1.ForbiddenException("Vous n'avez pas accès à cet onglet.");
        }
        return true;
    }
};
exports.OngletGuard = OngletGuard;
exports.OngletGuard = OngletGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], OngletGuard);
//# sourceMappingURL=onglet.guard.js.map