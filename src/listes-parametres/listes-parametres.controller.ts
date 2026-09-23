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
import { ListesParametresService } from './listes-parametres.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('listes-parametres')
export class ListesParametresController {
  constructor(private listesService: ListesParametresService) {}

  /** Lecture : tous les utilisateurs connectés (listes déroulantes). */
  @Get()
  findAll(
    @Query('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Query('code') code?: string,
    @Query('tous') tous?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.listesService.findAll(
      cliniqueId,
      code,
      tous === '1' || tous === 'true',
      page ? Number(page) : undefined,
      perPage ? Number(perPage) : undefined,
    );
  }

  /** Saisie libre auto-alimentée : ajoute une valeur (tous les utilisateurs). */
  @Post()
  creer(@Body() body: { cliniqueId: number; code: string; libelle: string }) {
    return this.listesService.creer(Number(body.cliniqueId), body.code, body.libelle);
  }

  /** Import en masse depuis Excel (réservé aux administrateurs). */
  @Roles('ADMINISTRATEUR')
  @Post('import')
  importer(
    @Body() body: { cliniqueId: number; code: string; libelles: string[] },
  ) {
    return this.listesService.importer(Number(body.cliniqueId), body.code, body.libelles ?? []);
  }

  /** Renomme une entrée (administrateur). */
  @Roles('ADMINISTRATEUR')
  @Patch(':id')
  modifier(
    @Param('id', ParseIntPipe) id: number,
    @Query('code') code: string,
    @Body() body: { libelle: string },
  ) {
    return this.listesService.modifier(id, code ?? 'NATIONALITE', body.libelle ?? '');
  }

  /** Désactive/réactive une entrée (administrateur). */
  @Roles('ADMINISTRATEUR')
  @Delete(':id')
  desactiver(@Param('id', ParseIntPipe) id: number, @Query('code') code?: string) {
    return this.listesService.desactiver(id, code ?? 'NATIONALITE');
  }
}
