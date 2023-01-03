import { ApiProperty } from "@nestjs/swagger";

class IPin {
  @ApiProperty()
  lat: string;
  @ApiProperty()
  lng: string;
}

class IEmployee {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  shift: string;
  @ApiProperty()
  registration: string;
  @ApiProperty()
  location: IPin;
}

class IEmployeesOnPathDTO {
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
