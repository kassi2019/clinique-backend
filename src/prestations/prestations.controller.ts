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
import {
  CreatePrestationDto,
  UpdatePrestationDto,
} from './dto/create-prestation.dto';
import { PrestationsService } from './prestations.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prestations')
export class PrestationsController {
  constructor(private prestationsService: PrestationsService) {}

  /** Lecture : tous les utilisateurs connectés (référentiel utilisé
   *  par l'accueil et la caisse pour choisir consultations et actes). */
  @Get()
  findAll(
    @Query('cliniqueId') cliniqueId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.prestationsService.findAll({
      cliniqueId: cliniqueId ? Number(cliniqueId) : undefined,
      serviceId: serviceId ? Number(serviceId) : undefined,
      search,
      page: page ? Number(page) : undefined,
      perPage: perPage !== undefined ? Number(perPage) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prestationsService.findOne(id);
  }

  @Roles('ADMINISTRATEUR')
  @Post()
  create(@Body() dto: CreatePrestationDto) {
    return this.prestationsService.create(dto);
  }

  @Roles('ADMINISTRATEUR')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrestationDto,
  ) {
    return this.prestationsService.update(id, dto);
  }

  @Roles('ADMINISTRATEUR')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prestationsService.remove(id);
  }
}
