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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../prisma/prisma.service");
const includeUtilisateur = {
    personnel: { include: { service: true, clinique: true } },
    role: { include: { habilitations: { include: { module: true } } } },
};
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    buildUser(u) {
        return {
            id: u.id,
            matricule: u.matricule,
            role: {
                code: u.role.code,
                nom: u.role.nom,
                modules: u.role.habilitations.map((h) => ({
                    code: h.module.code,
                    nom: h.module.nom,
                    lecture: h.lecture,
                    ecriture: h.ecriture,
                    validation: h.validation,
                })),
            },
            personnel: {
                id: u.personnel.id,
                matricule: u.personnel.matricule,
                nom: u.personnel.nom,
                prenom: u.personnel.prenom,
                photo: u.personnel.photo,
                fonction: u.personnel.fonction,
                service: u.personnel.service
                    ? { nom: u.personnel.service.nom, code: u.personnel.service.code }
                    : null,
            },
            clinique: {
                id: u.personnel.clinique.id,
                code: u.personnel.clinique.code,
                nom: u.personnel.clinique.nom,
            },
        };
    }
    async login(matricule, motDePasse) {
        const utilisateur = await this.prisma.utilisateur.findUnique({
            where: { matricule },
            include: includeUtilisateur,
        });
        if (!utilisateur || utilisateur.statut !== 'ACTIF') {
            throw new common_1.UnauthorizedException('Matricule ou mot de passe incorrect.');
        }
        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
        if (!motDePasseValide) {
            throw new common_1.UnauthorizedException('Matricule ou mot de passe incorrect.');
        }
        await this.prisma.utilisateur.update({
            where: { id: utilisateur.id },
            data: { derniereConnexion: new Date() },
        });
        const payload = {
            sub: utilisateur.id,
            matricule: utilisateur.matricule,
            role: utilisateur.role.code,
        };
        return {
            access_token: await this.jwt.signAsync(payload),
            user: this.buildUser(utilisateur),
        };
    }
    async me(userId) {
        const utilisateur = await this.prisma.utilisateur.findUnique({
            where: { id: userId },
            include: includeUtilisateur,
        });
        if (!utilisateur) {
            throw new common_1.UnauthorizedException('Utilisateur introuvable.');
        }
        return this.buildUser(utilisateur);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map