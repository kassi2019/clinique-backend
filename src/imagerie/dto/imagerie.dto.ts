import { IsInt, IsOptional, IsString } from 'class-validator';

export class EnregistrerCrDto {
  @IsInt()
  passagePrestationId: number;

  @IsOptional()
  @IsString()
  indication?: string;

  @IsOptional()
  @IsString()
  technique?: string;

  @IsOptional()
  @IsString()
  resultat?: string;

  @IsOptional()
  @IsString()
  conclusion?: string;
}
