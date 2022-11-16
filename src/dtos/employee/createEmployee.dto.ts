import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsDateString,
} from 'class-validator';
import { Employee } from 'src/entities/employee.entity';
// import { Unique } from './validator';

export class CreateEmployeeDTO {
  @IsString({ message: 'Matrícula não está definida como string.' })
  @IsNotEmpty({ message: 'Matrícula não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration: string;

  @IsString({ message: 'CPF não está definido como string.' })
  @IsNotEmpty({ message: 'CPF não pode receber valor vazio.' })
  @MinLength(11, { message: 'CPF não pode conter menos que 11 dígitos.' })
  @MaxLength(11, { message: 'CPF não pode conter mais que 11 dígitos.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  cpf: string;

  // @Length(10, 20)
  @IsString({ message: 'RG não está definido como string.' })
  @IsNotEmpty({ message: 'RG não pode receber valor vazio.' })
  @MinLength(8, { message: 'RG nao pode conter menos que 8 dígitos.' })
  @MaxLength(11, { message: 'RG nao pode conter mais que 11 dígitos.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  rg: string;

  @IsString({ message: 'Admission não está definido como string.' })
  @IsNotEmpty({ message: 'Admission não pode receber valor ser vazio.' })
  @IsDateString({ message: 'Admission não está definido como DateString.' })
  admission: Date;

  @IsString({ message: 'Cargo não está definido como string.' })
  @IsNotEmpty({ message: 'Cargo não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role: string;

  @IsString({ message: 'Nome não está definido como string.' })
  @IsNotEmpty({ message: 'Nome não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsString({ message: 'Turno não está definido como string.' })
  @IsNotEmpty({ message: 'Turno não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift: string;

  @IsString({ message: 'Centro de custo não está definido como string.' })
  @IsNotEmpty({ message: 'Centro de custo não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter: string;

  @IsString({ message: 'Endereço não está definido como string.' })
  @IsNotEmpty({ message: 'Endereço não pode receber valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address: string;
}
