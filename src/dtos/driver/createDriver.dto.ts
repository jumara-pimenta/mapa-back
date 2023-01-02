import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, IsDateString, Length } from 'class-validator';

export class CreateDriverDTO {
  @ApiProperty({ default: 'João da Silva',example: 'João da Silva'})
  @IsString({ message: '[name] O campo NAME deve ser do tipo string.' })
  @IsNotEmpty({ message: '[name] O campo NAME deve ser preenchido.' })
  @Length(10, 255, {
    message: '[name] O campo NAME deve conter no mínimo 10 caracteres.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @ApiProperty({ default: '96893908563',example: '96893908563'})
  @IsString({ message: '[cpf] O campo CPF deve ser do tipo string.' })
  @IsNotEmpty({ message: '[cpf] O campo CPF deve ser preenchido.' })
  @Length(11, 11, { message: '[cpf] O campo CPF deve conter 11 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  cpf: string;

  @ApiProperty({ default: '123456789',example: '123456789'})
  @IsString({ message: '[cnh] O campo CNH deve ser do tipo string.' })
  @IsNotEmpty({ message: '[cnh] O campo CNH deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  cnh: string;

  @ApiProperty({ default: new Date(), example: new Date()})
  @IsDateString(
    {},
    {
      message: '[validation] O campo VALIDATION deve ser do tipo Date valido.',
    },
  )
  @ApiProperty({ default: new Date(), example: new Date()})
  @IsNotEmpty({
    message: '[validation] O campo VALIDATION deve ser preenchido.',
  })
  validation: Date;

  @ApiProperty({ default: 'AB',example: 'AB'})
  @IsString({ message: '[category] O campo CATEGORY deve ser do tipo string.' })
  @IsNotEmpty({ message: '[category] O campo CATEGORY deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 2)
  category: string;
}