import { IsString, IsEnum, MinLength, MaxLength, IsNotEmpty } from "class-validator";

export class CreatePinDTO {
  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  lat: string 

  @IsString()
  @IsNotEmpty()
  long: string
}
