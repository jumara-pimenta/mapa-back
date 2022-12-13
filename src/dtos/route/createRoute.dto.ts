import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsString, IsNotEmpty, ValidateNested, IsEnum } from "class-validator";
import { ETypePath, ETypeRoute } from "../../utils/ETypes";
import { PathDetailsDTO } from "../path/pathDetails.dto";

export class CreateRouteDTO {
  @IsString({ message: '[Description] não está definida como string.' })
  @IsNotEmpty({ message: '[Description] não pode receber um valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string
  
  @IsEnum(ETypeRoute, { message: '[Type] não está definida como enum.'})
  @IsNotEmpty({ message: '[Type] não pode receber um valor vazio.'})
  type: ETypeRoute

  @IsString({ message: '[DriverId] não está definida como string.'})
  @IsNotEmpty({ message: '[DriverId] não pode receber um valor vazio.'})
  driverId: string

  @IsString({ message: '[VehicleId] não está definida como string.'})
  @IsNotEmpty({ message: '[VehicleId] não pode receber um valor vazio.'})
  vehicleId: string

  @IsString({ each: true , message: '[EmployeeIds] não está definida como string.'})
  @IsNotEmpty({message: '[EmployeeIds] não pode receber um valor vazio.'})
  employeeIds: string[]

  @ValidateNested({ each: true, message: '[PathDetails] não está definida como PathDetailsDTO.' })
  @Type(() => PathDetailsDTO)
  @IsNotEmpty({ message: '[PathDetails] não pode receber um valor vazio.'})
  pathDetails: PathDetailsDTO
}
