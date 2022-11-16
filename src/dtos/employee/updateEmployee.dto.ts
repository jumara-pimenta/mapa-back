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
  @IsString({ message: 'Registration não está definido como string.' })
  @IsOptional()
  registration?: string;

  @IsString({ message: 'Registration não está definido como string.' })
  @IsOptional()
  @MinLength(11, { message: 'CPF nao pode conter menos que 11 digitos.' })
  @MaxLength(11, { message: 'CPF nao pode conter mais que 11 digitos.' })
  cpf?: string;

  @IsString({ message: 'Registration não está definido como string.' })
  @IsOptional()
  @MinLength(7, { message: 'Rg nao pode conter menos que 9 digitos.' })
  @MaxLength(10, { message: 'Rg nao pode conter mais que 9 digitos.' })
  rg?: string;

  @IsOptional()
  @IsDateString({ message: 'Registration não está definido como DateString.' })
  admission?: Date;

  @IsString({ message: 'Registration não está definido como string.' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Registration não está definido como string.' })
  @IsOptional()
  role?: string;

  @IsString({ message: 'Registration não está definido como string.' })
  @IsOptional()
  shift?: string;

  @IsString({ message: 'Registration não está definido como string.' })
  @IsOptional()
  costCenter?: string;

  @IsString({ message: 'Registration não está definido como string.' })
  @IsOptional()
  address?: string;
}
