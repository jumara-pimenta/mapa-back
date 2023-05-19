import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { passwordRgx } from 'src/utils/Regex';

export class FirstAccessDriverDTO {
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


  @IsString({ message: '[password] O campo password deve ser alfanumérico.'})
  @IsNotEmpty({ message: '[password] O campo password deve ser preenchido.' })
  @Length(7, 100, { message: '[password] O campo password deve conter mais de 7 caracteres.' })
  @Matches(passwordRgx, {message: '[password] Este campo deve conter pelo menos um caractere especial e um caractere maiúsculo.'})
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string

  @IsString({ message: '[confirmPassword] O campo confirmPassword deve ser alfanumérico.'})
  @IsNotEmpty({ message: '[confirmPassword] O campo confirmPassword deve ser preenchido.' })
  @Matches(passwordRgx, {message: '[confirmPassword] Este campo deve conter pelo menos um caractere especial e um caractere maiúsculo.'})
  @Transform(({ value }: TransformFnParams) => value?.trim())
  confirmPassword: string

}
