import { IsEnum, IsOptional, IsString, MaxLength, MinLength, IsDateString } from "class-validator";

export class UpdateDriverDTO {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  cpf?: string

  @IsString()
  @IsOptional()
  cnh?: string

  @IsDateString()
  @IsOptional()
  validation?: Date

  @IsString()
  @IsOptional()
  category?: string
}
