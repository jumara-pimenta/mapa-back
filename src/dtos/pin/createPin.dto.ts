import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, IsLongitude, IsLatitude } from 'class-validator';

export class CreatePinDTO {
  @IsString({ message: '[title] O título deve ser do tipo string.' })
  @IsNotEmpty({ message: '[title] O título deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsString({ message: '[local] O local deve ser do tipo string.' })
  @IsNotEmpty({ message: '[local] O local deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  local: string;

  @IsString({ message: '[details] O campo de detalhes deve ser do tipo string.' })
  @IsNotEmpty({ message: '[details] O campo de detalhes deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  details: string;

  @IsLatitude({ message: '[lat] A latitude deve ser do tipo string.'})
  @IsNotEmpty({ message: '[lat] A latitude deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lat: string;

  @IsLongitude({ message: '[lng] A longitude deve ser do tipo string.'})
  @IsNotEmpty({ message: '[lng] A longitude deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lng: string;
}
