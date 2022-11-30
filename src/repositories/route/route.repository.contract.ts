import { FiltersRouteDTO } from "../../dtos/route/filtersRoute.dto";
import { Page, PageResponse } from "../../configs/database/page.model";
import { Route } from "../../entities/route.entity";
import { RouteWebsocket } from "src/entities/routeWebsocket.entity";

export default interface IRouteRepository {
  create(data: Route): Promise<Route>
  delete(id: string): Promise<Route>
  findAll(page: Page, filters?: FiltersRouteDTO): Promise<PageResponse<Route>>
  findById(id: string): Promise<Route>
  findByIdWebsocket(id: string): Promise<Route |any>
  findByDriverId(id: string): Promise<Route[]>
  findByEmployeeIds(id: string[]): Promise<Route[]>
  update(data: Route): Promise<Route>
  updateWebsocket(data: Route): Promise<RouteWebsocket>
}
