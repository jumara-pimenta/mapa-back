import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePinDTO {
  @IsString( { message: 'Description não está definida como string.' } )
  @IsNotEmpty( { message: 'Description não pode receber um valor vazio.' })
  description?: string

  @IsString( { message: 'Latitude não está definida como string.' } )
  @IsNotEmpty( { message: 'Latitude não pode receber um valor vazio.' })
  lat?: string 

  @IsString( { message: 'Longitude não está definida como string.' } )
  @IsNotEmpty( { message: 'Longitude não pode receber um valor vazio.' })
  long?: string
}
