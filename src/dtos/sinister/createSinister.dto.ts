import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSinisterDTO {
  @ApiProperty({
    default: 'Assalto no ponto de embarque',
    example: 'Assalto no ponto de embarque',
    description: 'Ocorrência de sinistro',
  })
  @IsString({
    message: '[type] O campo tipo deve ser do tipo texto.',
  })
  @IsNotEmpty({ message: '[type] O campo tipo deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(10, 100, {
    message: '[type] O tipo deve possuir, no mínimo, 10 caracteres e, no máximo, 100 caracteres.'
  })
  type: string;

  @ApiProperty({
    default: 'Descrição de como ocorreu o sinistro',
    example: 'Descrição de como ocorreu o sinistro',
    description: 'Descrição de como ocorreu o sinistro',
  })
  @IsString({
    message: '[description] O campo descrição deve ser do tipo texto.',
  })
  @IsNotEmpty({
    message: '[description] O campo descrição deve ser preenchido.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(5, 1000, {
    message: '[description] A descrição deve possuir, no mínimo, 5 caracteres e, no máximo, 1000 caracteres.'
  })
  description: string;

  @ApiProperty({
    default: 'Id do trajeto que ocorreu o sinistro',
    example: 'Id do trajeto que ocorreu o sinistro',
    description: 'Id do trajeto que ocorreu o sinistro',
  })
  @IsString({
    message: '[pathId] O campo Id do trajeto deve ser do tipo texto.',
  })
  @IsNotEmpty({
    message: '[pathId] O campo Id do trajeto deve ser preenchido.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  pathId: string;
}
