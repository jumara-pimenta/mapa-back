import { IsDateString, IsEnum, IsOptional, IsString, Matches } from "class-validator";
import { EStatusPath } from "../../utils/ETypes";

const DurationRgx = new RegExp(/^[0-9]{2}:[0-9]{2}/gm);
const StartsAtRgx = new RegExp(/^[0-9]{2}:[0-9]{2}/gm);

export class UpdatePathDTO {
  @Matches(DurationRgx)
  @IsOptional()
  duration?: string

  @Matches(StartsAtRgx)
  @IsOptional()
  startsAt?: string

  @IsDateString()
  @IsOptional()
  startedAt?: Date

  @IsEnum(EStatusPath)
  @IsOptional()
  status?: EStatusPath;
}
