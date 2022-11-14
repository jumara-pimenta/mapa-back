import { v4 as uuid } from 'uuid';
import { Route } from './route.entity';

export class Driver {
  id: string
  name: string
  cpf: string
  cnh: string
  validation: Date
  category: string
  route?: Route
  createdAt: Date
  updatedAt?: Date

  constructor(
    props: Omit<Driver, "id" | "createdAt" | "route">,
    id?: string
  ) {
    Object.assign(this, props);
    this.id = id ?? uuid();
  }
}
