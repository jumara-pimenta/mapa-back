import { Type } from "class-transformer";
import { IsString, IsNotEmpty, ValidateNested, IsEnum } from "class-validator";
import { ETypePath, ETypeRoute } from "../../utils/ETypes";
import { PathDetailsDTO } from "../path/pathDetails.dto";

export class CreateRouteDTO {
  @IsString()
  @IsNotEmpty()
  description: string
  
  @IsEnum(ETypeRoute)
  @IsNotEmpty()
  type: ETypeRoute

  @IsString()
  @IsNotEmpty()
  status: string

  @IsString()
  @IsNotEmpty()
  driverId: string

  @IsString()
  @IsNotEmpty()
  vehicleId: string

  @IsString({ each: true })
  @IsNotEmpty()
  employeeIds: string[]

  @ValidateNested({ each: true })
  @Type(() => PathDetailsDTO)
  @IsNotEmpty()
  pathDetails: PathDetailsDTO
}
