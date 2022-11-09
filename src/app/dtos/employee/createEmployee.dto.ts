import { Address } from "../address/address.dto"
import { createRoutesDetails } from "../routesDetail/createRoutesDetail.dto"

export type EmployeeCreate = {
    id?: string
    registration: string
    name: string
    cpf: string
    rg: string
    admission: Date | string
    role: string
    shift: string
    costCenter: string
    createdAt?: Date | string
    address: Address[]
    routesDetail?: createRoutesDetails
  }
