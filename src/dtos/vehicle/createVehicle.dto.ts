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
  @Length(7, 7, { message: '[plate] A placa deve possuir 7 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  plate: string;

  @ApiProperty({default: 'Expresso', example: 'Expresso'})
  @IsString({ message: '[company] O nome da empresa deve ser do tipo string.' })
  @IsNotEmpty({ message: '[company] O nome da empresa deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company: string;

  @ApiProperty({default: 'ÔNIBUS', example: 'ÔNIBUS'})
  @IsString({ message: '[type] O tipo deve ser do tipo string.' })
  @IsNotEmpty({ message: '[type] O tipo deve ser preenchido.' })
  type: string;

  @ApiProperty({default: new Date(), example: new Date()})
  @IsDateString(
    {},
    { message: '[lastSurvey] A última vistoria deve ser do tipo date.' },
  )
  @IsNotEmpty({
    message: '[lastSurvey] A última vistoria deve ser preenchida.',
  })
  lastSurvey: Date;

  @ApiProperty({default: 28, example: 28})
  @IsDateString(
    {},
    { message: '[expiration] A expiração deve ser do tipo date.' },
  )
  @IsNotEmpty({ message: '[expiration] A expiração deve ser preenchida.' })
  expiration: string;

  @ApiProperty({default: 28})
  @IsNumber(
    { allowInfinity: true },
    { message: '[capacity] A capacidade deve ser do tipo number.' },
  )
  @IsNotEmpty({ message: '[capacity] A capacidade deve ser preenchida.' })
  capacity: number;

  @ApiProperty({default: '12345678901'})
  @IsString({ message: '[renavam] O RENAVAM deve ser do tipo string.' })
  @IsNotEmpty({ message: '[renavam] O RENAVAM deve ser preenchido.' })
  @Length(11, 11, {
    message: '[renavam] O RENAVAM deve possuir 11 caracteres.',
  })
  renavam: string;

  @ApiProperty({default: new Date()})
  @IsDateString(
    {},
    { message: '[lastMaintenance] A última manutenção deve ser do tipo date.' },
  )
  @IsNotEmpty({
    message: '[lastMaintenance] A última manutenção deve ser preenchida.',
  })
  lastMaintenance: Date;

  @ApiProperty({default: 'Teste'})
  @IsString({
    message: '[note] O campo de observação deve ser do tipo string.',
  })
  @IsNotEmpty({ message: '[note] O campo de observação deve ser preenchido.' })
  note: string;

  @ApiProperty({default: true})
  @IsBoolean({
    message:
      '[isAccessibility] O campo de acessibilidade deve ser do tipo booleano.',
  })
  @IsNotEmpty({
    message: '[isAccessibility] O campo de acessibilidade deve ser preenchido.',
  })
  isAccessibility: boolean;
}
