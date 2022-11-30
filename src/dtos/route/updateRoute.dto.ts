import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { EStatusRoute, ETypeRoute } from "src/utils/ETypes";

export class UpdateRouteDTO {
  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  distance?: string

  @IsEnum(ETypeRoute)
  @IsOptional()
  type?: ETypeRoute

  @IsEnum(EStatusRoute)
  @IsOptional()
  status?: EStatusRoute

  @IsString()
  @IsOptional()
  driverId?: string

  @IsString()
  @IsOptional()
  vehicleId?: string
}
