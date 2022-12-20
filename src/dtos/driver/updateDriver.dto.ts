import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateDriverDTO {
  @IsString({ message: '[Name] não está definida como string.' })
  @IsOptional()
  name?: string;

  @IsString({ message: '[CPF] não está definida como string.' })
  @IsOptional()
  cpf?: string;

  @IsString({ message: '[CNH] não está definida como string.' })
  @IsOptional()
  cnh?: string;

  @IsDateString()
  @IsOptional()
  validation?: Date;

  @IsString({ message: '[Category] não está definida como string.' })
  @IsOptional()
  category?: string;
}
