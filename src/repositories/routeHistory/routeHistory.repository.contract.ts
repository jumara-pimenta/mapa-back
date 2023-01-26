import { FiltersRouteHistoryDTO } from 'src/dtos/routeHistory/filtersRouteHistory.dto';
import { Page, PageResponse } from 'src/configs/database/page.model';
import { RouteHistory } from '../../entities/routeHistory.entity';

export default interface IRouteHistoryRepository {
  create(data: RouteHistory): Promise<RouteHistory | null>;
  delete(id: string): Promise<RouteHistory | null>;
  findById(id: string): Promise<RouteHistory | null>;
  findAll(
    page: Page,
    filters: FiltersRouteHistoryDTO,
  ): Promise<PageResponse<RouteHistory>>;
}
