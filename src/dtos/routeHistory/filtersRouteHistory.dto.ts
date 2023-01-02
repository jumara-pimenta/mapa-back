import { ApiProperty } from "@nestjs/swagger";

export class FiltersRouteHistoryDTO {
  @ApiProperty()
  sequenceQr?: number;
  @ApiProperty()
  process?: string;
  @ApiProperty()
  type?: string;
  @ApiProperty()
  product?: string;
}
