import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateEmployeePinDTO } from '../pin/updateEmployeePin.dto';

export class UpdateEmployeeDTO {
  @IsString({ message: '[registration] A matrícula deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration?: string;

  @IsDateString({}, { message: '[admission] A data de admissão deve ser do tipo date.' })
  @IsOptional()
  admission?: Date;

  @IsString({ message: '[name] O nome deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name?: string;

  @IsString({ message: 'Cargo não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role?: string;

  @IsString({ message: '[shift] O turno deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift?: string;

  @IsString({ message: '[costCenter] O centro de custo deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter?: string;

  @IsString({ message: '[address] O endereço deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address?: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeePinDTO)
  @IsOptional()
  pin?: UpdateEmployeePinDTO
}
