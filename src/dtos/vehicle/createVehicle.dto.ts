import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsDate } from "class-validator";

export class CreateVehicleDTO {
  @IsString()
  @IsNotEmpty()
  plate: string

  @IsString()
  @IsNotEmpty()
  company: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsString()
  @IsNotEmpty()
  lastSurvey: string

  @IsString()
  @IsNotEmpty()
  expiration: string

  @IsNumber()
  @IsNotEmpty()
  capacity: number

  @IsString()
  @IsNotEmpty()
  renavam: string

  @IsString()
  @IsNotEmpty()
  lastMaintenance: string

  @IsString()
  @IsNotEmpty()
  note: string

  @IsBoolean()
  @IsNotEmpty()
  isAccessibility: boolean
}
