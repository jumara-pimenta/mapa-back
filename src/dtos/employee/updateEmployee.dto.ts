import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateEmployeePinDTO } from '../pin/updateEmployeePin.dto';
import { EmployeeAddressDTO } from './employeeAddress.dto';

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
  @ValidateNested({ each: true })
  @Type(() => EmployeeAddressDTO)
  @IsOptional()
  address?: EmployeeAddressDTO ;
  
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeePinDTO)
  @IsOptional()
  pin: UpdateEmployeePinDTO;
}
