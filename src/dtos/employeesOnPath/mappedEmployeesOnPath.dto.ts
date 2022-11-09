class IPin {
  lat: string
  long: string 
}

class IEmployee {
  name: string
  address: string
  shift: string
  registration: string
  location: IPin
}

export class MappedEmployeesOnPathDTO {
  id: string
  boardingAt?: Date
  confirmation: boolean
  disembarkAt?: Date
  position: number
  details: IEmployee
  createdAt: Date
}
