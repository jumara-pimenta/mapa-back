import { IsBoolean, IsDefined, IsEnum, IsNotEmpty, Matches } from "class-validator"
import { ETypePath } from "../../utils/ETypes"
import { durationPathRgx } from "../../utils/Regex"

export class PathDetailsDTO {
  @IsEnum(ETypePath)
  @IsNotEmpty()
  type: ETypePath

  @IsDefined()
  @Matches(durationPathRgx, {
    message: 'O valor informado é inválido. O formato esperado é HH:MM (ex. 08:30)!'
  })
  duration: string

  @IsDefined()
  @Matches(durationPathRgx)
  startsAt: string

  @IsBoolean()
  @IsNotEmpty()
  isAutoRoute: boolean
}