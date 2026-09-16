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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const includeHabilitations = {
    habilitations: {
        include: { module: true },
        orderBy: { module: { nom: 'asc' } },
    },
};
let RolesService = class RolesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query = {}) {
        const page = Math.max(1, query.page ?? 1);
        const perPage = query.perPage ?? 10;
        const [data, total] = await Promise.all([
            this.prisma.role.findMany({
                include: includeHabilitations,
                orderBy: { nom: 'asc' },
                ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
            }),
            this.prisma.role.count(),
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
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: includeHabilitations,
        });
        if (!role)
            throw new common_1.NotFoundException('Rôle introuvable.');
        return role;
    }
    async create(dto) {
        try {
            return await this.prisma.role.create({
                data: {
                    code: dto.code,
                    nom: dto.nom,
                    description: dto.description,
                    habilitations: dto.habilitations?.length
                        ? {
                            create: dto.habilitations.map((h) => ({
                                moduleId: h.moduleId,
                                lecture: h.lecture ?? true,
                                ecriture: h.ecriture ?? true,
                                validation: h.validation ?? false,
                            })),
                        }
                        : undefined,
                },
                include: includeHabilitations,
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce code de rôle existe déjà.');
            }
            throw e;
        }
    }
    async update(id, dto) {
        await this.findOne(id);
        try {
            if (dto.habilitations) {
                await this.prisma.roleModule.deleteMany({ where: { roleId: id } });
            }
            return await this.prisma.role.update({
                where: { id },
                data: {
                    code: dto.code,
                    nom: dto.nom,
                    description: dto.description,
                    habilitations: dto.habilitations?.length
                        ? {
                            create: dto.habilitations.map((h) => ({
                                moduleId: h.moduleId,
                                lecture: h.lecture ?? true,
                                ecriture: h.ecriture ?? true,
                                validation: h.validation ?? false,
                            })),
                        }
                        : undefined,
                },
                include: includeHabilitations,
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce code de rôle existe déjà.');
            }
            throw e;
        }
    }
    async remove(id) {
        await this.findOne(id);
        const utilisateurs = await this.prisma.utilisateur.count({
            where: { roleId: id },
        });
        if (utilisateurs > 0) {
            throw new common_1.ConflictException(`Impossible de supprimer ce rôle : ${utilisateurs} utilisateur(s) y sont rattachés.`);
        }
        return this.prisma.role.delete({ where: { id } });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map