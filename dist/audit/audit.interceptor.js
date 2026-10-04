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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditInterceptor = class AuditInterceptor {
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const methode = req?.method;
        const user = req?.user;
        const route = (req?.originalUrl ?? '').split('?')[0];
        if (!user ||
            !['POST', 'PATCH', 'PUT', 'DELETE'].includes(methode) ||
            !route.startsWith('/api/') ||
            route.startsWith('/api/auth') ||
            route.startsWith('/api/journal')) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)(async () => {
            try {
                const corps = { ...(req.body ?? {}) };
                delete corps.motDePasse;
                let details = null;
                try {
                    details = JSON.stringify(corps).slice(0, 4000);
                }
                catch {
                    details = null;
                }
                const segments = route.split('/').filter(Boolean);
                const matchId = route.match(/\/([a-z-]+)\/(\d+)/);
                await this.prisma.journalAction.create({
                    data: {
                        cliniqueId: user?.clinique?.id ?? null,
                        utilisateurId: user?.id ?? null,
                        methode,
                        route: route.slice(0, 300),
                        entite: segments[1] ?? null,
                        entiteId: matchId ? matchId[2] : corps?.id ? String(corps.id) : null,
                        details,
                    },
                });
            }
            catch {
            }
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map