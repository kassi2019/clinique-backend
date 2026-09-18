import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EnregistrerPrelevementDto {
  @IsInt()
  passagePrestationId: number;
}

export class ResultatLigneDto {
  @IsString()
  @IsNotEmpty()
  parametre: string;

  @IsOptional()
  @IsString()
  valeur?: string;

  @IsOptional()
  @IsString()
  unite?: string;

  @IsOptional()
  @IsString()
  normes?: string;
}

export class EnregistrerResultatsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ResultatLigneDto)
  lignes: ResultatLigneDto[];

  @IsOptional()
  @IsString()
  conclusion?: string;
}
