import { ApiProperty } from '@nestjs/swagger';
import { LatAndLong } from './mappedRouteHistory.dto';

export class MappedPathHistoryDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  typeRoute: string;
  @ApiProperty()
  nameRoute: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  totalEmployees: number;
  @ApiProperty()
  totalConfirmed: number;
  @ApiProperty()
  driverName: string;
  @ApiProperty()
  vehiclePlate: string;
  @ApiProperty()
  itinerary: LatAndLong[];
  @ApiProperty()
  startedAt: Date;
  @ApiProperty()
  finishedAt: Date;
}
