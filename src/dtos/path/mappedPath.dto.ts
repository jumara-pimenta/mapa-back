class IPin {
  lat: string;
  lng: string;
}

class IEmployee {
  name: string;
  address: string;
  shift: string;
  registration: string;
  location: IPin;
}

class IEmployeesOnPathDTO {
  id: string;
  boardingAt?: Date;
  confirmation: boolean;
  disembarkAt?: Date;
  position: number;
  details: IEmployee;
}

export class MappedPathDTO {
  id: string;
  duration: string;
  finishedAt?: Date;
  startedAt?: Date;
  startsAt: string;
  status: string;
  type: string;
  createdAt: Date;
  employeesOnPath: IEmployeesOnPathDTO[];
  routeDescription: string;
}
