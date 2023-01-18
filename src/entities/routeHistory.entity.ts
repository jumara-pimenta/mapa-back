import { v4 as uuid } from 'uuid';
import { Route } from './route.entity';

export class RouteHistory {
  id: string;
  employeeIds: string;
  route?: Route;
  startedAt: Date;
  finishedAt: Date;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<RouteHistory, 'id' | 'createdAt' | 'route'>,
    route: Route,
    id?: string,
  ) {
    Object.assign(this, props);
    this.id = id ?? uuid();
    this.route = route;
  }
}
