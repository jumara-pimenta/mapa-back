export interface IQueryEmployeesOnPath {
  boardingAt?: Date
  confirmation?: boolean
  disembarkAt?: Date
  employee?: {
    id?: string
  },
  path?: {
    id?: string
  },
  position?: number
}
