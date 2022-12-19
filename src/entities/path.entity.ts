import { v4 as uuid } from 'uuid';
import { EmployeesOnPath } from './employeesOnPath.entity';
import { Route } from './route.entity';

export class Path {
  id: string;
  duration: string;
  startsAt: string;
  startedAt?: Date;
  finishedAt?: Date;
  type: string;
  status: string;
  employeesOnPath?: Partial<EmployeesOnPath>[];
  route?: Route;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<Path, 'id' | 'createdAt' | 'employeesOnPath' | 'route'>,
    route: Route,
    id?: string,
  ) {
    Object.assign(this, props);
    this.id = id ?? uuid();
    this.route = route;
  }
}
