import { ApiProperty } from "@nestjs/swagger";

class IPin {
  @ApiProperty()
  lat: string;
  @ApiProperty()
  lng: string;
}

class IEmployee {
  @ApiProperty()
  id?: string;
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

class IPath {
  @ApiProperty()
  id: string;
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

class IDriver {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  cpf: string;
  @ApiProperty()
  cnh: string;
  @ApiProperty()
  validation: Date;
  @ApiProperty()
  category: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt?: Date;
}

class IVehicle {
  @ApiProperty()
  id: string;
  @ApiProperty()
  plate: string;
  @ApiProperty()
  company: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  lastSurvey: Date;
  @ApiProperty()
  expiration: Date;
  @ApiProperty()
  capacity: number;
  @ApiProperty()
  renavam: string;
  @ApiProperty()
  lastMaintenance: Date;
  @ApiProperty()
  note: string;
  @ApiProperty()
  isAccessibility: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt?: Date;
}

export class MappedRouteDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  distance: string;
  @ApiProperty()
  driver: IDriver;
  @ApiProperty()
  status: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  paths: IPath[];
  @ApiProperty()
  vehicle: IVehicle;
  @ApiProperty()
  quantityEmployees: number;
}

export class MappedRouteShortDTO {
  @ApiProperty()
	id: string
  @ApiProperty()
	description: string
  @ApiProperty()
	distance: string
  @ApiProperty()
	driver: IDriverShort
  @ApiProperty()
	type: string
  @ApiProperty()
	vehicle: IVehicleShort
}


class IDriverShort {
  @ApiProperty()
  id: string
  @ApiProperty()
  name: string
}

class IVehicleShort {
  @ApiProperty()
  id: string
  @ApiProperty()
  plate: string
}


class IPathShort {
  @ApiProperty()
  id: string
  @ApiProperty()
  startsAt: string
  @ApiProperty()
  employeesOnPath: IEmployeesOnPathDTO[]

}
