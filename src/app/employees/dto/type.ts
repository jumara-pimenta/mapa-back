import { Address, Employee } from "@prisma/client"

export type EmployeeData = {
    employee: Employee
    address: Address[]
  }
