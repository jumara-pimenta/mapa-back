import { FiltersRouteDTO } from '../../dtos/route/filtersRoute.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Route } from '../../entities/route.entity';
import { RouteWebsocket } from '../../entities/routeWebsocket.entity';
import { ERoutePathStatus, ETypeRouteExport } from '../../utils/ETypes';
import { TTypeRoute } from '../../utils/TTypes';

export default interface IRouteRepository {
  findRouteDataByPathId(pathId: string): unknown;
  create(data: Route): Promise<Route>;
  delete(id: string): Promise<Route>;
  findAll(page: Page, filters?: FiltersRouteDTO): Promise<PageResponse<Route>>;
  findAllToExport(
    page: Page,
    type: ETypeRouteExport,
  ): Promise<PageResponse<Route>>;
  findById(id: string): Promise<Route>;
  findByIdWebsocket(id: string): Promise<Route | any>;
  findByDriverId(id: string): Promise<Route[]>;
  findByVehicleId(id: string): Promise<Route[]>;
  findByEmployeeIds(id: string[]): Promise<Route[]>;
  update(data: Route): Promise<Route>;
  updateWebsocket(data: Route): Promise<RouteWebsocket>;
  softDelete(id: string): Promise<Route>;
  listByDriverId(
    id: string,
    page: Page,
    filters?: FiltersRouteDTO,
  ): Promise<PageResponse<Route>>;
  findRouteIdByPathId(id: string): Promise<string>;
  findEmployeeOnRouteByType(
    employeeId: string,
    type: TTypeRoute,
  ): Promise<Route>;

  updateTotalDistance(id: string, totalDistance: string): Promise<Route>;
  findRouteWithPaths(id: string): Promise<Partial<Route>>
  findManyByStatus(status: ERoutePathStatus): Promise<Route[]>
}
