import { Path } from "../../entities/path.entity"
import { MappedDriverDTO } from "../driver/mappedDriver.dto"
import { MappedVehicleDTO } from "../vehicle/mappedVehicle.dto"

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

class IEmployeesOnPathDTO  {
  id: string
  boardingAt?: Date
  confirmation: boolean
  disembarkAt?: Date
  position: number
  details: IEmployee
}

class IPath {
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

class IDriver {
  id: string
  name: string
  cpf: string
  cnh: string
  validation: Date
  category: string
  createdAt: Date
  updatedAt?: Date
}

class IVehicle {
  id: string
  plate: string
  company: string
  type: string
  lastSurvey: Date
  expiration: Date
  capacity: number
  renavam: string
  lastMaintenance: Date
  note: string
  isAccessibility: boolean
  createdAt: Date
  updatedAt?: Date
}

export class MappedRouteDTO {
	id: string
	description: string
	distance: string
	driver: IDriver
	status: string
	type: string
	createdAt: Date
	paths: IPath[]
	vehicle: IVehicle
}
