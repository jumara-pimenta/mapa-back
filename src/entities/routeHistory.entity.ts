import { v4 as uuid } from 'uuid';
import { Driver } from './driver.entity';
import { Path } from './path.entity';
import { Route } from './route.entity';
import { Vehicle } from './vehicle.entity';

export class RouteHistory {
  id: string;
  typeRoute: string;
  nameRoute: string;
  pathId: Path;
  employeeIds: string;
  driverId: Driver;
  vehicleId: Vehicle;
  itinerary: string;
  startedAt: Date;
  finishedAt: Date;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<RouteHistory, 'id' | 'createdAt' | 'route'>,
    path: Path,
    id?: string,
  ) {
    Object.assign(this, props);
    this.id = id ?? uuid();
    this.pathId = path;
  }
}
