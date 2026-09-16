import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCliniqueDto, UpdateCliniqueDto } from './dto/create-clinique.dto';

@Injectable()
export class CliniquesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.clinique.findMany({ orderBy: { nom: 'asc' } });
  }

  async findOne(id: number) {
    const clinique = await this.prisma.clinique.findUnique({
      where: { id },
      include: { _count: { select: { personnel: true, services: true } } },
    });
    if (!clinique) throw new NotFoundException('Clinique introuvable.');
    return clinique;
  }

  async create(dto: CreateCliniqueDto) {
    try {
      return await this.prisma.clinique.create({ data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce code de clinique existe déjà.');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateCliniqueDto) {
    await this.findOne(id);
    try {
      return await this.prisma.clinique.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ce code de clinique existe déjà.');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.clinique.update({
      where: { id },
      data: { statut: 'INACTIF' },
    });
  }
}
