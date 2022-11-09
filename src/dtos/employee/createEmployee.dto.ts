import { IsString, IsEnum, MinLength, MaxLength, IsNotEmpty, IsDate } from "class-validator";

export class CreateEmployeeDTO {
  @IsString()
  @IsNotEmpty()
  registration: string

  @IsString()
  @IsNotEmpty()
  cpf: string

  @IsString()
  @IsNotEmpty()
  rg: string

  @IsString()
  @IsNotEmpty()
  admission: string

  @IsString()
  @IsNotEmpty()
  role: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  shift: string

  @IsString()
  @IsNotEmpty()
  costCenter: string

  @IsString()
  @IsNotEmpty()
  address: string
}
