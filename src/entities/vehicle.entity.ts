import { v4 as uuid } from 'uuid';
import { Route } from './route.entity';
import { getDateInLocaleTimeManaus } from '../utils/Date';

export class Vehicle {
  id: string;
  plate: string;
  company: string;
  type: string;
  lastSurvey?: Date;
  expiration: Date;
  capacity: number;
  renavam?: string;
  lastMaintenance?: Date;
  note?: string;
  isAccessibility: boolean;
  route?: Route;
  createdAt: Date;
  updatedAt?: Date;

  constructor(props: Omit<Vehicle, 'id' | 'createdAt' | 'route'>, id?: string) {
    Object.assign(this, props);
    this.createdAt = getDateInLocaleTimeManaus(new Date());
    this.id = id ?? uuid();
  }
}
