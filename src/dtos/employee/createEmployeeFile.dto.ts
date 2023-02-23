import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsNumberString,
  IsInt,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { faker } from '@faker-js/faker';
import { EmployeeAddressDTO } from './employeeAddress.dto';
import { CreateEmployeePinDTO } from '../pin/createEmployeePin.dto';
import { ETypeShiftRotue } from 'src/utils/ETypes';

faker.locale = 'pt_BR';

export class CreateEmployeeFileDTO {


  @IsNotEmpty({
    message: '[admission] A data de admissão deve ser preenchida.',
  })
  admission: Date;

  @ApiProperty({ default: `${faker.random.numeric(6)}` })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNumberString(
    {},
    { message: '[registration] A matrícula deve ser do tipo string.' },
  ) 
  @IsNotEmpty({ message: '[registration] A matrícula deve ser preenchida.' })
  registration: string;

  @ApiProperty({ default: `${faker.name.jobTitle()}` })
  @IsOptional()
  @IsString({ message: '[role] O cargo deve ser do tipo string.' })
  role?: string;

  @ApiProperty({ default: `${faker.name.fullName()}` })
  @IsString({ message: '[name] O nome deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O nome deve ser preenchido.' })
  name: string;

  @ApiProperty({
    description: 'Turno da rota',
    default: 'PRIMEIRO',
    enum: ['PRIMEIRO', 'SEGUNDO', 'TERCEIRO'],
  })
  @IsEnum(ETypeShiftRotue, {
    message: '[shift] Turno tem que ser do tipo PRIMEIRO, SEGUNDO ou TERCEIRO.',
  })
  shift: ETypeShiftRotue;

  

  @ApiProperty({ default: `${faker.random.numeric(6)}` })
  @IsString({
    message: '[costCenter] O centro de custo deve ser do tipo string.',
  })
  costCenter: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => EmployeeAddressDTO)
  address: EmployeeAddressDTO;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeePinDTO)
  @IsNotEmpty({ message: '[pin] O ponto de embarque deve ser preenchido.' })
  pin: CreateEmployeePinDTO;
}
