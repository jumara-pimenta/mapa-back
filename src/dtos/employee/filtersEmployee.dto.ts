import { ApiProperty } from "@nestjs/swagger";

export class FiltersEmployeeDTO {
  @ApiProperty({required: false})
  registration?: string;
  @ApiProperty({required: false})
  admission?: Date;
  @ApiProperty({required: false})
  role?: string;
  @ApiProperty({required: false})
  shift?: string;
  @ApiProperty({required: false})
  costCenter?: string;
  @ApiProperty({required: false})
  address?: string;
}
