import { v4 as uuid } from 'uuid';
import { EmployeesOnPin } from './employeesOnPin.entity';
import { getDateInLocaleTimeManaus } from '../utils/Date';

export class Pin {
  id: string;
  title: string;
  local: string;
  details: string;
  lat: string;
  lng: string;
  district: string;
  employees?: EmployeesOnPin;
  createdAt: Date;
  updatedAt?: Date;

  constructor(props: Omit<Pin, 'id' | 'createdAt' | 'employees'>, id?: string) {
    Object.assign(this, props);
    this.id = id ?? uuid();
    this.createdAt = getDateInLocaleTimeManaus(new Date());
  }
}
