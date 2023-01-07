import { ApiProperty } from '@nestjs/swagger';
import { EmployeeAddressDTO } from '../employee/EmployeeAddress.dto';

class IPin {
  @ApiProperty()
  id: string;
  @ApiProperty()
  lat: string;
  @ApiProperty()
  lng: string;
}

class IEmployee {
  @ApiProperty()
  employeeId: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string | EmployeeAddressDTO;
  @ApiProperty()
  shift: string;
  @ApiProperty()
  registration: string;
  @ApiProperty()
  location: IPin;
}

export class IEmployeesOnPathDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  boardingAt?: Date;
  @ApiProperty()
  confirmation: boolean;
  @ApiProperty()
  disembarkAt?: Date;
  @ApiProperty()
  position: number;
  @ApiProperty()
  details: IEmployee;
}

export class MappedPathDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  routeDescription: string;
  @ApiProperty()
  duration: string;
  @ApiProperty()
  finishedAt?: Date;
  @ApiProperty()
  startedAt?: Date;
  @ApiProperty()
  startsAt: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  employeesOnPath: IEmployeesOnPathDTO[];
}


export class MappedPathPinsDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  routeId: string;
  @ApiProperty()
  routeDescription: string;
  @ApiProperty()
  duration: string;
  @ApiProperty()
  finishedAt?: Date;
  @ApiProperty()
  startedAt?: Date;
  @ApiProperty()
  startsAt: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  employeesOnPins: EmployeesByPin[];
  @ApiProperty()
  vehicle?: string;
  @ApiProperty()
  driver?: string;
}


export interface EmployeesByPin {
  position: number;
  lat: string
  lng: string;
  employees: {
    id: string;
    name: string;
    registration: string;
    employeeId: string;
    disembarkAt: Date;
    confirmation: boolean;
    description: string;
    boardingAt: Date;
  }[];

}