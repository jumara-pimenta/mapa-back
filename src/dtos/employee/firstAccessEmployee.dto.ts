import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, Length, Matches, IsNumberString } from 'class-validator';
import { passwordRgx } from 'src/utils/Regex';

export class FirstAccessEmployeeDTO {
  @ApiProperty({ default: `${faker.random.numeric(6)}` })
  @IsNumberString(
    {},
    { message: '[registration] A matrícula deve ser do tipo texto.' },
)
  @IsNotEmpty({ message: '[registration] A matrícula deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration: string;

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
