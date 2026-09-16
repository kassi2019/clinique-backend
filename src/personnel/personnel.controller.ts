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
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { PersonnelService } from './personnel.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRATEUR')
@Controller('personnel')
export class PersonnelController {
  constructor(private personnelService: PersonnelService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('statut') statut?: string,
    @Query('cliniqueId') cliniqueId?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.personnelService.findAll({
      search,
      statut,
      cliniqueId: cliniqueId ? Number(cliniqueId) : undefined,
      page: page ? Number(page) : undefined,
      perPage: perPage !== undefined ? Number(perPage) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personnelService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePersonnelDto) {
    return this.personnelService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePersonnelDto) {
    return this.personnelService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.personnelService.remove(id);
  }
}
