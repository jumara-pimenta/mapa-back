import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString({ message: '[plate] A placa deve ser do tipo string.' })
  @Length(7, 7, { message: '[plate] A placa deve possuir 7 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  plate?: string;
  
  @ApiProperty()
  @IsString({ message: '[company] O nome da empresa deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company?: string;
  
  @ApiProperty()
  @IsString({ message: '[type] O tipo deve ser do tipo string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  type?: string;
  
  @ApiProperty()
  @IsDateString(
    {},
    { message: '[lastSurvey] A última vistoria deve ser do tipo date.' },
  )
  @IsOptional()
  lastSurvey?: Date;
  
  @ApiProperty()
  @IsDateString(
    {},
    { message: '[expiration] A expiração deve ser do tipo date.' },
  )
  @IsOptional()
  expiration?: Date;
  
  @ApiProperty()
  @IsNumber(
    { allowInfinity: true },
    { message: '[capacity] A capacidade deve ser do tipo number.' },
  )
  @IsOptional()
  capacity?: number;
  
  @ApiProperty()
  @IsString({ message: '[renavam] O RENAVAM deve ser do tipo string.' })
  @Length(11, 11, {
    message: '[renavam] O RENAVAM deve possuir 11 caracteres.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  renavam?: string;
  
  @ApiProperty()
  @IsDateString(
    {},
    { message: '[lastMaintenance] A última manutenção deve ser do tipo date.' },
  )
  @IsOptional()
  lastMaintenance?: Date;
  
  @ApiProperty()
  @IsString({
    message: '[note] O campo de observação deve ser do tipo string.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  note?: string;

  @ApiProperty()
  @IsBoolean({
    message: '[isAccessibility] A acessibilidade deve ser do tipo booleano.',
  })
  @IsOptional()
  isAccessibility?: boolean;
}
