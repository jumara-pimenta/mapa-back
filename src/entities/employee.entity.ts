import { getDateInLocaleTime } from '../utils/Date';
import { v4 as uuid } from 'uuid';
import { EmployeesOnPath } from './employeesOnPath.entity';
import { EmployeesOnPin } from './employeesOnPin.entity';
import { Pin } from './pin.entity';

export class Employee {
  id: string;
  name: string;
  registration: string;
  password?: string;
  admission: Date;
  role: string;
  shift: string;
  costCenter: string;
  address: string;
  pins?: Partial<EmployeesOnPin>[];
  pin?: Pin;
  employeeOnPath?: EmployeesOnPath;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(
    props: Omit<
      Employee,
      'pin' | 'id' | 'createdAt' | 'pins'  | 'employeeOnPath'
    >,
    pin?: Pin,
    id?: string,
  ) {
    Object.assign(this, props);
    this.createdAt = getDateInLocaleTime(new Date());
    this.id = id ?? uuid();
    this.pin = pin;
  }
}
