import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { CreateEmployeePinDTO } from '../pin/createEmployeePin.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDTO {
  @ApiProperty({default: '123456789'})
  @IsString({ message: 'Matrícula não está definida como string.' })
  @IsNotEmpty({ message: 'Matrícula não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration: string;

  @ApiProperty({default: new Date()})
  @IsString({ message: 'Admissão não está definido como string.' })
  @IsNotEmpty({ message: 'Admissão não pode receber valor vazio.' })
  @IsDateString()
  admission: Date;

  @ApiProperty({default: 'Auxiliar de produção'})
  @IsString({ message: 'Cargo não está definido como string.' })
  @IsNotEmpty({ message: 'Cargo não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role: string;

  @ApiProperty({default: 'Marcus Vinicius'})
  @IsString({ message: 'Name não está definido como string.' })
  @IsNotEmpty({ message: 'Name não pode receber valor ser vazio.' })
  name: string;

  @ApiProperty({default: '1º Turno'})
  @IsString({ message: 'Turno não está definido como string.' })
  @IsNotEmpty({ message: 'Turno não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift: string;

  @ApiProperty({default: 'Almoxarife'})
  @IsString({ message: 'Centro de custo não está definido como string.' })
  @IsNotEmpty({ message: 'Centro de custo não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter: string;

  @ApiProperty({default: 'Av. Paulista, 1000'})
  @IsString({ message: 'Endereço não está definido como string.' })
  @IsNotEmpty({ message: 'Endereço não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeePinDTO)
  @IsNotEmpty({ message: '[pin] O ponto de embarque deve ser preenchido.'})
  pin: CreateEmployeePinDTO;
}
