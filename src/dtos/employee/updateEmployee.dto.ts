import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateEmployeePinDTO } from '../pin/updateEmployeePin.dto';

export class UpdateEmployeeDTO {
  @ApiProperty()
  @IsString({ message: '[registration] A matrícula deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration?: string;

  @ApiProperty()
  @IsDateString({}, { message: '[admission] A data de admissão deve ser do tipo date.' })
  @IsOptional()
  admission?: Date;

  @ApiProperty()
  @IsString({ message: '[name] o nome deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name?: string;

  @ApiProperty()
  @IsString({ message: '[rola] o cargo deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role?: string;

  @ApiProperty()
  @IsString({ message: '[shift]  o turno deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift?: string;

  @ApiProperty()
  @IsString({ message: '[costCenter] o campo custo deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter?: string;

  @ApiProperty()
  @IsString({ message: '[address] o campo endereço deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address?: string;

  @IsString({
    message: '[pinId] O id do ponto de embarque deve ser do tipo string.',
  })
  @IsOptional()
  pin: UpdateEmployeePinDTO;
}
