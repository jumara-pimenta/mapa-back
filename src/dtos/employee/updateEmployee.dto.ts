import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEmployeeDTO {
  @IsString({ message: 'Matrícula não está definida como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration?: string;

  @IsString({ message: 'CPF não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(11, { message: 'CPF não pode conter menos que 11 digitos.' })
  @MaxLength(11, { message: 'CPF não pode conter mais que 11 digitos.' })
  cpf?: string;

  @IsString({ message: 'Rg não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(8, { message: 'Rg não pode conter menos que 8 digitos.' })
  @MaxLength(11, { message: 'Rg não pode conter mais que 11 digitos.' })
  rg?: string;

  @IsOptional()
  @IsDateString({ message: 'Admission não está definido como DateString.' })
  admission?: Date;

  @IsString({ message: 'Name não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name?: string;

  @IsString({ message: 'Role não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role?: string;

  @IsString({ message: 'Shift não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift?: string;

  @IsString({ message: 'CostCenter não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter?: string;

  @IsString({ message: 'Address não está definido como string.' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address?: string;
}
