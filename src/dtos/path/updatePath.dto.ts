import { IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { EStatusPath, ETypePath } from "src/utils/ETypes";

export class UpdatePathDTO {
  @IsString( { message: 'Description não está definida como string.' } )
  @IsOptional()
  process?: string

  @IsString( { message: 'Product não está definida como string.' } )
  @MaxLength(15, { message: 'Product não pode ter mais de 15 caracteres.' })
  @IsOptional()
  product?: string

  @IsString( { message: 'Sequence não está definida como string.' } )
  @IsOptional( { message: 'Sequence não pode receber um valor vazio.' } )
  sequenceQr?: number

  @IsEnum(ETypePath, { message: 'Type não está definida como enum.' })
  @IsOptional()
  type?: ETypePath

  @IsEnum(EStatusPath, { message: 'Status não está definida como enum.' })
  @IsOptional()
  status?: EStatusPath

  @IsOptional()
  @IsDateString( { message: 'StartedAt não está definida como date.' })
  startedAt?: Date

  @IsOptional()
  @IsDateString( { message: 'FinishedAt não está definida como date.' })
  finishedAt?: Date
}
