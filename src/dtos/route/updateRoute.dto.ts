import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateRouteDTO {
  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  distance?: string

  @IsString()
  @IsOptional()
  type?: string

  @IsString()
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  driverId?: string

  @IsString()
  @IsOptional()
  vehicleId?: string
}
