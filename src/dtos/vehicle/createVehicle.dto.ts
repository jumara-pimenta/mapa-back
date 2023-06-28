import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDateString,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateVehicleDTO {
  @ApiProperty({
    default: 'PHP1234',
    example: 'PHP1234',
    description: 'Placa do veículo',
  })
  @IsString({ message: '[plate] A placa deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[plate] A placa deve ser preenchida.' })
  @Length(7, 7, { message: '[plate] A placa deve possuir 7 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  plate: string;

  @ApiProperty({
    default: 'Expresso',
    example: 'Expresso',
    description: 'Nome da empresa responsável pelo veículo',
  })
  @IsString({ message: '[company] O nome da empresa deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[company] O nome da empresa deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company: string;

  @ApiProperty({
    default: 'ÔNIBUS',
    example: 'ÔNIBUS',
    description: 'Tipo do veículo',
  })
  @IsString({ message: '[type] O tipo deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[type] O tipo deve ser preenchido.' })
  type: string;

  @ApiProperty({
    default: new Date(),
    example: new Date(),
    description: 'Data da última vistoria do veículo',
  })
  @IsDateString(
    {},
    { message: '[lastSurvey] A última vistoria deve ser do tipo data.' },
  )
  @IsOptional()
  lastSurvey?: Date;

  @ApiProperty({
    default: 28,
    example: 28,
    description: 'Data de expiração da vistoria do veículo',
  })
  @IsDateString(
    {},
    { message: '[expiration] A expiração deve ser do tipo data.' },
  )
  @IsNotEmpty({ message: '[expiration] A expiração deve ser preenchida.' })
  expiration: string;

  @ApiProperty({ default: 28, description: 'Capacidade do veículo' })
  @IsNumber(
    { allowInfinity: true },
    { message: '[capacity] A capacidade deve ser do tipo número.' },
  )
  @IsNotEmpty({ message: '[capacity] A capacidade deve ser preenchida.' })
  capacity: number;

  @ApiProperty({
    default: '12345678901',
    description: 'Código Renavam do Veículo',
  })
  @IsString({ message: '[renavam] O RENAVAM deve ser do tipo texto.' })
  @IsOptional()
  @Length(11, 11, {
    message: '[renavam] O RENAVAM deve possuir 11 caracteres.',
  })
  renavam?: string;

  @ApiProperty({
    default: new Date(),
    description: 'Data da última manutenção do veículo',
  })
  @IsDateString(
    {},
    { message: '[lastMaintenance] A última manutenção deve ser do tipo data.' },
  )
  @IsOptional()
  lastMaintenance?: Date;

  @ApiProperty({ default: 'Teste', description: 'Campo de observação' })
  @IsString({
    message: '[note] O campo de observação deve ser do tipo texto.',
  })
  @IsOptional()
  note?: string;

  @ApiProperty({
    default: true,
    description: 'Campo para informar se o veículo possui acessibilidade',
  })
  @IsBoolean({
    message:
      '[isAccessibility] O campo de acessibilidade deve ser do tipo booleano.',
  })
  @IsNotEmpty({
    message: '[isAccessibility] O campo de acessibilidade deve ser preenchido.',
  })
  isAccessibility: boolean;
}
