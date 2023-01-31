import { getDateInLocaleTime } from 'src/utils/Date';
import { v4 as uuid } from 'uuid';
import { Path } from './path.entity';
import { RouteHistory } from './routeHistory.entity';

export class Sinister {
  id: string;
  type: string;
  description: string;
  Path?: Path;
  RouteHistory?: RouteHistory;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    props: Omit<Sinister, 'Path' | 'createdBy' | 'id' | 'createdAt'>,
    Path: Path,
    createdBy: string,
    id?: string,
  ) {
    Object.assign(this, props);
    this.Path = Path;
    this.createdBy = createdBy;
    this.createdAt = getDateInLocaleTime(new Date());
    this.id = id ?? uuid();
  }
}
