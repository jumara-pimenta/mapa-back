import { IsString, IsNotEmpty } from "class-validator";

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

  @IsString()
  @IsNotEmpty()
  validation: string

  @IsString()
  @IsNotEmpty()
  category: string
}
