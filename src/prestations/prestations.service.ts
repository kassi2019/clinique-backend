import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePrestationDto,
  UpdatePrestationDto,
} from './dto/create-prestation.dto';

// Le Decimal Prisma est converti en nombre pour l'API
function formatPrestation<T extends { montant: Prisma.Decimal }>(p: T) {
  return { ...p, montant: Number(p.montant) };
}

const includeBase = {
  service: { select: { id: true, code: true, nom: true } },
  clinique: { select: { id: true, code: true, nom: true } },
} satisfies Prisma.PrestationInclude;

@Injectable()
export class PrestationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    cliniqueId?: number;
    serviceId?: number;
    search?: string;
    page?: number;
    perPage?: number;
  }) {
    const where: Prisma.PrestationWhereInput = {};
    if (query.cliniqueId) where.cliniqueId = query.cliniqueId;
    if (query.serviceId) where.serviceId = query.serviceId;
    if (query.search) {
      where.OR = [
        { code: { contains: query.search } },
        { libelle: { contains: query.search } },
      ];
    }
    const page = Math.max(1, query.page ?? 1);
    const perPage = query.perPage ?? 10; // 0 = tout, sans pagination
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

  async findOne(id: number) {
    const prestation = await this.prisma.prestation.findUnique({
      where: { id },
      include: includeBase,
    });
    if (!prestation) throw new NotFoundException('Prestation introuvable.');
    return formatPrestation(prestation);
  }

  async create(dto: CreatePrestationDto) {
    try {
      const prestation = await this.prisma.prestation.create({
        data: dto,
        include: includeBase,
      });
      return formatPrestation(prestation);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce code de prestation existe déjà pour cette clinique.');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdatePrestationDto) {
    await this.findOne(id);
    try {
      const prestation = await this.prisma.prestation.update({
        where: { id },
        data: dto,
        include: includeBase,
      });
      return formatPrestation(prestation);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce code de prestation existe déjà pour cette clinique.');
      }
      throw e;
    }
  }

  /** Désactivation douce : actif = false. */
  async remove(id: number) {
    await this.findOne(id);
    const prestation = await this.prisma.prestation.update({
      where: { id },
      data: { actif: false },
      include: includeBase,
    });
    return formatPrestation(prestation);
  }
}
