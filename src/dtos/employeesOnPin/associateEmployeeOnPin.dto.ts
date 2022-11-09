import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { ETypePin } from "src/utils/ETypes"

export class AssociateEmployeeOnPinDTO {
  @IsString()
  @IsNotEmpty()
  employeeId: string

  @IsString()
  @IsNotEmpty()
  pinId: string

  @IsEnum(ETypePin)
  @IsNotEmpty()
  type: ETypePin
}