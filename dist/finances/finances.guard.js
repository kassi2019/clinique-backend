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
exports.FinancesGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FinancesGuard = class FinancesGuard {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const { user } = context.switchToHttp().getRequest();
        if (!user)
            return false;
        if (user.role === 'ADMINISTRATEUR')
            return true;
        const habilite = await this.prisma.roleModule.count({
            where: { role: { code: user.role }, module: { code: 'FINANCES' } },
        });
        if (!habilite)
            throw new common_1.ForbiddenException('Accès réservé au module Finances.');
        return true;
    }
};
exports.FinancesGuard = FinancesGuard;
exports.FinancesGuard = FinancesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinancesGuard);
//# sourceMappingURL=finances.guard.js.map