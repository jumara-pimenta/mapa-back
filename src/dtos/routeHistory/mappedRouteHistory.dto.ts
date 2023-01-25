import { ApiProperty } from '@nestjs/swagger';

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
  driver: string;
  @ApiProperty()
  vehicle: string;
  @ApiProperty()
  itinerary: string;
  @ApiProperty()
  startedAt: Date;
  @ApiProperty()
  finishedAt: Date;
  @ApiProperty()
  createdAt: Date;
}
