import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSinisterDTO {
  @ApiProperty({
    default: 'Assalto no ponto de embarque',
    example: 'Assalto no ponto de embarque',
    description: 'Ocorrência de sinistro',
  })
  @IsString({
    message: '[type] O campo TYPE deve ser do tipo string.',
  })
  @IsNotEmpty({ message: '[type] O campo TYPE deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  type: string;

  @ApiProperty({
    default: 'Descrição de como ocorreu o sinistro',
    example: 'Descrição de como ocorreu o sinistro',
    description: 'Descrição de como ocorreu o sinistro',
  })
  @IsString({
    message: '[description] O campo DESCRIPTION deve ser do tipo string.',
  })
  @IsNotEmpty({
    message: '[description] O campo DESCRIPTION deve ser preenchido.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;
}
