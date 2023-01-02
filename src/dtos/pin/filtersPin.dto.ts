import { ApiProperty } from "@nestjs/swagger";

export class FiltersPinDTO {
  @ApiProperty()
  title?: string;
  @ApiProperty()
  local?: string;
  @ApiProperty()
  details?: string;
}
