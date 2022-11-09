import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePinDTO {
  @IsString()
  @IsNotEmpty()
  description?: string

  @IsString()
  @IsNotEmpty()
  lat?: string 

  @IsString()
  @IsNotEmpty()
  long?: string
}
