import { Path } from '../../entities/path.entity';
import { Sinister } from '../../entities/sinister.entity';

export class RouteByDateAndShift {
  date: string;
  shift: string;
  totalPaths: number;
  routes: RouteSeparated[];
}

export class Shifts {
  shift: string;
  totalPaths: number;
}
export class ShiftsByDate {
  date: string;
  shifts: Shifts[];
}
export class RouteSeparated {
  date: string;
  totalPaths: number;
  totalEmployessConfirmedButNotPresent: number;
  totalEmployessNotConfirmed: number;
  totalEmployessConfirmed: number;
  totalEmployess: number;
  totalEmployessPresent: number;
  totalSinister: number;
  startedAt: Date;
  finishedAt: Date;
  type: string;
}
export class RouteHistoryByDate {
  date: string;
  totalPaths: number;
}

export class RouteHistoryByDateAndShift {
  typeRoute: string;
  nameRoute: string;
  path: Path;
  employeeIds: string;
  totalEmployees: number;
  totalConfirmed: number;
  sinister: Sinister[];
  startedAt: Date;
  finishedAt: Date;
  createdAt: Date;
}
