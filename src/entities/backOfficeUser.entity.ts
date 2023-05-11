import { getDateInLocaleTime } from '../utils/Date';
import { v4 as uuid } from 'uuid';

export class BackOfficeUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  roleType: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<BackOfficeUser, 'id' | 'createdAt' | 'route'>,
    id?: string,
  ) {
    Object.assign(this, props);
    this.createdAt = getDateInLocaleTime(new Date());
    this.id = id ?? uuid();
  }
}
