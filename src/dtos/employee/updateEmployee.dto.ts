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
  registration?: string;

  @IsString({ message: 'CPF não está definido como string.' })
  @IsOptional()
  @MinLength(11, { message: 'CPF não pode conter menos que 11 digitos.' })
  @MaxLength(11, { message: 'CPF não pode conter mais que 11 digitos.' })
  cpf?: string;

  @IsString({ message: 'Rg não está definido como string.' })
  @IsOptional()
  @MinLength(8, { message: 'Rg nao pode conter menos que 9 digitos.' })
  @MaxLength(10, { message: 'Rg nao pode conter mais que 9 digitos.' })
  rg?: string;

  @IsOptional()
  @IsDateString({ message: 'Admission não está definido como DateString.' })
  admission?: Date;

  @IsString({ message: 'Name não está definido como string.' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Role não está definido como string.' })
  @IsOptional()
  role?: string;

  @IsString({ message: 'Shift não está definido como string.' })
  @IsOptional()
  shift?: string;

  @IsString({ message: 'CostCenter não está definido como string.' })
  @IsOptional()
  costCenter?: string;

  @IsString({ message: 'Address não está definido como string.' })
  @IsOptional()
  address?: string;
}
