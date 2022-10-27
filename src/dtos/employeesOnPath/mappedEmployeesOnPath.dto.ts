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

export class MappedEmployeesOnPathDTO {
  id: string
  boardingAt?: Date
  confirmation: boolean
  disembarkAt?: Date
  position: number
  location: IEmployee
  createdAt: Date
}
