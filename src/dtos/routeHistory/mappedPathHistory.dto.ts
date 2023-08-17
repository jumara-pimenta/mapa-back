import { ApiProperty } from '@nestjs/swagger';
import { LatAndLong } from './mappedRouteHistory.dto';

interface IEmployeeNotPresent {
  name: string,
  registration: string,
  present: boolean,
  confirmed: boolean
}

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
  employeesNotPresent?: IEmployeeNotPresent[];
  @ApiProperty()
  startedAt: Date;
  @ApiProperty()
  finishedAt: Date;
}
