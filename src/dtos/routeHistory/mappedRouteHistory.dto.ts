import { MappedRouteDTO } from '../route/mappedRoute.dto';

export class MappedRouteHistoryDTO {
  id: string;
  employeeIds: string;
  startedAt: Date;
  finishedAt: Date;
  createdAt: Date;
}
