import { Type } from "class-transformer"
import { IsString, ValidateNested } from "class-validator"
import { UpdateEmployeesOnPathDTO } from "./updateEmployeesOnPath.dto"

export class WebsocketUpdateEmployeesStatusOnPathDTO {


  @IsString()
  routeId: string

  @IsString()
  employeeOnPathId: string

  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeesOnPathDTO)
  payload: UpdateEmployeesOnPathDTO
}