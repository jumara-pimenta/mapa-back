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
  @IsString({ message: 'Placa não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Placa não pode está vazio.' })
  @MinLength(7, { message: 'Placa não pode conter menos que 7 dígitos.' })
  @MaxLength(7, { message: 'Placa não pode conter mais que 7 dígitos.' })
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
  @IsString({ message: 'Renavam não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Renavam não pode está vazio.' })
  @MinLength(11, { message: 'Renavam não pode conter menos que 11 dígitos.' })
  @MaxLength(11, { message: 'Renavam nao pode conter mais que 11 dígitos.' })
  renavam: string;

  @ApiProperty({default: new Date(), example: new Date()})
  @IsDateString()
  @IsNotEmpty({ message: 'Última manutenção não pode está vazio.' })
  lastMaintenance: string;

  @ApiProperty({default: 'Teste', example: 'Teste'})
  @IsString({ message: 'Observação não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Observação não pode está vazio.' })
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
