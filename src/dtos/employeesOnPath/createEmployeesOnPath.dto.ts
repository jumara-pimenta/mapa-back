import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeesOnPathDTO {
  @ApiProperty()
  employeeIds: string[];
  @ApiProperty()
  pathId: string;
}
