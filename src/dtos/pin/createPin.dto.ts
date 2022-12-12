import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreatePinDTO {
  @IsString({ message: 'Descrição tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Descrição não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @IsString({ message: 'Rua tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Rua não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  street: string;

  @IsString({ message: 'Latitude tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Latitude não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lat: string;

  @IsString({ message: 'Longitude tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Longitude não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  long: string;
}
