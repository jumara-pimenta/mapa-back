import { EEntity, EStatusWork } from '../utils/ETypes';
import { v4 as uuid } from 'uuid';

export class ScheduledWork {
  id: string;
  idEntity: string;
  entity: string | EEntity;
  status: string | EStatusWork;
  scheduledDate: Date
  createdAt: Date;
  updatedAt?: Date;

  constructor(props: Omit<ScheduledWork, 'id' | 'createdAt'>, id?: string) {
    Object.assign(this, props);
    this.id = id ?? uuid();
  }
}
