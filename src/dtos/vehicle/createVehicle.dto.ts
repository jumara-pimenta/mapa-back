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
  @IsString({ message: 'Plate não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Plate não pode esta vazio.' })
  @MinLength(7, { message: 'Plate nao pode conter menos que 7 digitos.' })
  @MaxLength(7, { message: 'Plate nao pode conter mais que 7 digitos.' })
  plate: string;

  @IsString({ message: 'Company não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Company não pode esta vazio.' })
  company: string;

  @IsString({ message: 'Type não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Type não pode esta vazio.' })
  type: string;

  @IsDateString({ message: 'LastSurvey não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'LastSurvey não pode esta vazio.' })
  lastSurvey: string;

  @IsDateString({ message: 'Expiration não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Expiration não pode esta vazio.' })
  expiration: string;

  @IsNumber()
  @IsNotEmpty({ message: 'capacity não pode esta vazio.' })
  capacity: number;

  @IsString({ message: 'Renavam não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Renavam não pode esta vazio.' })
  @MinLength(11, { message: 'Renavam nao pode conter menos que 11 digitos.' })
  @MaxLength(11, { message: 'Renavam nao pode conter mais que 11 digitos.' })
  renavam: string;

  @IsDateString({
    message: 'LastMaintenance não está definido para o tipo string.',
  })
  @IsNotEmpty({ message: 'LastMaintenance não pode esta vazio.' })
  lastMaintenance: string;

  @IsString({ message: 'Note não está definido para o tipo string.' })
  @IsNotEmpty({ message: 'Note não pode esta vazio.' })
  note: string;

  @IsBoolean({
    message: 'isAccessibility não está definido para o tipo tipo booleans.',
  })
  @IsNotEmpty({ message: 'isAccessibility não pode esta vazio.' })
  isAccessibility: boolean;
}
