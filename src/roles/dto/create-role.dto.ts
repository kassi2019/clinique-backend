import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HabilitationDto {
  @IsInt()
  moduleId: number;

  @IsOptional()
  @IsBoolean()
  lecture?: boolean;

  @IsOptional()
  @IsBoolean()
  ecriture?: boolean;

  @IsOptional()
  @IsBoolean()
  validation?: boolean;
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabilitationDto)
  habilitations?: HabilitationDto[];
}
