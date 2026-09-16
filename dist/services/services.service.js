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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query = {}) {
        const where = query.cliniqueId ? { cliniqueId: query.cliniqueId } : undefined;
        const page = Math.max(1, query.page ?? 1);
        const perPage = query.perPage ?? 10;
        const [data, total] = await Promise.all([
            this.prisma.service.findMany({
                where,
                include: { clinique: { select: { id: true, code: true, nom: true } } },
                orderBy: { nom: 'asc' },
                ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
            }),
            this.prisma.service.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            perPage: perPage > 0 ? perPage : total,
            totalPages: perPage > 0 ? Math.ceil(total / perPage) : 1,
        };
    }
    async findOne(id) {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: { clinique: { select: { id: true, code: true, nom: true } } },
        });
        if (!service)
            throw new common_1.NotFoundException('Service introuvable.');
        return service;
    }
    async create(dto) {
        try {
            return await this.prisma.service.create({ data: dto });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce code de service existe déjà pour cette clinique.');
            }
            throw e;
        }
    }
    async update(id, dto) {
        await this.findOne(id);
        try {
            return await this.prisma.service.update({ where: { id }, data: dto });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce code de service existe déjà pour cette clinique.');
            }
            throw e;
        }
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.service.update({
            where: { id },
            data: { actif: false },
        });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map