import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateEmployeePinDTO } from '../pin/updateEmployeePin.dto';

export class UpdateEmployeeDTO {
  @ApiProperty()
  @IsString({ message: 'Matrícula não está definida como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration?: string;

  @ApiProperty()
  @IsOptional()
  admission?: Date;

  @ApiProperty()
  @IsString({ message: 'Nome não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name?: string;

  @ApiProperty()
  @IsString({ message: 'Cargo não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role?: string;

  @ApiProperty()
  @IsString({ message: 'Turno não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift?: string;

  @ApiProperty()
  @IsString({ message: 'Centro de custo não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter?: string;

  @ApiProperty()
  @IsString({ message: 'Endereço não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address?: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeePinDTO)
  @IsOptional()
  pin: UpdateEmployeePinDTO;
}
