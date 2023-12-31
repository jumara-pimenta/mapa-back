import { v4 as uuid } from 'uuid';
import { Employee } from './employee.entity';
import { Path } from './path.entity';

export class EmployeesOnPath {
  id: string;
  confirmation?: boolean;
  position: number;
  boardingAt?: Date;
  disembarkAt?: Date;
  description?: string;
  present?: boolean;
  employee?: Partial<Employee> | Employee;
  path?: Path;
  createdAt: Date;
  updatedAt?: Date;
  routeName?: string;

  constructor(
    props: Omit<EmployeesOnPath, 'id' | 'createdAt' | 'path' | 'employee'>,
    employee: Employee,
    path: Path,
    id?: string,
  ) {
    Object.assign(this, props);
    this.id = id ?? uuid();
    this.employee = employee;
    this.path = path;
  }
}
