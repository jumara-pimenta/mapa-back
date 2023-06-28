import { v4 as uuid } from 'uuid';
import { Driver } from './driver.entity';
import { Path } from './path.entity';
import { Vehicle } from './vehicle.entity';

export class Route {
  id: string;
  description: string;
  distance: string;
  type: string;
  status: string;
  driver?: Driver;
  driverId?: string;
  path?: Partial<Path>[] | Path[];
  vehicle?: Vehicle;
  vehicleId?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(
    props: Omit<Route, 'id' | 'createdAt' | 'vehicle' | 'paths' | 'driver'>,
    driver: Driver,
    vehicle: Vehicle,
    id?: string,
  ) {
    Object.assign(this, props);
    this.id = id ?? uuid();
    this.driver = driver;
    this.vehicle = vehicle;
  }
}
