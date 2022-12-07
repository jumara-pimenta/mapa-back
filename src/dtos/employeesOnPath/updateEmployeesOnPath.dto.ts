import { IsBoolean, IsDate, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateEmployeesOnPathDTO {
  @IsString()
  @IsOptional()
  process?: string

  @IsString()
  @MaxLength(15)
  @IsOptional()
  product?: string

  @IsString()
  @IsOptional()
  sequenceQr?: number

  @MinLength(2)
  @MaxLength(3)
  @IsOptional()
  type?: string

  @IsBoolean()
  confirmation?: boolean

  @IsDate()
  @IsOptional()
  boardingAt?: Date

  @IsDate()
  @IsOptional()
  disembarkAt?: Date
  
  @IsString()
  @IsOptional()
  description?: string
}
