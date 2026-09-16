import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('medicaments')
export class MedicamentsController {
  constructor(private prisma: PrismaService) {}

  /** Catalogue des médicaments : lisible par tous les connectés (ordonnances). */
  @Get()
  async findAll(@Query('cliniqueId') cliniqueId?: string) {
    const where = cliniqueId ? { cliniqueId: Number(cliniqueId) } : {};
    return this.prisma.medicament.findMany({
      where,
      orderBy: { nom: 'asc' },
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post()
  async create(@Body() dto: any) {
    return this.prisma.medicament.create({
      data: {
        cliniqueId: dto.cliniqueId,
        nom: dto.nom,
        forme: dto.forme,
        dosage: dto.dosage,
      },
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.prisma.medicament.update({
      where: { id },
      data: {
        nom: dto.nom,
        forme: dto.forme,
        dosage: dto.dosage,
        actif: dto.actif,
      },
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.medicament.update({
      where: { id },
      data: { actif: false },
    });
  }
}
