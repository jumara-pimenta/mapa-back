import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateVehicleDTO {
  @ApiProperty({ description: 'Placa do veículo' })
  @IsString({ message: '[plate] A placa deve ser do tipo texto.' })
  @Length(7, 7, { message: '[plate] A placa deve possuir 7 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  plate?: string;

  @ApiProperty({ description: 'Nome da empresa responsável pelo veículo' })
  @IsString({ message: '[company] O nome da empresa deve ser do tipo texto.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company?: string;

  @ApiProperty({ description: 'Tipo do veículo' })
  @IsString({ message: '[type] O tipo deve ser do tipo texto.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  type?: string;

  @ApiProperty({ description: 'Data da última vistoria do veículo' })
  @IsDateString(
    {},
    { message: '[lastSurvey] A última vistoria deve ser do tipo data.' },
  )
  @IsOptional()
  lastSurvey?: Date;

  @ApiProperty({ description: 'Data de expiração da vistoria do veículo' })
  @IsDateString(
    {},
    { message: '[expiration] A expiração deve ser do tipo data.' },
  )
  @IsOptional()
  expiration?: Date;

  @ApiProperty({ description: 'Capacidade do veículo' })
  @IsNumber(
    { allowInfinity: true },
    { message: '[capacity] A capacidade deve ser do tipo número.' },
  )
  @IsOptional()
  capacity?: number;

  @ApiProperty({ description: 'Código Renavam do Veículo' })
  @IsString({ message: '[renavam] O RENAVAM deve ser do tipo texto.' })
  @Length(11, 11, {
    message: '[renavam] O RENAVAM deve possuir 11 caracteres.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  renavam?: string;

  @ApiProperty({ description: 'Data da última manutenção do veículo' })
  @IsDateString(
    {},
    { message: '[lastMaintenance] A última manutenção deve ser do tipo data.' },
  )
  @IsOptional()
  lastMaintenance?: Date;

  @ApiProperty({ description: 'Campo de observação' })
  @IsString({
    message: '[note] O campo de observação deve ser do tipo texto.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'Campo para informar se o veículo possui acessibilidade',
  })
  @IsBoolean({
    message: '[isAccessibility] A acessibilidade deve ser do tipo booleano.',
  })
  @IsOptional()
  isAccessibility?: boolean;
}
