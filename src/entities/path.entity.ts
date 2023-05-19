import { EStatusPath } from '../utils/ETypes';
import { v4 as uuid } from 'uuid';
import { EmployeesOnPath } from './employeesOnPath.entity';
import { Route } from './route.entity';
import { Sinister } from './sinister.entity';

export class Path {
  id: string;
  duration: string;
  startsAt: string;
  startedAt?: Date;
  finishedAt?: Date;
  type: string;
  status: string | EStatusPath;
  employeesOnPath?: Partial<EmployeesOnPath>[];
  route?: Partial<Route>;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  scheduleDate?: Date | null;
  substituteId?: string;

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
