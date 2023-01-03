import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateVehicleDTO {
  @ApiProperty()
  @IsString({ message: 'Placa não está definido para o tipo string.' })
  @IsOptional()
  @MinLength(7, { message: 'Placa não pode conter menos que 7 dígitos.' })
  @MaxLength(7, { message: 'Placa não pode conter mais que 7 dígitos.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  plate?: string;

  @ApiProperty()
  @IsString({ message: 'Empresa não está definido para o tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company?: string;

  @ApiProperty()
  @IsString({ message: 'Tipo não está definido para o tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  type?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  lastSurvey?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  expiration?: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  capacity?: number;

  @ApiProperty()
  @IsString({ message: 'Renavam não está definido para o tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  renavam?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  lastMaintenance?: Date;

  @ApiProperty()
  @IsString({ message: 'Observação não está definido para o tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  note?: string;

  @ApiProperty()
  @IsBoolean({
    message: '[isAccessibility] A acessibilidade deve ser do tipo booleano.',
  })
  @IsOptional()
  isAccessibility?: boolean;
}
