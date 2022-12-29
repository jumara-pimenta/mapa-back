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
  @IsString({ message: '[plate] A placa deve ser do tipo string.' })
  @IsNotEmpty({ message: '[plate] A placa deve ser preenchida.' })
  @Length(7, 7, { message: '[plate] A placa deve possuir 7 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  plate: string;

  @IsString({ message: '[company] O nome da empresa deve ser do tipo string.' })
  @IsNotEmpty({ message: '[company] O nome da empresa deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company: string;

  @IsString({ message: '[type] O tipo deve ser do tipo string.' })
  @IsNotEmpty({ message: '[type] O tipo deve ser preenchido.' })
  type: string;

  @IsDateString(
    {},
    { message: '[lastSurvey] A última vistoria deve ser do tipo date.' },
  )
  @IsNotEmpty({
    message: '[lastSurvey] A última vistoria deve ser preenchida.',
  })
  lastSurvey: Date;

  @IsDateString(
    {},
    { message: '[expiration] A expiração deve ser do tipo date.' },
  )
  @IsNotEmpty({ message: '[expiration] A expiração deve ser preenchida.' })
  expiration: string;

  @IsNumber(
    { allowInfinity: true },
    { message: '[capacity] A capacidade deve ser do tipo number.' },
  )
  @IsNotEmpty({ message: '[capacity] A capacidade deve ser preenchida.' })
  capacity: number;

  @IsString({ message: '[renavam] O RENAVAM deve ser do tipo string.' })
  @IsNotEmpty({ message: '[renavam] O RENAVAM deve ser preenchido.' })
  @Length(11, 11, {
    message: '[renavam] O RENAVAM deve possuir 11 caracteres.',
  })
  renavam: string;

  @IsDateString(
    {},
    { message: '[lastMaintenance] A última manutenção deve ser do tipo date.' },
  )
  @IsNotEmpty({
    message: '[lastMaintenance] A última manutenção deve ser preenchida.',
  })
  lastMaintenance: Date;

  @IsString({
    message: '[note] O campo de observação deve ser do tipo string.',
  })
  @IsNotEmpty({ message: '[note] O campo de observação deve ser preenchido.' })
  note: string;

  @IsBoolean({
    message:
      '[isAccessibility] O campo de acessibilidade deve ser do tipo booleano.',
  })
  @IsNotEmpty({
    message: '[isAccessibility] O campo de acessibilidade deve ser preenchido.',
  })
  isAccessibility: boolean;
}
