import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsDateString,
} from 'class-validator';

export class CreateEmployeeDTO {
  @IsString({ message: 'Matrícula não está definida como string.' })
  @IsNotEmpty({ message: 'Matrícula não pode receber valor vazio.' })
  registration: string;

  @IsString({ message: 'CPF não está definido como string.' })
  @IsNotEmpty({ message: 'CPF não pode receber valor vazio.' })
  @MinLength(11, { message: 'CPF não pode conter menos que 11 dígitos.' })
  @MaxLength(11, { message: 'CPF não pode conter mais que 11 dígitos.' })
  cpf: string;

  @IsString({ message: 'RG não está definido como string.' })
  @IsNotEmpty({ message: 'RG não pode receber valor vazio.' })
  @MinLength(9, { message: 'RG nao pode conter menos que 9 dígitos.' })
  @MaxLength(11, { message: 'RG nao pode conter mais que 9 dígitos.' })
  rg: string;

  @IsString({ message: 'Admissão não está definido como string.' })
  @IsNotEmpty({ message: 'Admissão não pode receber valor vazio.' })
  @IsDateString({ message: 'Admissão não está definido como DateString.' })
  admission: Date;

  @IsString({ message: 'Cargo não está definido como string.' })
  @IsNotEmpty({ message: 'Cargo não pode receber valor vazio.' })
  role: string;

  @IsString({ message: 'Nome não está definido como string.' })
  @IsNotEmpty({ message: 'Nome não pode receber valor vazio.' })
  name: string;

  @IsString({ message: 'Turno não está definido como string.' })
  @IsNotEmpty({ message: 'Turno não pode receber valor vazio.' })
  shift: string;

  @IsString({ message: 'Centro de custo não está definido como string.' })
  @IsNotEmpty({ message: 'Centro de custo não pode receber valor vazio.' })
  costCenter: string;

  @IsString({ message: 'Endereço não está definido como string.' })
  @IsNotEmpty({ message: 'Endereço não pode receber valor vazio.' })
  address: string;
}
