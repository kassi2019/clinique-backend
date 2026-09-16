import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateParametreDto } from './dto/update-parametre.dto';
import { ParametresService } from './parametres.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRATEUR')
@Controller('parametres')
export class ParametresController {
  constructor(private parametresService: ParametresService) {}

  @Get(':cliniqueId')
  findOne(@Param('cliniqueId', ParseIntPipe) cliniqueId: number) {
    return this.parametresService.getOrCreate(cliniqueId);
  }

  @Patch(':cliniqueId')
  update(
    @Param('cliniqueId', ParseIntPipe) cliniqueId: number,
    @Body() dto: UpdateParametreDto,
  ) {
    return this.parametresService.update(cliniqueId, dto);
  }
}
