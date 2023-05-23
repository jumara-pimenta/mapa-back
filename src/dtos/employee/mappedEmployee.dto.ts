import { ApiProperty } from '@nestjs/swagger';
import { ETypePin } from '../../utils/ETypes';

export class MappedEmployeeDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  registration: string;
  @ApiProperty()
  admission: Date;
  @ApiProperty()
  role: string;
  @ApiProperty()
  shift: string;
  @ApiProperty()
  costCenter: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  pins: {
    id: string;
    title: string;
    local: string;
    details: string;
    district: string;
    lat: string;
    lng: string;
    type: ETypePin;
  }[];
}
