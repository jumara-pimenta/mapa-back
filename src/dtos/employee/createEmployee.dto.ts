import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { CreateEmployeePinDTO } from '../pin/createEmployeePin.dto';
import { EmployeeAddressDTO } from './employeeAddress.dto';
import { faker } from '@faker-js/faker';

faker.locale = 'pt_BR';

export class CreateEmployeeDTO {
  @ApiProperty({
    default: `${faker.random.numeric(6)}`,
    description: 'Matrícula do colaborador',
  })
  @IsString({ message: '[registration] A matrícula deve ser do tipo string.' })
  @IsNotEmpty({ message: '[registration] A matrícula deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration: string;

  @ApiProperty({
    default: `${faker.date.past().toISOString()}`,
    description: 'Data de admissão do colaborador',
  })
  @IsDateString(
    {},
    { message: '[admission] A data de admissão deve ser do tipo date.' },
  )
  @IsNotEmpty({
    message: '[admission] A data de admissão deve ser preenchida.',
  })
  admission: Date;

  @ApiProperty({
    default: `${faker.name.jobTitle()}`,
    description: 'Cargo do colaborador',
  })
  @IsString({ message: '[role] O cargo deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O cargo deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role: string;

  @ApiProperty({
    default: `${faker.name.fullName()}`,
    description: 'Nome do colaborador',
  })
  @IsString({ message: '[name] O nome deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O nome deve ser preenchido.' })
  name: string;

  @ApiProperty({
    default: `${faker.random.numeric(1, {
      allowLeadingZeros: false,
      bannedDigits: ['0', '5', '6', '7', '8', '9'],
    })}`,
    description: 'Turno de trabalho do colaborador',
  })
  @IsString({ message: '[shift] O turno deve ser do tipo string.' })
  @IsNotEmpty({ message: '[shift] O turno deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift: string;

  @ApiProperty({
    default: `${faker.random.numeric(6)}`,
    description: 'Centro de custo do colaborador',
  })
  @IsString({
    message: '[costCenter] O centro de custo deve ser do tipo string.',
  })
  @IsNotEmpty({
    message: '[costCenter] O centro de custo deve ser preenchido.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter: string;

  @ApiProperty({ description: 'Endereço do colaborador' })
  @IsNotEmpty({ message: '[address] O endereço deve ser preenchido.' })
  @ValidateNested({ each: true })
  @Type(() => EmployeeAddressDTO)
  address: EmployeeAddressDTO;

  @ApiProperty({ description: 'Ponto de embarque do colaborador' })
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeePinDTO)
  @IsNotEmpty({ message: '[pin] O ponto de embarque deve ser preenchido.' })
  pin: CreateEmployeePinDTO;
}
