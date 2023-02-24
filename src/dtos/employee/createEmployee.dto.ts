import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
  IsNumberString,
  IsEnum,
} from 'class-validator';
import { CreateEmployeePinDTO } from '../pin/createEmployeePin.dto';
import { EmployeeAddressDTO } from './employeeAddress.dto';
import { faker } from '@faker-js/faker';
import { ETypeShiftEmployee } from 'src/utils/ETypes';

faker.locale = 'pt_BR';

export class CreateEmployeeDTO {
  @ApiProperty({ default: `${faker.random.numeric(6)}` })
  @IsNumberString(
    {},
    { message: '[registration] A matrícula deve ser do tipo string.' },
  )
  @IsNotEmpty({ message: '[registration] A matrícula deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration: string;

  @ApiProperty({ default: `${faker.date.past().toISOString()}` })
  @IsDateString(
    {},
    { message: '[admission] A data de admissão deve ser do tipo date.' },
  )
  @IsNotEmpty({
    message: '[admission] A data de admissão deve ser preenchida.',
  })
  admission: Date;

  @ApiProperty({ default: `${faker.name.jobTitle()}` })
  @IsString({ message: '[role] O cargo deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O cargo deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role: string;

  @ApiProperty({ default: `${faker.name.fullName()}` })
  @IsString({ message: '[name] O nome deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O nome deve ser preenchido.' })
  name: string;

  @ApiProperty({
    description: 'Turno da rota',
    default: 'PRIMEIRO',
    enum: ['PRIMEIRO', 'SEGUNDO', 'TERCEIRO', 'SEM TURNO ESTABELECIDO'],
  })
  @IsEnum(ETypeShiftEmployee, {
    message: '[shift] Turno tem que ser do tipo PRIMEIRO, SEGUNDO, TERCEIRO ou SEM TURNO ESTABELECIDO',
  })
  shift: ETypeShiftEmployee;

  @ApiProperty({ default: `${faker.random.numeric(6)}` })
  @IsString({
    message: '[costCenter] O centro de custo deve ser do tipo string.',
  })
  @IsNotEmpty({
    message: '[costCenter] O centro de custo deve ser preenchido.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter: string;

  @ApiProperty()
  @IsNotEmpty({ message: '[address] O endereço deve ser preenchido.' })
  @ValidateNested({ each: true })
  @Type(() => EmployeeAddressDTO)
  address: EmployeeAddressDTO;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeePinDTO)
  @IsNotEmpty({ message: '[pin] O ponto de embarque deve ser preenchido.' })
  pin: CreateEmployeePinDTO;
}
