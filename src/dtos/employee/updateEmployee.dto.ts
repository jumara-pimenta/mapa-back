import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateEmployeePinDTO } from '../pin/updateEmployeePin.dto';
import { EmployeeAddressDTO } from './employeeAddress.dto';
import { faker } from '@faker-js/faker';

faker.locale = 'pt_BR';

export class UpdateEmployeeDTO {
  @ApiProperty({
    required: false,
    example: `${faker.random.numeric(6)}`,
    description: 'Matrícula do colaborador',
  })
  @ApiProperty({ required: false, example: `${faker.random.numeric(6)}` })
  @IsString({ message: '[registration] A matrícula deve ser do tipo string.' })
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
    example: `${faker.name.fullName()}`,
    description: 'Nome do colaborador',
  })
  @ApiProperty({ required: false, example: `${faker.name.fullName()}` })
  @IsString({ message: '[name] o nome deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name?: string;

  @ApiProperty({
    required: false,
    example: `${faker.name.jobTitle()}`,
    description: 'Cargo do colaborador',
  })
  @ApiProperty({ required: false, example: `${faker.name.jobTitle()}` })
  @IsString({ message: '[rola] o cargo deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role?: string;

  @ApiProperty({
    required: false,
    example: `${faker.random.numeric(1, {
      allowLeadingZeros: false,
      bannedDigits: ['0', '5', '6', '7', '8', '9'],
    })}`,
    description: 'Turno de trabalho do colaborador',
  })
  @IsString({ message: '[shift]  o turno deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift?: string;

  @ApiProperty({
    required: false,
    example: `${faker.random.numeric(6)}`,
    description: 'Centro de custo do colaborador',
  })
  @ApiProperty({ required: false, example: `${faker.random.numeric(6)}` })
  @IsString({ message: '[costCenter] o campo custo deve ser do tipo string.' })
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
