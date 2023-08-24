import { getDateInLocaleTimeManaus } from '../utils/Date';
import { v4 as uuid } from 'uuid';
import { Route } from './route.entity';

export class Driver {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  validation: Date;
  category: string;
  route?: Route;
  firstAccess?: boolean;
  password?: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<Driver, 'id' | 'createdAt' | 'route'>,

    id?: string,
  ) {
    Object.assign(this, props);
    this.createdAt = getDateInLocaleTimeManaus(new Date());
    this.id = id ?? uuid();
  }
}
