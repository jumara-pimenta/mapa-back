import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBackofficeUserPasswordDTO {
  @IsEmail({}, { message: '[email] O e-mail deve ser do formato válido!' })
  @IsNotEmpty({ message: '[email] O e-mail deve ser preenchido!' })
  email: string;

  @IsString({ message: '[newPassword] A nova senha deve ser alfanumérica!' })
  @IsNotEmpty({ message: '[newPassword] A nova senha deve ser preenchida!' })
  newPassword: string;
}
