import { IsString, IsEnum, MinLength, MaxLength, IsNotEmpty } from "class-validator";

export class CreatePinDTO {
  @IsString({message : "Descrição tem que ser do tipo string"})
  @IsNotEmpty({message : "Descrição não pode ser vazia"})
  description: string

  @IsString({message : "Rua tem que ser do tipo string"})
  @IsNotEmpty({message : "Rua não pode ser vazia"})
  street : string
  
  
  @IsString({message : "Latitude tem que ser do tipo string"})
  @IsNotEmpty({message : "Latitude não pode ser vazia"})
  lat: string 

 
  @IsString({message : "Longitude tem que ser do tipo string"})
  @IsNotEmpty({message : "Longitude não pode ser vazia"})
  long: string
}
