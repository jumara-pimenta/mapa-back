import { ApiProperty } from '@nestjs/swagger';

interface IEmployeeNotPresent {
  name: string,
  registration: string,
  present: boolean,
  confirmed: boolean
}

export class LatAndLong {
  @ApiProperty()
  lat: string;
  @ApiProperty()
  lng: string;
}

export class EmployeeHistoryDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  costCenter: string;
  @ApiProperty()
  registration: string;
}

export class SinisterDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdBy: string;
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
  sinister: SinisterDTO[];
  @ApiProperty()
  sinisterTotal: number;
  @ApiProperty()
  driver: string;
  @ApiProperty()
  vehicle: string;
  @ApiProperty()
  itinerary: LatAndLong[];
  employeesNotPresent?: IEmployeeNotPresent[];
  @ApiProperty()
  startedAt: Date;
  @ApiProperty()
  finishedAt: Date;
}
