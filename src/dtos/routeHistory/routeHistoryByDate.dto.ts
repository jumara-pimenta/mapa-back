export class RouteByDateAndShift {
  date : string
  shift : string
  totalPaths : number
  routes : RouteSeparated[]
}

export class Shifts {
  shift : string
  totalPaths : number
}
export class ShiftsByDate {
  date : string
  shifts : Shifts[]
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
}
export class RouteHistoryByDate {
  date: string;
  totalPaths: number;
}
