import { IsNumber, IsOptional, IsString } from "class-validator"

export class FiltersPathDTO {
  sequenceQr?: number
  process?: string
  type?: string
  product?: string
}
