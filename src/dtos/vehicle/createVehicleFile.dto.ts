import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateVehicleFileDTO {
  @ApiProperty({
    default: 'PHP1234',
    example: 'PHP1234',
    description: 'Placa do veículo',
  })
  @IsString({ message: '[plate] A placa deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[plate] A placa deve ser preenchida.' })
  @Length(7, 7, { message: '[plate] A placa deve possuir 7 caracteres.' })
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
  @IsNotEmpty({
    message: '[lastSurvey] A última vistoria deve ser preenchida.',
  })
  lastSurvey: Date;

  @ApiProperty({
    default: 28,
    example: 28,
    description: 'Data de vencimento da vistoria do veículo',
  })
  @IsNotEmpty({ message: '[expiration] A vencimento deve ser preenchida.' })
  expiration: Date;

  @ApiProperty({ default: 28, description: 'Capacidade do veículo' })
  @IsNotEmpty({ message: '[capacity] A capacidade deve ser preenchida.' })
  @IsNumber(
    { allowInfinity: true },
    { message: '[capacity] A capacidade deve ser do tipo número.' },
  )
  @Min(0, { message: '[capacity] A capacidade deve ser de no mínimo 0' })
  @Max(32, { message: '[capacity] A capacidade deve ser de no máximo 32' })
  capacity: number;

  @ApiProperty({
    default: '12345678901',
    description: 'Código Renavam do Veículo',
  })
  @IsString({ message: '[renavam] O RENAVAM deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[renavam] O RENAVAM deve ser preenchido.' })
  @Length(11, 11, {
    message: '[renavam] O RENAVAM deve possuir 11 caracteres.',
  })
  renavam: string;

  @ApiProperty({
    default: new Date(),
    description: 'Data da última manutenção do veículo',
  })
  @IsNotEmpty({
    message: '[lastMaintenance] A última manutenção deve ser preenchida.',
  })
  lastMaintenance: Date;

  @ApiProperty({ default: 'Teste', description: 'Campo de observação' })
  @IsString({
    message: '[note] O campo de observação deve ser do tipo texto.',
  })
  @IsNotEmpty({ message: '[note] O campo de observação deve ser preenchido.' })
  note: string;

  @ApiProperty({
    default: true,
    description: 'Campo para informar se o veículo possui acessibilidade',
  })
  @IsBoolean({
    message:
      '[isAccessibility] O campo de acessibilidade deve ser do tipo SIM ou NÃO',
  })
  @IsNotEmpty({
    message: '[isAccessibility] O campo de acessibilidade deve ser preenchido.',
  })
  isAccessibility: boolean;
}
