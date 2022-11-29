import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { EStatusPath, ETypePath } from "src/utils/ETypes";

export class UpdatePathDTO {
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

  @IsEnum(ETypePath)
  @IsOptional()
  type?: ETypePath

  @IsEnum(EStatusPath)
  @IsOptional()
  status?: EStatusPath
}
