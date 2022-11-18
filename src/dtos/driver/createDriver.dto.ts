import { IsString, IsNotEmpty, IsDateString } from "class-validator";

export class CreateDriverDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  cpf: string

  @IsString()
  @IsNotEmpty()
  cnh: string

  @IsDateString()
  @IsNotEmpty()
  validation: Date

  @IsString()
  @IsNotEmpty()
  category: string
}
