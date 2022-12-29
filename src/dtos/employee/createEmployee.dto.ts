import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { CreateEmployeePinDTO } from '../pin/createEmployeePin.dto';

export class CreateEmployeeDTO {
  @IsString({ message: '[registration] A matrícula deve ser do tipo string.' })
  @IsNotEmpty({ message: '[registration] A matrícula deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration: string;

  @IsDateString({}, { message: '[admission] A data de admissão deve ser do tipo date.' })
  @IsNotEmpty({ message: '[admission] A data de admissão deve ser preenchida.' })
  admission: Date;

  @IsString({ message: '[role] O cargo deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O cargo deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role: string;

  @IsString({ message: '[name] O nome deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O nome deve ser preenchido.' })
  name: string;

  @IsString({ message: '[shift] O turno deve ser do tipo string.' })
  @IsNotEmpty({ message: '[shift] O turno deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift: string;

  @IsString({ message: '[costCenter] O centro de custo deve ser do tipo string.' })
  @IsNotEmpty({ message: '[costCenter] O centro de custo deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter: string;

  @IsString({ message: '[address] O endereço deve ser do tipo string.' })
  @IsNotEmpty({ message: '[address] O endereço deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address: string;

  @ValidateNested({ each: true })
  @Type(() => CreateEmployeePinDTO)
  @IsNotEmpty({ message: '[pin] O ponto de embarque deve ser preenchido.'})
  pin: CreateEmployeePinDTO;
}
