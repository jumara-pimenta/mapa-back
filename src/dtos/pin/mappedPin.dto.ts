import { ApiProperty } from '@nestjs/swagger';

export class MappedPinDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  local: string;
  @ApiProperty()
  details: string;
  @ApiProperty()
  lat: string;
  @ApiProperty()
  lng: string;
  @ApiProperty()
  createdAt: Date;
}
