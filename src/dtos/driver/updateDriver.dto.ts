import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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

  @IsString()
  @IsOptional()
  validation?: string

  @IsString()
  @IsOptional()
  category?: string
}
