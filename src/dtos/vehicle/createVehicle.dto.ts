import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDateString,
  Length,
} from 'class-validator';

export class CreateVehicleDTO {
  @ApiProperty({default: 'PHP1234', example: 'PHP1234'})
  @IsString({ message: '[plate] A placa deve ser do tipo string.' })
  @IsNotEmpty({ message: '[plate] A placa deve ser preenchida.' })
  @Length(7,7, { message: '[plate] A placa deve possuir 7 dígitos.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  plate: string;

  @ApiProperty({default: 'Expresso', example: 'Expresso'})
  @IsString({ message: 'Empresa não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Empresa não pode está vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company: string;

  @ApiProperty({default: 'ÔNIBUS', example: 'ÔNIBUS'})
  @IsString({ message: 'Tipo não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Tipo não pode está vazio.' })
  type: string;

  @ApiProperty({default: new Date(), example: new Date()})
  @IsString({
    message: 'Última vistoria não está definido para o tipo string.',
  })
  lastSurvey: Date;

  @ApiProperty({default: new Date(), example: new Date()})
  @IsString({ message: 'Expiração não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Expiração não pode está vazio.' })
  expiration: string;

  @ApiProperty({default: 28, example: 28})
  @IsNumber()
  @IsNotEmpty({ message: 'Capacidade não pode está vazio.' })
  capacity: number;

  @ApiProperty({default: '12345678901', example: '12345678901'})
  @IsString({ message: '[renavam] O RENAVAM deve ser do tipo string.' })
  @IsNotEmpty({ message: '[renavam] O RENAVAM deve ser preenchido.' })
  @Length(11,11, { message: '[renavam] O RENAVAM deve possuir 11 dígitos.' })
  renavam: string;

  @ApiProperty({default: new Date(), example: new Date()})
  @IsDateString()
  @IsNotEmpty({ message: '[lastMaintenance] Última manutenção não pode está vazio.' })
  lastMaintenance: string;

  @ApiProperty({default: 'Teste', example: 'Teste'})
  @IsString({ message: '[note] O campo de observação deve ser do tipo string.' })
  @IsNotEmpty({ message: '[note] O campo de observação deve ser preenchido.' })
  note: string;

  @ApiProperty({default: true, example: true})
  @IsBoolean({
    message:
      '[isAccessibility] O campo de acessibilidade deve ser do tipo booleano.',
  })
  @IsNotEmpty({
    message: '[isAccessibility] O campo de acessibilidade deve ser preenchido.',
  })
  isAccessibility: boolean;
}
