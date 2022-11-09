import { ETypePin } from 'src/utils/ETypes';
import { Employee } from './employee.entity';
import { Pin } from './pin.entity';

export class EmployeesOnPin {
  employee?: Employee
  pin?: Partial<Pin>
  type: ETypePin | string
  createdAt: Date
  updatedAt?: Date

  constructor(
    props: Omit<EmployeesOnPin, "employee" | "pin" | "createdAt">,
    employee: Employee,
    pin: Pin
  ) {
    Object.assign(this, props);
    this.employee = employee;
    this.pin = pin;
  }
}
