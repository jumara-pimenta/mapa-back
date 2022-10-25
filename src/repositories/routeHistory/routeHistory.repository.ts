import { Injectable } from "@nestjs/common";
import { Page, PageResponse } from "../../configs/database/page.model";
import { Pageable } from "../../configs/database/pageable.service";
import { PrismaService } from "../../configs/database/prisma.service";
import IRouteHistoryRepository from "./routeHistory.repository.contract";
import { getDateInLocaleTime } from "../../utils/date.service";
import { FiltersRouteHistoryDTO } from "../../dtos/routeHistory/filtersRouteHistory.dto";
import { generateQueryByFiltersForRouteHistory } from "../../configs/database/Queries";
import { RouteHistory } from "../../entities/routeHistory.entity";

@Injectable()
export class RouteHistoryRepository extends Pageable<RouteHistory> implements IRouteHistoryRepository {
  constructor(
    private readonly repository: PrismaService
  ) {
    super()
  }

  delete(id: string): Promise<RouteHistory> {
    return this.repository.routeHistory.delete({
      where: { id }
    });
  }

  findById(id: string): Promise<RouteHistory> {
    return this.repository.routeHistory.findUnique({
      where: { id }
    })
  }

  create(data: RouteHistory): Promise<RouteHistory> {
    return this.repository.routeHistory.create({
      data: {
        id: data.id,
        employeeIds: data.employeeIds,
        finishedAt: data.finishedAt,
        startedAt: data.startedAt,
        routeId: data.route.id
      }
    });
  }
}