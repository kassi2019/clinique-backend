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
exports.PrestationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function formatPrestation(p) {
    return { ...p, montant: Number(p.montant) };
}
const includeBase = {
    service: { select: { id: true, code: true, nom: true } },
    clinique: { select: { id: true, code: true, nom: true } },
};
let PrestationsService = class PrestationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query.cliniqueId)
            where.cliniqueId = query.cliniqueId;
        if (query.serviceId)
            where.serviceId = query.serviceId;
        if (query.search) {
            where.OR = [
                { code: { contains: query.search } },
                { libelle: { contains: query.search } },
            ];
        }
        const page = Math.max(1, query.page ?? 1);
        const perPage = query.perPage ?? 10;
        const [prestations, total] = await Promise.all([
            this.prisma.prestation.findMany({
                where,
                include: includeBase,
                orderBy: { libelle: 'asc' },
                ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
            }),
            this.prisma.prestation.count({ where }),
        ]);
        return {
            data: prestations.map(formatPrestation),
            total,
            page,
            perPage: perPage > 0 ? perPage : total,
            totalPages: perPage > 0 ? Math.ceil(total / perPage) : 1,
        };
    }
    async findOne(id) {
        const prestation = await this.prisma.prestation.findUnique({
            where: { id },
            include: includeBase,
        });
        if (!prestation)
            throw new common_1.NotFoundException('Prestation introuvable.');
        return formatPrestation(prestation);
    }
    async create(dto) {
        try {
            const prestation = await this.prisma.prestation.create({
                data: dto,
                include: includeBase,
            });
            return formatPrestation(prestation);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce code de prestation existe déjà pour cette clinique.');
            }
            throw e;
        }
    }
    async update(id, dto) {
        await this.findOne(id);
        try {
            const prestation = await this.prisma.prestation.update({
                where: { id },
                data: dto,
                include: includeBase,
            });
            return formatPrestation(prestation);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce code de prestation existe déjà pour cette clinique.');
            }
            throw e;
        }
    }
    async remove(id) {
        await this.findOne(id);
        const prestation = await this.prisma.prestation.update({
            where: { id },
            data: { actif: false },
            include: includeBase,
        });
        return formatPrestation(prestation);
    }
};
exports.PrestationsService = PrestationsService;
exports.PrestationsService = PrestationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrestationsService);
//# sourceMappingURL=prestations.service.js.map