import { ApiProperty } from '@nestjs/swagger';

export class LatAndLong {
  @ApiProperty()
  lat: string;
  @ApiProperty()
  lng: string;
}

export class MappedRouteHistoryDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  typeRoute: string;
  @ApiProperty()
  nameRoute: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  employeeIds: string;
  @ApiProperty()
  totalEmployees: number;
  @ApiProperty()
  totalConfirmed: number;
  @ApiProperty()
  driver: string;
  @ApiProperty()
  vehicle: string;
  @ApiProperty()
  itinerary: LatAndLong[];
  @ApiProperty()
  startedAt: Date;
  @ApiProperty()
  finishedAt: Date;
}
