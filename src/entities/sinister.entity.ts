import { getDateInLocaleTimeManaus } from '../utils/Date';
import { v4 as uuid } from 'uuid';
import { RouteHistory } from './routeHistory.entity';

export class Sinister {
  id: string;
  type: string;
  description: string;
  pathId?: string;
  RouteHistory?: RouteHistory;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<Sinister, 'pathId' | 'createdBy' | 'id' | 'createdAt'>,
    pathId: string,
    createdBy: string,
    id?: string,
  ) {
    Object.assign(this, props);
    this.pathId = pathId;
    this.createdBy = createdBy;
    this.createdAt = getDateInLocaleTimeManaus(new Date());
    this.id = id ?? uuid();
  }
}
