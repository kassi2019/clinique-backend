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
        stock: dto.stock !== undefined ? Number(dto.stock) : 0,
        prixVente: dto.prixVente !== undefined ? Number(dto.prixVente) : undefined,
        seuilAlerte: dto.seuilAlerte !== undefined ? Number(dto.seuilAlerte) : 0,
        uniteVente: dto.uniteVente ?? 'BOITE',
        consommable: dto.consommable === true || dto.consommable === 'true',
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
        stock: dto.stock !== undefined ? Number(dto.stock) : undefined,
        prixVente: dto.prixVente !== undefined ? Number(dto.prixVente) : undefined,
        seuilAlerte: dto.seuilAlerte !== undefined ? Number(dto.seuilAlerte) : undefined,
        uniteVente: dto.uniteVente,
        actif: dto.actif,
        consommable:
          dto.consommable !== undefined
            ? dto.consommable === true || dto.consommable === 'true'
            : undefined,
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

  /** Import en masse depuis Excel (colonnes : nom, forme, dosage, prixVente, seuilAlerte, uniteVente, consommable). */
  @UseGuards(RolesGuard)
  @Roles('ADMINISTRATEUR')
  @Post('import')
  async importer(@Body() dto: any) {
    const lignes: any[] = dto.lignes ?? [];
    const cliniqueId = Number(dto.cliniqueId);
    if (!cliniqueId) throw new Error('cliniqueId obligatoire.');
    let ajoutes = 0;
    for (const l of lignes) {
      const nom = String(l.nom ?? '').trim();
      if (!nom) continue;
      const existe = await this.prisma.medicament.findUnique({
        where: { cliniqueId_nom: { cliniqueId, nom } },
      });
      if (existe) continue;
      await this.prisma.medicament.create({
        data: {
          cliniqueId,
          nom,
          forme: l.forme || undefined,
          dosage: l.dosage || undefined,
          stock: Number(l.stock) || 0,
          prixVente: l.prixVente != null && l.prixVente !== '' ? Number(l.prixVente) : undefined,
          seuilAlerte: Number(l.seuilAlerte) || 0,
          uniteVente: l.uniteVente ?? 'BOITE',
          consommable: l.consommable === true || l.consommable === 'true' || String(l.consommable).toLowerCase() === 'oui',
        },
      });
      ajoutes++;
    }
    return { ajoutes, total: lignes.length };
  }
}
