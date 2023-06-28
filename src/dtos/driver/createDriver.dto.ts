import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  Length,
  IsEnum,
} from 'class-validator';
import { ETypeCategoryDrivers } from '../../utils/ETypes';

export class CreateDriverDTO {
  @ApiProperty({
    default: 'João da Silva Gomes',
    example: 'João da Silva Gomes',
    description: 'Nome do motorista',
  })
  @IsString({
    message: '[name] O campo nome deve ser do tipo texto.',
  })
  @IsNotEmpty({ message: '[name] O campo nome deve ser preenchido.' })
  @Length(10, 255, {
    message: '[name] O nome deve possuir no mínimo 10 caracteres.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @ApiProperty({
    default: '96893908564',
    example: '96893908564',
    description: 'CPF do motorista',
  })
  @IsString({ message: '[cpf] O campo CPF deve ser alfanumérico.' })
  @IsNotEmpty({ message: '[cpf] O campo CPF deve ser preenchido.' })
  @Length(11, 11, { message: '[cpf] O campo CPF deve conter 11 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  cpf: string;

  @ApiProperty({
    default: '123456789',
    example: '123456789',
    description: 'CNH do motorista',
  })
  @IsString({ message: '[cnh] O campo CNH deve ser alfanumérico.' })
  @IsNotEmpty({ message: '[cnh] O campo CNH deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  cnh: string;

  @ApiProperty({
    default: new Date(),
    example: new Date(),
    description: 'Data de validade da CNH do motorista',
  })
  @IsDateString(
    {},
    {
      message: '[validation] A validade deve ser do tipo data.',
    },
  )
  @ApiProperty({ default: new Date(), example: new Date() })
  @IsNotEmpty({
    message: '[validation] A validade deve ser preenchida.',
  })
  validation: Date;

  @ApiProperty({
    default: 'C',
    example: 'D',
    description: 'Categoria da CNH do motorista',
  })
  @IsEnum(ETypeCategoryDrivers, {
    message: '[category] A categoria deve ser as opções C, D ou E',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: '[category] O campo categoria deve ser preenchido.' })
  @Length(1, 2, { message: 'A categoria deve ser as opções C, D ou E' })
  category: ETypeCategoryDrivers;
}
