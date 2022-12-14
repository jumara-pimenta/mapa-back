import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEmployeeDTO {
  @IsString({ message: 'Matrícula não está definida como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration?: string;

  @IsOptional()
  @IsDateString()
  admission?: Date;

  @IsString({ message: 'Nome não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name?: string;

  @IsString({ message: 'Cargo não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role?: string;

  @IsString({ message: 'Turno não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift?: string;

  @IsString({ message: 'Centro de custo não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter?: string;

  @IsString({ message: 'Endereço não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address?: string;
}
