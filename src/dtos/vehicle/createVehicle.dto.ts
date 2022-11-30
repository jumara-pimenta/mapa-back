import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDate,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateVehicleDTO {
  @IsString({ message: 'Placa não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Placa não pode está vazio.' })
  @MinLength(7, { message: 'Placa não pode conter menos que 7 dígitos.' })
  @MaxLength(7, { message: 'Placa não pode conter mais que 7 dígitos.' })
  plate: string;

  @IsString({ message: 'Empresa não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Empresa não pode está vazio.' })
  company: string;

  @IsString({ message: 'Tipo não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Tipo não pode está vazio.' })
  type: string;

  @IsDateString({
    message: 'Última manutenção não está no formato certo de data.',
  })
  @IsNotEmpty({ message: 'Última vistoria não pode está vazio.' })
  lastSurvey: string;

  @IsDateString({ message: 'Expiração não está no formato certo de data.' })
  @IsNotEmpty({ message: 'Expiração não pode está vazio.' })
  expiration: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Capacidade não pode está vazio.' })
  capacity: number;

  @IsString({ message: 'Renavam não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Renavam não pode está vazio.' })
  @MinLength(11, { message: 'Renavam não pode conter menos que 11 dígitos.' })
  @MaxLength(11, { message: 'Renavam nao pode conter mais que 11 dígitos.' })
  renavam: string;

  @IsDateString({
    message: 'Última manutenção não está no formato certo de data.',
  })
  @IsNotEmpty({ message: 'Última manutenção não pode está vazio.' })
  lastMaintenance: string;

  @IsString({ message: 'Observação não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Observação não pode está vazio.' })
  note: string;

  @IsBoolean({
    message: 'Acessibilidade não está definido para o tipo tipo booleans.',
  })
  @IsNotEmpty({ message: 'Acessibilidade não pode está vazio.' })
  isAccessibility: boolean;
}
