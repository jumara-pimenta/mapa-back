import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateVehicleDTO {
  @IsString({ message: 'Plate não está definido para o tipo string.' })
  @IsOptional()
  @MinLength(7, { message: 'Plate nao pode conter menos que 7 digitos.' })
  @MaxLength(7, { message: 'Plate nao pode conter mais que 7 digitos.' })
  plate?: string;

  @IsString({ message: 'Company não está definido para o tipo string.' })
  @IsOptional()
  company?: string;

  @IsString({ message: 'Type não está definido para o tipo string.' })
  @IsOptional()
  type?: string;

  @IsDateString()
  @IsOptional()
  lastSurvey?: Date;

  @IsDateString()
  @IsOptional()
  expiration?: Date;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString({ message: 'Renavam não está definido para o tipo string.' })
  @IsOptional()
  @MinLength(11, { message: 'Renavam nao pode conter menos que 11 digitos.' })
  @MaxLength(11, { message: 'Renavam nao pode conter mais que 11 digitos.' })
  renavam?: string;

  @IsDateString()
  @IsOptional()
  lastMaintenance?: Date;

  @IsString({ message: 'note não está definido para o tipo string.' })
  @IsOptional()
  note?: string;

  @IsBoolean()
  @IsOptional()
  isAccessibility?: boolean;
}
