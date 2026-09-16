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
exports.UtilisateursService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../prisma/prisma.service");
const includeBase = {
    personnel: {
        select: {
            id: true,
            matricule: true,
            nom: true,
            prenom: true,
            fonction: true,
            statut: true,
            service: { select: { id: true, nom: true } },
        },
    },
    role: { select: { id: true, code: true, nom: true } },
};
let UtilisateursService = class UtilisateursService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query = {}) {
        const page = Math.max(1, query.page ?? 1);
        const perPage = query.perPage ?? 10;
        const [data, total] = await Promise.all([
            this.prisma.utilisateur.findMany({
                include: includeBase,
                orderBy: { matricule: 'asc' },
                ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
            }),
            this.prisma.utilisateur.count(),
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
        const utilisateur = await this.prisma.utilisateur.findUnique({
            where: { id },
            include: includeBase,
        });
        if (!utilisateur)
            throw new common_1.NotFoundException('Utilisateur introuvable.');
        return utilisateur;
    }
    async create(dto) {
        const personnel = await this.prisma.personnel.findUnique({
            where: { id: dto.personnelId },
        });
        if (!personnel) {
            throw new common_1.BadRequestException('Fiche Personnel introuvable.');
        }
        const existant = await this.prisma.utilisateur.findUnique({
            where: { personnelId: dto.personnelId },
        });
        if (existant) {
            throw new common_1.ConflictException('Un compte utilisateur existe déjà pour ce personnel.');
        }
        const motDePasse = await bcrypt.hash(dto.motDePasse, 10);
        try {
            return await this.prisma.utilisateur.create({
                data: { ...dto, motDePasse },
                include: includeBase,
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce matricule de connexion existe déjà.');
            }
            throw e;
        }
    }
    async update(id, dto) {
        await this.findOne(id);
        try {
            return await this.prisma.utilisateur.update({
                where: { id },
                data: dto,
                include: includeBase,
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Ce matricule de connexion existe déjà.');
            }
            throw e;
        }
    }
    async resetMotDePasse(id, motDePasse) {
        await this.findOne(id);
        const hash = await bcrypt.hash(motDePasse, 10);
        return this.prisma.utilisateur.update({
            where: { id },
            data: { motDePasse: hash },
            include: includeBase,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.utilisateur.update({
            where: { id },
            data: { statut: 'SUSPENDU' },
            include: includeBase,
        });
    }
};
exports.UtilisateursService = UtilisateursService;
exports.UtilisateursService = UtilisateursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UtilisateursService);
//# sourceMappingURL=utilisateurs.service.js.map