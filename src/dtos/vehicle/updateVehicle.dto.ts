import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateVehicleDTO {
  @IsString({ message: '[plate] A placa deve ser do tipo string.' })
  @Length(7, 7, { message: '[plate] A placa deve possuir 7 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  plate?: string;

  @IsString({ message: '[company] O nome da empresa deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company?: string;

  @IsString({ message: '[type] O tipo deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  type?: string;

  @IsDateString(
    {},
    { message: '[lastSurvey] A última vistoria deve ser do tipo date.' },
  )
  @IsOptional()
  lastSurvey?: Date;

  @IsDateString(
    {},
    { message: '[expiration] A expiração deve ser do tipo date.' },
  )
  @IsOptional()
  expiration?: Date;

  @IsNumber(
    { allowInfinity: true },
    { message: '[capacity] A capacidade deve ser do tipo number.' },
  )
  @IsOptional()
  capacity?: number;

  @IsString({ message: '[renavam] O RENAVAM deve ser do tipo string.' })
  @Length(11, 11, {
    message: '[renavam] O RENAVAM deve possuir 11 caracteres.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  renavam?: string;

  @IsDateString(
    {},
    { message: '[lastMaintenance] A última manutenção deve ser do tipo date.' },
  )
  @IsOptional()
  lastMaintenance?: Date;

  @IsString({
    message: '[note] O campo de observação deve ser do tipo string.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  note?: string;

  @IsBoolean({
    message: '[isAccessibility] A acessibilidade deve ser do tipo booleano.',
  })
  @IsOptional()
  isAccessibility?: boolean;
}
