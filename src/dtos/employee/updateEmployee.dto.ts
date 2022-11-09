import { IsDate, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateEmployeeDTO {
  @IsString()
  @IsOptional()
  registration?: string

  @IsString()
  @IsOptional()
  cpf?: string

  @IsString()
  @IsOptional()
  rg?: string

  @IsString()
  @IsDate()
  @IsOptional()
  admission?: Date

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  role?: string

  @IsString()
  @IsOptional()
  shift?: string

  @IsString()
  @IsOptional()
  costCenter?: string

  @IsString()
  @IsOptional()
  address?: string

}
