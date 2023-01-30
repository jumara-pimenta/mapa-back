import { FiltersRouteHistoryDTO } from 'src/dtos/routeHistory/filtersRouteHistory.dto';
import { Page, PageResponse } from 'src/configs/database/page.model';
import { RouteHistory } from '../../entities/routeHistory.entity';
import { EmployeeHistoryDTO } from 'src/dtos/routeHistory/mappedRouteHistory.dto';

export default interface IRouteHistoryRepository {
  getHistoric(): Promise<any>;
  getHistoricByDate(dateInit: Date, dateFinal: Date): Promise<RouteHistory[]>;
  create(data: RouteHistory): Promise<RouteHistory | null>;
  delete(id: string): Promise<RouteHistory | null>;
  findById(id: string): Promise<RouteHistory | null>;
  findAll(
    page: Page,
    filters: FiltersRouteHistoryDTO,
  ): Promise<PageResponse<RouteHistory>>;
  getEmployeeById(id: string): Promise<EmployeeHistoryDTO>;
}
