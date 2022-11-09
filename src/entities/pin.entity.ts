import { v4 as uuid } from 'uuid';
import { EmployeesOnPin } from './employeesOnPin.entity';

export class Pin {
  id: string
  description: string
  lat: string 
  long: string      
  employees?: EmployeesOnPin
  createdAt: Date
  updatedAt?: Date

  constructor(
    props: Omit<Pin, "id" | "createdAt" | "employees">,
    id?: string
  ) {
    Object.assign(this, props);
    this.id = id ?? uuid();
  }
}
