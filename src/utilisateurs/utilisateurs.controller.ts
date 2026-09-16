import {
  BadRequestException,
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
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import {
  ResetMotDePasseDto,
  UpdateUtilisateurDto,
} from './dto/update-utilisateur.dto';
import { UtilisateursService } from './utilisateurs.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRATEUR')
@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private utilisateursService: UtilisateursService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.utilisateursService.findAll({
      page: page ? Number(page) : undefined,
      perPage: perPage !== undefined ? Number(perPage) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateursService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUtilisateurDto) {
    return this.utilisateursService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUtilisateurDto) {
    return this.utilisateursService.update(id, dto);
  }

  @Post(':id/reinitialiser-mot-de-passe')
  resetMotDePasse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetMotDePasseDto,
  ) {
    if (!dto.motDePasse || dto.motDePasse.length < 6) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins 6 caractères.',
      );
    }
    return this.utilisateursService.resetMotDePasse(id, dto.motDePasse);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateursService.remove(id);
  }
}
