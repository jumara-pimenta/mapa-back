import { ApiProperty } from '@nestjs/swagger';

export class FiltersRouteHistoryDTO {
  @ApiProperty({required: false})
  sequenceQr?: number;
  @ApiProperty({required: false})
  process?: string;
  @ApiProperty({required: false})
  type?: string;
  @ApiProperty({required: false})
  product?: string;
}
