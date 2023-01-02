import { ApiProperty } from "@nestjs/swagger";

export class FiltersEmployeeDTO {
  @ApiProperty()
  registration?: string;
  @ApiProperty()
  admission?: Date;
  @ApiProperty()
  role?: string;
  @ApiProperty()
  shift?: string;
  @ApiProperty()
  costCenter?: string;
  @ApiProperty()
  address?: string;
}
