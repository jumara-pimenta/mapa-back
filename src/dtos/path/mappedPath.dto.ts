class IPin {
  type: string
  lat: string
  long: string 
}

class IEmployee {
  name: string
  address: string
  shift: string
  registration: string
  pin: IPin
}

class IEmployeesOnPathDTO  {
  id: string
  boardingAt?: Date
  confirmation: boolean
  disembarkAt?: Date
  position: number
  locations: IEmployee
}

export class MappedPathDTO {
  id: string
  duration: string
  finishedAt?: Date
  startedAt?: Date
  startsAt: string
  status: string
  type: string
  createdAt: Date
  employeesOnPath: IEmployeesOnPathDTO[]
}
