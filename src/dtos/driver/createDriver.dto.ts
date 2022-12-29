import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, IsDateString, Length } from 'class-validator';

export class CreateDriverDTO {
  @IsString({ message: '[name] O nome deve ser do tipo string.' })
  @IsNotEmpty({ message: '[name] O nome deve ser preenchido.' })
  @Length(10, 255, {
    message: '[name] O nome deve possuir no mínimo 10 caracteres.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsString({ message: '[cpf] O CPF deve ser do tipo string.' })
  @IsNotEmpty({ message: '[cpf] O CPF deve ser preenchido.' })
  @Length(11, 11, { message: '[cpf] O CPF deve conter 11 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  cpf: string;

  @IsString({ message: '[cnh] A CNH deve ser do tipo string.' })
  @IsNotEmpty({ message: '[cnh] A CNH deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  cnh: string;

  @IsDateString(
    {},
    {
      message: '[validation] A validade deve ser do tipo date.',
    },
  )
  @IsNotEmpty({
    message: '[validation] A validade deve ser preenchida.',
  })
  validation: Date;

  @IsString({ message: '[category] A categoria deve ser do tipo string.' })
  @IsNotEmpty({ message: '[category] A categoria deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 2)
  category: string;
}
