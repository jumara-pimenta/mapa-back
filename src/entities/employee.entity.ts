import { getDateInLocaleTime } from 'src/utils/Date';
import { v4 as uuid } from 'uuid';
import { EmployeesOnPath } from './employeesOnPath.entity';
import { EmployeesOnPin } from './employeesOnPin.entity';

export class Employee {
  id: string;
  name: string;
  registration: string;
  admission: Date;
  role: string;
  shift: string;
  costCenter: string;
  address: string;
  pins?: Partial<EmployeesOnPin>[];
  employeeOnPath?: EmployeesOnPath;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<Employee, 'id' | 'createdAt' | 'pins' | 'employeeOnPath'>,
    id?: string,
  ) {
    Object.assign(this, props);
    this.createdAt = getDateInLocaleTime(new Date());
    this.id = id ?? uuid();
  }
}
