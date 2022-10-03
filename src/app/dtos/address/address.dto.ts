import { Prisma } from "@prisma/client"

export type Address = {
    id: string
    employeeId: string
    street: string
    cep: number
    number: number
    complement: string
    neighborhood: string
    city: string
    state: string
    latitude: string
    longitude: string
    type: boolean
    createdAt: Date
  }