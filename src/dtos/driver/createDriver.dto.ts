import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, IsDateString, Length } from 'class-validator';

export class CreateDriverDTO {
  @ApiProperty()
  @IsString({ message: '[name] O campo NAME deve ser do tipo string.' })
  @IsNotEmpty({ message: '[name] O campo NAME deve ser preenchido.' })
  @Length(10, 255, {
    message: '[name] O campo NAME deve conter no mínimo 10 caracteres.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @ApiProperty()
  @IsString({ message: '[cpf] O campo CPF deve ser do tipo string.' })
  @IsNotEmpty({ message: '[cpf] O campo CPF deve ser preenchido.' })
  @Length(11, 11, { message: '[cpf] O campo CPF deve conter 11 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  cpf: string;

  @ApiProperty()
  @IsString({ message: '[cnh] O campo CNH deve ser do tipo string.' })
  @IsNotEmpty({ message: '[cnh] O campo CNH deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  cnh: string;

  @ApiProperty()
  @IsDateString(
    {},
    {
      message: '[validation] O campo VALIDATION deve ser do tipo Date valido.',
    },
  )
  @ApiProperty()
  @IsNotEmpty({
    message: '[validation] O campo VALIDATION deve ser preenchido.',
  })
  validation: Date;

  @ApiProperty()
  @IsString({ message: '[category] O campo CATEGORY deve ser do tipo string.' })
  @IsNotEmpty({ message: '[category] O campo CATEGORY deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 2)
  category: string;
}
