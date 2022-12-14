import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePinDTO {
  @IsOptional()
  @IsString({ message: 'Descrição tem que ser do tipo string' })
  @IsNotEmpty({ message: 'O campo Descrição não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo Rua não pode ser vazio' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  street?: string;
}
