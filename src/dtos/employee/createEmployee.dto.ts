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

export class CreateEmployeeDTO {
  @ApiProperty()
  @IsString({ message: '[registration] A matrícula deve ser do tipo string.' })
  @IsNotEmpty({ message: '[registration] A matrícula deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration: string;

  @ApiProperty()
  @IsDateString({}, { message: '[admission] A data de admissão deve ser do tipo date.' })
  @IsNotEmpty({ message: '[admission] A data de admissão deve ser preenchida.' })
  admission: Date;
  
  @ApiProperty()
  @IsString({ message: '[role] O cargo deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O cargo deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role: string;

  @ApiProperty()
  @IsString({ message: '[name] O nome deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O nome deve ser preenchido.' })
  name: string;
  
  @ApiProperty()
  @IsString({ message: '[shift] O turno deve ser do tipo string.' })
  @IsNotEmpty({ message: '[shift] O turno deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift: string;
 
  @ApiProperty()
  @IsString({ message: '[costCenter] O centro de custo deve ser do tipo string.' })
  @IsNotEmpty({ message: '[costCenter] O centro de custo deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter: string;
 
  @ApiProperty()
  @IsNotEmpty({ message: '[address] O endereço deve ser preenchido.' })
  @ValidateNested({ each: true })
  @Type(() => EmployeeAddressDTO)
  address: EmployeeAddressDTO | string;
 
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeePinDTO)
  @IsNotEmpty({ message: '[pin] O ponto de embarque deve ser preenchido.'})
  pin: CreateEmployeePinDTO;
}
