/* eslint-disable quotes */
import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeesOnPathDTO {
  @ApiProperty()
  employeeIds: string[];
  @ApiProperty()
  pathId: string;
  @ApiProperty()
  confirmation: boolean;
}
