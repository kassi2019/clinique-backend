import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';

const includeUtilisateur = {
  utilisateur: {
    select: {
      id: true,
      matricule: true,
      statut: true,
      role: { select: { code: true, nom: true } },
    },
  },
} satisfies Prisma.PersonnelInclude;

const includeBase = {
  service: true,
  clinique: { select: { id: true, code: true, nom: true } },
  ...includeUtilisateur,
} satisfies Prisma.PersonnelInclude;

@Injectable()
export class PersonnelService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    statut?: string;
    cliniqueId?: number;
    page?: number;
    perPage?: number;
  }) {
    const where: Prisma.PersonnelWhereInput = {};
    if (query.statut) where.statut = query.statut;
    if (query.cliniqueId) where.cliniqueId = Number(query.cliniqueId);
    if (query.search) {
      where.OR = [
        { nom: { contains: query.search } },
        { prenom: { contains: query.search } },
        { matricule: { contains: query.search } },
      ];
    }
    const page = Math.max(1, query.page ?? 1);
    const perPage = query.perPage ?? 10; // 0 = tout, sans pagination
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

  async findOne(id: number) {
    const personnel = await this.prisma.personnel.findUnique({
      where: { id },
      include: includeBase,
    });
    if (!personnel) throw new NotFoundException('Personnel introuvable.');
    return personnel;
  }

  async create(dto: CreatePersonnelDto) {
    try {
      return await this.prisma.personnel.create({
        data: {
          cliniqueId: dto.cliniqueId,
          // Matricule généré si absent : 3 premières lettres du code du
          // service + numéro d'ordre sur 4 chiffres (ex. MED0001, MED0002…).
          matricule:
            dto.matricule?.trim() ||
            (await this.genererMatricule(dto.cliniqueId, dto.serviceId)),
          nom: dto.nom,
          prenom: dto.prenom,
          sexe: dto.sexe,
          photo: dto.photo,
          fonction: dto.fonction,
          serviceId: dto.serviceId,
          telephone: dto.telephone,
          email: dto.email,
          statut: dto.statut,
          dateEmbauche: dto.dateEmbauche ? new Date(dto.dateEmbauche) : undefined,
        },
        include: includeBase,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'Ce matricule existe déjà pour cette clinique.',
        );
      }
      throw e;
    }
  }

  /** Génère le prochain matricule : PREFIXE_SERVICE + 0001 (increment par service). */
  private async genererMatricule(cliniqueId: number, serviceId?: number | null): Promise<string> {
    let prefixe = 'PER';
    if (serviceId) {
      const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
      if (service?.code) {
        prefixe = service.code.trim().toUpperCase().slice(0, 3) || 'PER';
      }
    }
    const existants = await this.prisma.personnel.findMany({
      where: { cliniqueId, matricule: { startsWith: prefixe } },
      select: { matricule: true },
    });
    let max = 0;
    for (const p of existants) {
      const n = parseInt(p.matricule.replace(prefixe, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    return `${prefixe}${String(max + 1).padStart(4, '0')}`;
  }

  async update(id: number, dto: UpdatePersonnelDto) {
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
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'Ce matricule existe déjà pour cette clinique.',
        );
      }
      throw e;
    }
  }

  /**
   * Pas de suppression physique : la fiche passe au statut INACTIF
   * et est conservée pour la traçabilité (cf. §16.3).
   */
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.personnel.update({
      where: { id },
      data: { statut: 'INACTIF' },
      include: includeBase,
    });
  }
}
