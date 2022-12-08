import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePinDTO {

  @IsOptional()
  @IsString({message : "Descrição tem que ser do tipo string"})
  @IsNotEmpty({message : "Descrição não pode ser vazia"})
  description?: string

  @IsOptional()
  @IsString({message : "Rua tem que ser do tipo string"})
  @IsNotEmpty({message : "Rua não pode ser vazia"})
  street? : string
}
