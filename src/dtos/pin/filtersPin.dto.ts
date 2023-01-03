import { ApiProperty } from "@nestjs/swagger";

export class FiltersPinDTO {
  @ApiProperty({required: false})
  title?: string;
  @ApiProperty({required: false})
  local?: string;
  @ApiProperty({required: false})
  details?: string;
}
