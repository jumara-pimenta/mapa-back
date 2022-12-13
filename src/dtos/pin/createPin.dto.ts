import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePinDTO {
  @IsString({ message: 'Título tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Título não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsString({ message: 'Local tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Local não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  local: string;

  @IsString({ message: 'Detalhes tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Detalhes não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  details: string;

  @IsString({ message: 'Latitude tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Latitude não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lat: string;

  @IsString({ message: 'Longitude tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Longitude não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lng: string;
}
