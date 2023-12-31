import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateEmployeePinDTO } from '../pin/updateEmployeePin.dto';
import { EmployeeAddressDTO } from './employeeAddress.dto';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { ETypeShiftEmployee } from '../../utils/ETypes';

export class UpdateEmployeeDTO {
  @ApiProperty({
    required: false,
    example: `${faker.string.numeric(6)}`,
    description: 'Matrícula do colaborador',
  })
  @ApiProperty({ required: false, example: `${faker.string.numeric(6)}` })
  @IsString({ message: '[registration] A matrícula deve ser do tipo texto.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration?: string;

  @ApiProperty({
    required: false,
    example: `${faker.date.past().toISOString()}`,
    description: 'Data de admissão do colaborador',
  })
  @IsDateString(
    {},
    { message: '[admission] A data de admissão deve ser do tipo data.' },
  )
  @IsOptional()
  admission?: Date;

  @ApiProperty({
    required: false,
    example: `${faker.person.fullName()}`,
    description: 'Nome do colaborador',
  })
  @ApiProperty({ required: false, example: `${faker.person.fullName()}` })
  @IsString({ message: '[name] o nome deve ser do tipo texto.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name?: string;

  @ApiProperty({
    required: false,
    example: `${faker.person.jobTitle()}`,
    description: 'Cargo do colaborador',
  })
  @ApiProperty({ required: false, example: `${faker.person.jobTitle()}` })
  @IsString({ message: '[rola] o cargo deve ser do tipo texto.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role?: string;

  @ApiProperty({
    required: false,
    example: `${faker.string.numeric({
      allowLeadingZeros: false,
      length: 1,
      exclude: ['0', '5', '6', '7', '8', '9'],
    })}`,
    description: 'Turno de trabalho do colaborador',
  })
  @IsEnum(ETypeShiftEmployee, {
    message:
      '[shift] Turno tem que ser do tipo PRIMEIRO, SEGUNDO, TERCEIRO ou SEM TURNO ESTABELECIDO',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift?: ETypeShiftEmployee;

  @ApiProperty({
    required: false,
    example: `${faker.string.numeric(6)}`,
    description: 'Centro de custo do colaborador',
  })
  @ApiProperty({ required: false, example: `${faker.string.numeric(6)}` })
  @IsString({ message: '[costCenter] o campo custo deve ser do tipo texto.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter?: string;

  @ApiProperty({ required: false, description: 'Endereço do colaborador' })
  @ApiProperty({ required: false })
  @ValidateNested({ each: true })
  @Type(() => EmployeeAddressDTO)
  @IsOptional()
  address?: EmployeeAddressDTO;

  @ApiProperty({
    required: false,
    description: 'Ponto de embarque do colaborador',
  })
  @ApiProperty({ required: false })
  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeePinDTO)
  @IsOptional()
  pin: UpdateEmployeePinDTO;
}
