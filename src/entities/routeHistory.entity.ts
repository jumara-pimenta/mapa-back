import { ETypeRoute } from '../utils/ETypes';
import { v4 as uuid } from 'uuid';
import { Driver } from './driver.entity';
import { Path } from './path.entity';
import { Vehicle } from './vehicle.entity';
import { Sinister } from './sinister.entity';

export class RouteHistory {
  id: string;
  typeRoute: ETypeRoute | string;
  nameRoute: string;
  path?: Partial<Path>;
  employeeIds: string;
  totalEmployees: number;
  totalConfirmed: number;
  sinister?: Sinister[];
  driver?: Driver;
  vehicle?: Vehicle;
  itinerary: string;
  startedAt: Date;
  finishedAt: Date;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<
      RouteHistory,
      'id' | 'createdAt' | 'vehicle' | 'paths' | 'driver' | 'sinister'
    >,
    path: Partial<Path>,
    driver: Driver,
    vehicle: Vehicle,
    sinister: Sinister[],
    createdAt? : Date,
    id?: string,
  ) {
    Object.assign(this, props);
    this.id = id ?? uuid();
    this.path = path;
    this.driver = driver;
    this.vehicle = vehicle;
    this.sinister = sinister;
    this.createdAt = createdAt ?? new Date();
  }
}
