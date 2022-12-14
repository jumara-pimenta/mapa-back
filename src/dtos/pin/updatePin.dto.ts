import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePinDTO {
  @IsOptional()
  @IsString({ message: 'Título tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Título não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsOptional()
  @IsString({ message: 'Local tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Local não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  local: string;

  @IsOptional()
  @IsString({ message: 'Detalhes tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Detalhes não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  details: string;
}
