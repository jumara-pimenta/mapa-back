import { PathDetailsDTO } from "./pathDetails.dto";

export class CreatePathDTO {
  details: PathDetailsDTO
  employeeIds: string[]
  routeId: string
}
