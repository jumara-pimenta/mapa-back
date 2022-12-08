import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { ETypePin } from "../../utils/ETypes"

export class AssociateEmployeeOnPinDTO {
  @IsString( { message: 'EmployeeId não está definida como string.' } )
  @IsNotEmpty( { message: 'EmployeeId não pode receber um valor vazio.' })
  employeeId: string

  @IsString( { message: 'PinId não está definida como string.' })
  @IsNotEmpty( { message: 'PinId não pode receber um valor vazio.' })
  pinId: string

  @IsEnum(ETypePin, { message: 'Type não está definida como enum.' })
  @IsNotEmpty( { message: 'Type não pode receber um valor vazio.' })
  type: ETypePin
}