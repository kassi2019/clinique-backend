import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { cliniqueId?: number; page?: number; perPage?: number } = {}) {
    const where = query.cliniqueId ? { cliniqueId: query.cliniqueId } : undefined;
    const page = Math.max(1, query.page ?? 1);
    const perPage = query.perPage ?? 10; // 0 = tout, sans pagination
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

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { clinique: { select: { id: true, code: true, nom: true } } },
    });
    if (!service) throw new NotFoundException('Service introuvable.');
    return service;
  }

  async create(dto: CreateServiceDto) {
    try {
      return await this.prisma.service.create({ data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce code de service existe déjà pour cette clinique.');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateServiceDto) {
    await this.findOne(id);
    try {
      return await this.prisma.service.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce code de service existe déjà pour cette clinique.');
      }
      throw e;
    }
  }

  /** Désactivation douce : le service passe à actif = false. */
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.service.update({
      where: { id },
      data: { actif: false },
    });
  }
}
