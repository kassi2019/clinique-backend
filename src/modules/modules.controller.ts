import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Référentiel des modules applicatifs (lecture seule).
 * Les codes correspondent aux cartes de l'écran de sélection (§16.1).
 */
@UseGuards(JwtAuthGuard)
@Controller('modules')
export class ModulesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.module.findMany({ orderBy: { nom: 'asc' } });
  }
}
