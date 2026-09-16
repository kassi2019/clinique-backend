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
exports.PersonnelService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const includeUtilisateur = {
    utilisateur: {
        select: {
            id: true,
            matricule: true,
            statut: true,
            role: { select: { code: true, nom: true } },
        },
    },
};
const includeBase = {
    service: true,
    clinique: { select: { id: true, code: true, nom: true } },
    ...includeUtilisateur,
};
let PersonnelService = class PersonnelService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query.statut)
            where.statut = query.statut;
        if (query.cliniqueId)
            where.cliniqueId = Number(query.cliniqueId);
        if (query.search) {
            where.OR = [
                { nom: { contains: query.search } },
                { prenom: { contains: query.search } },
                { matricule: { contains: query.search } },
            ];
        }
        const page = Math.max(1, query.page ?? 1);
        const perPage = query.perPage ?? 10;
        const [data, total] = await Promise.all([
            this.prisma.personnel.findMany({
                where,
                include: includeBase,
                orderBy: [{ nom: 'asc' }, { prenom: 'asc' }],
                ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
            }),
            this.prisma.personnel.count({ where }),
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
        const personnel = await this.prisma.personnel.findUnique({
            where: { id },
            include: includeBase,
        });
        if (!personnel)
            throw new common_1.NotFoundException('Personnel introuvable.');
        return personnel;
    }
    async create(dto) {
        try {
            return await this.prisma.personnel.create({
                data: {
                    ...dto,
                    dateEmbauche: dto.dateEmbauche ? new Date(dto.dateEmbauche) : undefined,
                },
                include: includeBase,
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce matricule existe déjà pour cette clinique.');
            }
            throw e;
        }
    }
    async update(id, dto) {
        await this.findOne(id);
        try {
            return await this.prisma.personnel.update({
                where: { id },
                data: {
                    ...dto,
                    dateEmbauche: dto.dateEmbauche ? new Date(dto.dateEmbauche) : undefined,
                },
                include: includeBase,
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce matricule existe déjà pour cette clinique.');
            }
            throw e;
        }
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.personnel.update({
            where: { id },
            data: { statut: 'INACTIF' },
            include: includeBase,
        });
    }
};
exports.PersonnelService = PersonnelService;
exports.PersonnelService = PersonnelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PersonnelService);
//# sourceMappingURL=personnel.service.js.map