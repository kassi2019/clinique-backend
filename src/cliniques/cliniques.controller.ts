import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CliniquesService } from './cliniques.service';
import { CreateCliniqueDto, UpdateCliniqueDto } from './dto/create-clinique.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cliniques')
export class CliniquesController {
  constructor(private cliniquesService: CliniquesService) {}

  /** Lecture : tous les utilisateurs connectés (référentiel). */
  @Get()
  findAll() {
    return this.cliniquesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cliniquesService.findOne(id);
  }

  @Roles('ADMINISTRATEUR')
  @Post()
  create(@Body() dto: CreateCliniqueDto) {
    return this.cliniquesService.create(dto);
  }

  @Roles('ADMINISTRATEUR')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCliniqueDto) {
    return this.cliniquesService.update(id, dto);
  }

  @Roles('ADMINISTRATEUR')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cliniquesService.remove(id);
  }
}
