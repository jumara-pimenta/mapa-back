import { v4 as uuid } from 'uuid';
import { Driver } from './driver.entity';
import { Path } from './path.entity';
import { Vehicle } from './vehicle.entity';

export class RouteWebsocket {
  id: string;
  description: string;
  distance: string;
  type: string;
  status: string;
  driver?: string;
  path?: Partial<Path>[];
  vehicle?: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<
      RouteWebsocket,
      'id' | 'createdAt' | 'vehicle' | 'paths' | 'driver'
    >,
    driver: Driver,
    vehicle: Vehicle,
    id?: string,
  ) {
    Object.assign(this, props);
    this.id = id ?? uuid();
    this.driver = driver.name;
    this.vehicle = vehicle.plate;
  }
}
