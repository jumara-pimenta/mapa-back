import { ApiProperty } from '@nestjs/swagger';

export class FiltersRouteDTO {
  @ApiProperty({required: false})
  description?: string;
  @ApiProperty({required: false})
  distance?: string;
  @ApiProperty({required: false})
  type?: string;
  @ApiProperty({required: false})
  status?: string;
  @ApiProperty({required: false})
  driver?: string;
}
