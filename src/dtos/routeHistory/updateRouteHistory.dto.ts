import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateRouteHistoryDTO {
  @IsString()
  @IsOptional()
  process?: string

  @IsString()
  @MaxLength(15)
  @IsOptional()
  product?: string

  @IsString()
  @IsOptional()
  sequenceQr?: number

  @MinLength(2)
  @MaxLength(3)
  @IsOptional()
  type?: string
}
