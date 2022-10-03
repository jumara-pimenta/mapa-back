import { Address } from "../address/address.dto"
import { EmployeeCreate } from "./createEmployee.dto"

export type EmployeeData = {
    employee: EmployeeCreate
    address: Address[]
  }


