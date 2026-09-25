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
exports.ListesParametresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ListesParametresService = class ListesParametresService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    delegate(code) {
        switch (code) {
            case 'NATIONALITE': return this.prisma.nationalite;
            case 'RESIDENCE': return this.prisma.residence;
            case 'DIAGNOSTIC': return this.prisma.diagnostic;
            case 'PATHOLOGIE': return this.prisma.pathologie;
            case 'FOURNISSEUR': return this.prisma.fournisseur;
            case 'FONCTION': return this.prisma.fonction;
            case 'POSOLOGIE': return this.prisma.posologie;
            case 'PROFESSION': return this.prisma.profession;
            case 'MOTIF': return this.prisma.motifConsultation;
            case 'QUARTIER': return this.prisma.quartier;
            default: throw new common_1.BadRequestException(`Code de liste inconnu : ${code}`);
        }
    }
    async findAll(cliniqueId, code, tous = false, page, perPage) {
        const d = this.delegate(code ?? 'NATIONALITE');
        const where = {
            cliniqueId,
            ...(tous ? {} : { actif: true }),
        };
        if (page && perPage) {
            const [data, total] = await Promise.all([
                d.findMany({
                    where,
                    orderBy: [{ actif: 'desc' }, { libelle: 'asc' }],
                    skip: (page - 1) * perPage,
                    take: perPage,
                }),
                d.count({ where }),
            ]);
            return {
                data,
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage),
            };
        }
        return d.findMany({
            where,
            orderBy: [{ actif: 'desc' }, { libelle: 'asc' }],
        });
    }
    async creer(cliniqueId, code, libelle) {
        const l = libelle.trim();
        if (!l)
            throw new common_1.BadRequestException('Libellé obligatoire.');
        const d = this.delegate(code);
        return d.upsert({
            where: { cliniqueId_libelle: { cliniqueId, libelle: l } },
            update: { actif: true },
            create: { cliniqueId, libelle: l },
        });
    }
    async importer(cliniqueId, code, libelles) {
        if (!Array.isArray(libelles) || libelles.length === 0) {
            throw new common_1.BadRequestException('Aucune ligne à importer.');
        }
        const d = this.delegate(code);
        const propres = [...new Set(libelles.map((l) => String(l).trim()).filter(Boolean))];
        let ajoutes = 0;
        for (const libelle of propres) {
            const existe = await d.findUnique({
                where: { cliniqueId_libelle: { cliniqueId, libelle } },
            });
            if (!existe) {
                await d.create({ data: { cliniqueId, libelle } });
                ajoutes++;
            }
        }
        return { ajoutes, total: propres.length };
    }
    async modifier(id, code, libelle) {
        const l = libelle.trim();
        if (!l)
            throw new common_1.BadRequestException('Libellé obligatoire.');
        const d = this.delegate(code);
        const entree = await d.findUnique({ where: { id } });
        if (!entree)
            throw new common_1.NotFoundException('Entrée introuvable.');
        return d.update({ where: { id }, data: { libelle: l } });
    }
    async desactiver(id, code) {
        const d = this.delegate(code);
        const entree = await d.findUnique({ where: { id } });
        if (!entree)
            throw new common_1.NotFoundException('Entrée introuvable.');
        return d.update({ where: { id }, data: { actif: !entree.actif } });
    }
};
exports.ListesParametresService = ListesParametresService;
exports.ListesParametresService = ListesParametresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListesParametresService);
//# sourceMappingURL=listes-parametres.service.js.map