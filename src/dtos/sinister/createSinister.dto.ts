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
    message: '[type] O campo tipo deve ser do tipo string.',
  })
  @IsNotEmpty({ message: '[type] O campo tipo deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  type: string;

  @ApiProperty({
    default: 'Descrição de como ocorreu o sinistro',
    example: 'Descrição de como ocorreu o sinistro',
    description: 'Descrição de como ocorreu o sinistro',
  })
  @IsString({
    message: '[description] O campo descrição deve ser do tipo string.',
  })
  @IsNotEmpty({
    message: '[description] O campo descrição deve ser preenchido.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @ApiProperty({
    default: 'Id do trajeto que ocorreu o sinistro',
    example: 'Id do trajeto que ocorreu o sinistro',
    description: 'Id do trajeto que ocorreu o sinistro',
  })
  @IsString({
    message: '[pathId] O campo Id do trajeto deve ser do tipo string.',
  })
  @IsNotEmpty({
    message: '[pathId] O campo Id do trajeto deve ser preenchido.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  pathId: string;
}
