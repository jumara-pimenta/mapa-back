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
  @IsString({ message: 'Registration não está definido como string.' })
  @IsNotEmpty({ message: 'Registration não pode receber valor ser vazio.' })
  registration: string;

  @IsString({ message: 'Cpf não está definido como string.' })
  @IsNotEmpty({ message: 'Registration não pode receber valor ser vazio.' })
  @MinLength(11, { message: 'CPF nao pode conter menos que 11 digitos.' })
  @MaxLength(11, { message: 'CPF nao pode conter mais que 11 digitos.' })
  cpf: string;

  // @Length(10, 20)
  @IsString({ message: 'RG não está definido como string.' })
  @IsNotEmpty({ message: 'Registration não pode receber valor ser vazio.' })
  @MinLength(8, { message: 'Rg nao pode conter menos que 7 digitos.' })
  @MaxLength(10, { message: 'Rg nao pode conter mais que 10 digitos.' })
  rg: string;

  @IsString({ message: 'Admission não está definido como string.' })
  @IsNotEmpty({ message: 'Admission não pode receber valor ser vazio.' })
  @IsDateString({ message: 'Admission não está definido como DateString.' })
  admission: Date;

  @IsString({ message: 'Role não está definido como string.' })
  @IsNotEmpty({ message: 'Role não pode receber valor ser vazio.' })
  role: string;

  @IsString({ message: 'Name não está definido como string.' })
  @IsNotEmpty({ message: 'Name não pode receber valor ser vazio.' })
  name: string;

  @IsString({ message: 'Shift não está definido como string.' })
  @IsNotEmpty({ message: 'Shift não pode receber valor ser vazio.' })
  shift: string;

  @IsString({ message: 'CostCenter não está definido como string.' })
  @IsNotEmpty({ message: 'CostCenter não pode receber valor ser vazio.' })
  costCenter: string;

  @IsString({ message: 'Address não está definido como string.' })
  @IsNotEmpty({ message: 'Address não pode receber valor ser vazio.' })
  address: string;
}
