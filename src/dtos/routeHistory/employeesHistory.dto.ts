import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { EShiftType } from "src/utils/ETypes";

export class EmployeeHistoryDTO {
  id: string;
}

export class DateShift {
  @IsDateString()
  data : string;
  @IsOptional()
  @IsEnum(EShiftType, { message: 'Turno tem que ser do tipo TURNO 1, TURNO 2, TURNO 3 ou EXTRA' })
  shift? : string
}