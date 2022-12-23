import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateVehicleDTO {
  @IsString({ message: 'Placa não está definido para o tipo string.' })
  @IsOptional()
  @MinLength(7, { message: 'Placa não pode conter menos que 7 dígitos.' })
  @MaxLength(7, { message: 'Placa não pode conter mais que 7 dígitos.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  plate?: string;

  @IsString({ message: 'Empresa não está definido para o tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company?: string;

  @IsString({ message: 'Tipo não está definido para o tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  type?: string;

  @IsDateString()
  @IsOptional()
  lastSurvey?: Date;

  @IsDateString()
  @IsOptional()
  expiration?: Date;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString({ message: 'Renavam não está definido para o tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(11, { message: 'Renavam não pode conter menos que 11 dígitos.' })
  @MaxLength(11, { message: 'Renavam nao pode conter mais que 11 dígitos.' })
  renavam?: string;

  @IsDateString()
  @IsOptional()
  lastMaintenance?: Date;

  @IsString({ message: 'Observação não está definido para o tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  note?: string;

  @IsBoolean({
    message: '[isAccessibility] A acessibilidade deve ser do tipo booleano.',
  })
  @IsOptional()
  isAccessibility?: boolean;
}
