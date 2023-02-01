import { getDateInLocaleTime } from '../utils/Date';
import { v4 as uuid } from 'uuid';

export class Sinister {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<Sinister, 'id' | 'createdAt'>,

    id?: string,
  ) {
    Object.assign(this, props);
    this.createdAt = getDateInLocaleTime(new Date());
    this.id = id ?? uuid();
  }
}
