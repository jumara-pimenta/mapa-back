import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, IsLongitude, IsLatitude } from 'class-validator';

export class CreatePinDTO {
  @ApiProperty({
    default: 'Título do local',
    type: 'string',
    description: 'Título do Ponto de Embarque',
  })
  @IsString({ message: '[title] O título deve ser do tipo string.' })
  @IsNotEmpty({ message: '[title] O título deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @ApiProperty({
    default:
      'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',
    description: 'Local do Ponto de Embarque',
  })
  @IsString({ message: '[local] O local deve ser do tipo string.' })
  @IsNotEmpty({ message: '[local] O local deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  local: string;

  @ApiProperty({
    default: 'Detalhes do local',
    description: 'Detalhes do local do Ponto de Embarque',
  })
  @IsString({
    message: '[details] O campo de detalhes deve ser do tipo string.',
  })
  @IsNotEmpty({ message: '[details] O campo de detalhes deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  details: string;

  @ApiProperty({
    default: '-60.0261',
    description: 'Latitude do Ponto de Embarque',
  })
  @IsLatitude({ message: '[lat] A latitude deve ser do tipo string.' })
  @IsNotEmpty({ message: '[lat] A latitude deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lat: string;

  @ApiProperty({
    default: '-3.10719',
    description: 'Longitude do Ponto de Embarque',
  })
  @IsLongitude({ message: '[lng] A longitude deve ser do formato correto.' })
  @IsNotEmpty({ message: '[lng] A longitude deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lng: string;
}
