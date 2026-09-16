import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

const includeHabilitations = {
  habilitations: {
    include: { module: true },
    orderBy: { module: { nom: 'asc' as const } },
  },
} satisfies Prisma.RoleInclude;

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; perPage?: number } = {}) {
    const page = Math.max(1, query.page ?? 1);
    const perPage = query.perPage ?? 10; // 0 = tout, sans pagination
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

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: includeHabilitations,
    });
    if (!role) throw new NotFoundException('Rôle introuvable.');
    return role;
  }

  async create(dto: CreateRoleDto) {
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
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce code de rôle existe déjà.');
      }
      throw e;
    }
  }

  async update(id: number, dto: CreateRoleDto) {
    await this.findOne(id);
    try {
      // Remplacement complet des habilitations
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
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce code de rôle existe déjà.');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    const utilisateurs = await this.prisma.utilisateur.count({
      where: { roleId: id },
    });
    if (utilisateurs > 0) {
      throw new ConflictException(
        `Impossible de supprimer ce rôle : ${utilisateurs} utilisateur(s) y sont rattachés.`,
      );
    }
    return this.prisma.role.delete({ where: { id } });
  }
}
