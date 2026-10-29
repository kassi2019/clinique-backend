import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CODES_ONGLETS } from '../auth/onglets';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

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
  onglets: { select: { onglet: true } },
} satisfies Prisma.UtilisateurInclude;

@Injectable()
export class UtilisateursService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; perPage?: number } = {}) {
    const page = Math.max(1, query.page ?? 1);
    const perPage = query.perPage ?? 10; // 0 = tout, sans pagination
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

  async findOne(id: number) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id },
      include: includeBase,
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable.');
    return utilisateur;
  }

  async create(dto: CreateUtilisateurDto) {
    // Le compte est toujours rattaché à une fiche Personnel (§16.3)
    const personnel = await this.prisma.personnel.findUnique({
      where: { id: dto.personnelId },
    });
    if (!personnel) {
      throw new BadRequestException('Fiche Personnel introuvable.');
    }
    const existant = await this.prisma.utilisateur.findUnique({
      where: { personnelId: dto.personnelId },
    });
    if (existant) {
      throw new ConflictException(
        'Un compte utilisateur existe déjà pour ce personnel.',
      );
    }

    const { onglets, ...champs } = dto;
    this.verifierOnglets(onglets);
    const motDePasse = await bcrypt.hash(dto.motDePasse, 10);
    try {
      return await this.prisma.utilisateur.create({
        data: {
          ...champs,
          motDePasse,
          ...(onglets?.length
            ? { onglets: { create: [...new Set(onglets)].map((onglet) => ({ onglet })) } }
            : {}),
        },
        include: includeBase,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce matricule de connexion existe déjà.');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateUtilisateurDto) {
    await this.findOne(id);
    const { onglets, ...champs } = dto;
    this.verifierOnglets(onglets);
    try {
      return await this.prisma.utilisateur.update({
        where: { id },
        data: {
          ...champs,
          // La liste envoyée remplace entièrement les onglets cochés
          ...(onglets
            ? { onglets: { deleteMany: {}, create: [...new Set(onglets)].map((onglet) => ({ onglet })) } }
            : {}),
        },
        include: includeBase,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce matricule de connexion existe déjà.');
      }
      throw e;
    }
  }

  /** Refuse les codes absents du catalogue (src/auth/onglets.ts). */
  private verifierOnglets(onglets?: string[]) {
    const inconnus = (onglets ?? []).filter((o) => !CODES_ONGLETS.has(o));
    if (inconnus.length) {
      throw new BadRequestException(`Onglet(s) inconnu(s) : ${inconnus.join(', ')}.`);
    }
  }

  async resetMotDePasse(id: number, motDePasse: string) {
    await this.findOne(id);
    const hash = await bcrypt.hash(motDePasse, 10);
    return this.prisma.utilisateur.update({
      where: { id },
      data: { motDePasse: hash },
      include: includeBase,
    });
  }

  /**
   * Pas de suppression physique : le compte est suspendu,
   * la fiche Personnel restant disponible pour la traçabilité (§16.3).
   */
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.utilisateur.update({
      where: { id },
      data: { statut: 'SUSPENDU' },
      include: includeBase,
    });
  }
}
