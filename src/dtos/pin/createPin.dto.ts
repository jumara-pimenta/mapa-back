import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, IsLongitude, IsLatitude } from 'class-validator';

export class CreatePinDTO {
  @ApiProperty({default: 'Título do local', type: 'string'})
  @IsString({ message: 'Título tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Título não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @ApiProperty({default: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil'})
  @IsString({ message: 'Local tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Local não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  local: string;

  @ApiProperty({default: 'Detalhes do local'})
  @IsString({ message: 'Detalhes tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Detalhes não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  details: string;

  @ApiProperty({default: '-60.0261'})
  @IsLatitude({ message: '[lat] A latitude deve ser do formato correto.'})
  @IsNotEmpty({ message: '[lat] A latitude deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lat: string;

  @ApiProperty({default: '-3.10719'})
  @IsLongitude({ message: '[lng] A longitude deve ser do formato correto.'})
  @IsNotEmpty({ message: '[lng] A longitude deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lng: string;
}
