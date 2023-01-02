import { ApiProperty } from "@nestjs/swagger";

export class FiltersRouteDTO {
  @ApiProperty()
  description?: string;
  @ApiProperty()
  distance?: string;
  @ApiProperty()
  type?: string;
  @ApiProperty()
  status?: string;
  @ApiProperty()
  driver?: string;
}
