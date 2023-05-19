import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class resetDriverPasswordDTO {
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

}
