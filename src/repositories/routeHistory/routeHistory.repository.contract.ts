import { RouteHistory } from '../../entities/routeHistory.entity';

export default interface IRouteHistoryRepository {
  create(data: RouteHistory): Promise<RouteHistory>;
  delete(id: string): Promise<RouteHistory>;
  findById(id: string): Promise<RouteHistory>;
}
