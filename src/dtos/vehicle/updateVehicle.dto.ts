import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateVehicleDTO {
  @IsString()
  @IsOptional()
  plate?: string

  @IsString()
  @IsOptional()
  company?: string

  @IsString()
  @IsOptional()
  type?: string

  @IsDate()
  @IsOptional()
  lastSurvey?: Date

  @IsDate()
  @IsOptional()
  expiration?: Date

  @IsNumber()
  @IsOptional()
  capacity?: number

  @IsString()
  @IsOptional()
  renavam?: string

  @IsDate()
  @IsOptional()
  lastMaintenance?: Date

  @IsString()
  @IsOptional()
  note?: string

  @IsString()
  @IsBoolean()
  @IsOptional()
  isAccessibility?: boolean
}
