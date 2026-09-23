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

/**
 * Endpoints DÉDIÉS par liste (une route par table) :
 *   /fonctions, /posologies, /diagnostics, /pathologies,
 *   /nationalites, /residences, /fournisseurs
 * Chaque groupe : GET (lecture, tous rôles) + POST/PATCH/DELETE (admin).
 */
@Controller()
export class ParametresListesController {
  constructor(private listes: ListesParametresService) {}

  // ── FONCTIONS ──
  @UseGuards(JwtAuthGuard)
  @Get('fonctions')
  fonctions(@Query('cliniqueId', ParseIntPipe) cliniqueId: number, @Query('tous') tous?: string, @Query('page') page?: string, @Query('perPage') perPage?: string) {
    return this.listes.findAll(cliniqueId, 'FONCTION', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Post('fonctions')
  creerFonction(@Body() b: { cliniqueId: number; libelle: string }) {
    return this.listes.creer(Number(b.cliniqueId), 'FONCTION', b.libelle);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Patch('fonctions/:id')
  modifierFonction(@Param('id', ParseIntPipe) id: number, @Body() b: { libelle: string }) {
    return this.listes.modifier(id, 'FONCTION', b.libelle ?? '');
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Delete('fonctions/:id')
  basculerFonction(@Param('id', ParseIntPipe) id: number) {
    return this.listes.desactiver(id, 'FONCTION');
  }

  // ── POSOLOGIES ──
  @UseGuards(JwtAuthGuard)
  @Get('posologies')
  posologies(@Query('cliniqueId', ParseIntPipe) cliniqueId: number, @Query('tous') tous?: string, @Query('page') page?: string, @Query('perPage') perPage?: string) {
    return this.listes.findAll(cliniqueId, 'POSOLOGIE', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Post('posologies')
  creerPosologie(@Body() b: { cliniqueId: number; libelle: string }) {
    return this.listes.creer(Number(b.cliniqueId), 'POSOLOGIE', b.libelle);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Patch('posologies/:id')
  modifierPosologie(@Param('id', ParseIntPipe) id: number, @Body() b: { libelle: string }) {
    return this.listes.modifier(id, 'POSOLOGIE', b.libelle ?? '');
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Delete('posologies/:id')
  basculerPosologie(@Param('id', ParseIntPipe) id: number) {
    return this.listes.desactiver(id, 'POSOLOGIE');
  }

  // ── DIAGNOSTICS ──
  @UseGuards(JwtAuthGuard)
  @Get('diagnostics')
  diagnostics(@Query('cliniqueId', ParseIntPipe) cliniqueId: number, @Query('tous') tous?: string, @Query('page') page?: string, @Query('perPage') perPage?: string) {
    return this.listes.findAll(cliniqueId, 'DIAGNOSTIC', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Post('diagnostics')
  creerDiagnostic(@Body() b: { cliniqueId: number; libelle: string }) {
    return this.listes.creer(Number(b.cliniqueId), 'DIAGNOSTIC', b.libelle);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Patch('diagnostics/:id')
  modifierDiagnostic(@Param('id', ParseIntPipe) id: number, @Body() b: { libelle: string }) {
    return this.listes.modifier(id, 'DIAGNOSTIC', b.libelle ?? '');
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Delete('diagnostics/:id')
  basculerDiagnostic(@Param('id', ParseIntPipe) id: number) {
    return this.listes.desactiver(id, 'DIAGNOSTIC');
  }

  // ── PATHOLOGIES ──
  @UseGuards(JwtAuthGuard)
  @Get('pathologies')
  pathologies(@Query('cliniqueId', ParseIntPipe) cliniqueId: number, @Query('tous') tous?: string, @Query('page') page?: string, @Query('perPage') perPage?: string) {
    return this.listes.findAll(cliniqueId, 'PATHOLOGIE', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Post('pathologies')
  creerPathologie(@Body() b: { cliniqueId: number; libelle: string }) {
    return this.listes.creer(Number(b.cliniqueId), 'PATHOLOGIE', b.libelle);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Patch('pathologies/:id')
  modifierPathologie(@Param('id', ParseIntPipe) id: number, @Body() b: { libelle: string }) {
    return this.listes.modifier(id, 'PATHOLOGIE', b.libelle ?? '');
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Delete('pathologies/:id')
  basculerPathologie(@Param('id', ParseIntPipe) id: number) {
    return this.listes.desactiver(id, 'PATHOLOGIE');
  }

  // ── NATIONALITÉS ──
  @UseGuards(JwtAuthGuard)
  @Get('nationalites')
  nationalites(@Query('cliniqueId', ParseIntPipe) cliniqueId: number, @Query('tous') tous?: string, @Query('page') page?: string, @Query('perPage') perPage?: string) {
    return this.listes.findAll(cliniqueId, 'NATIONALITE', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Post('nationalites')
  creerNationalite(@Body() b: { cliniqueId: number; libelle: string }) {
    return this.listes.creer(Number(b.cliniqueId), 'NATIONALITE', b.libelle);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Patch('nationalites/:id')
  modifierNationalite(@Param('id', ParseIntPipe) id: number, @Body() b: { libelle: string }) {
    return this.listes.modifier(id, 'NATIONALITE', b.libelle ?? '');
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Delete('nationalites/:id')
  basculerNationalite(@Param('id', ParseIntPipe) id: number) {
    return this.listes.desactiver(id, 'NATIONALITE');
  }

  // ── RÉSIDENCES ──
  @UseGuards(JwtAuthGuard)
  @Get('residences')
  residences(@Query('cliniqueId', ParseIntPipe) cliniqueId: number, @Query('tous') tous?: string, @Query('page') page?: string, @Query('perPage') perPage?: string) {
    return this.listes.findAll(cliniqueId, 'RESIDENCE', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Post('residences')
  creerResidence(@Body() b: { cliniqueId: number; libelle: string }) {
    return this.listes.creer(Number(b.cliniqueId), 'RESIDENCE', b.libelle);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Patch('residences/:id')
  modifierResidence(@Param('id', ParseIntPipe) id: number, @Body() b: { libelle: string }) {
    return this.listes.modifier(id, 'RESIDENCE', b.libelle ?? '');
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Delete('residences/:id')
  basculerResidence(@Param('id', ParseIntPipe) id: number) {
    return this.listes.desactiver(id, 'RESIDENCE');
  }

  // ── FOURNISSEURS ──
  @UseGuards(JwtAuthGuard)
  @Get('fournisseurs')
  fournisseurs(@Query('cliniqueId', ParseIntPipe) cliniqueId: number, @Query('tous') tous?: string, @Query('page') page?: string, @Query('perPage') perPage?: string) {
    return this.listes.findAll(cliniqueId, 'FOURNISSEUR', tous === '1', page ? Number(page) : undefined, perPage ? Number(perPage) : undefined);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Post('fournisseurs')
  creerFournisseur(@Body() b: { cliniqueId: number; libelle: string }) {
    return this.listes.creer(Number(b.cliniqueId), 'FOURNISSEUR', b.libelle);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Patch('fournisseurs/:id')
  modifierFournisseur(@Param('id', ParseIntPipe) id: number, @Body() b: { libelle: string }) {
    return this.listes.modifier(id, 'FOURNISSEUR', b.libelle ?? '');
  }
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMINISTRATEUR')
  @Delete('fournisseurs/:id')
  basculerFournisseur(@Param('id', ParseIntPipe) id: number) {
    return this.listes.desactiver(id, 'FOURNISSEUR');
  }
}
