import { Page, PageResponse } from 'src/configs/database/page.model';
import { FiltersRouteHistoryDTO } from './../../dtos/routeHistory/filtersRouteHistory.dto';
import { Injectable } from '@nestjs/common';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import IRouteHistoryRepository from './routeHistory.repository.contract';
import { RouteHistory } from '../../entities/routeHistory.entity';

@Injectable()
export class RouteHistoryRepository
  extends Pageable<RouteHistory>
  implements IRouteHistoryRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }

  delete(id: string): Promise<RouteHistory | null> {
    return this.repository.routeHistory.delete({
      where: { id },
    });
  }

  findById(id: string): Promise<RouteHistory | null> {
    return this.repository.routeHistory.findUnique({
      where: { id },
    });
  }

  async findAll(
    page: Page,
    filters: FiltersRouteHistoryDTO,
  ): Promise<PageResponse<RouteHistory>> {
    const items = await this.repository.routeHistory.findMany({
      ...this.buildPage(page),
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        typeRoute: true,
        nameRoute: true,
        path: true,
        employeeIds: true,
        totalEmployees: true,
        totalConfirmed: true,
        driver: true,
        vehicle: true,
        itinerary: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
      },
    });

    const total = await this.repository.routeHistory.count();

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  async create(data: RouteHistory): Promise<RouteHistory> {
    return await this.repository.routeHistory.create({
      data: {
        id: data.id,
        typeRoute: data.typeRoute,
        nameRoute: data.nameRoute,
        employeeIds: data.employeeIds,
        totalEmployees: data.totalEmployees,
        totalConfirmed: data.totalConfirmed,
        pathId: data.path.id,
        vehicleId: data.vehicle.id,
        driverId: data.driver.id,
        itinerary: data.itinerary,
        startedAt: data.startedAt,
        finishedAt: data.finishedAt,
        createdAt: data.createdAt,
      },
    });
  }

  async getHistoric(): Promise<any> {
    const routes = await this.repository.route.findMany({
      select: {
        path: {
          select: {
            type: true,
            status: true,
          },
        },
      },
    });
    return routes;
  }

  getHistoricByDate(dateInit: Date, dateFinal: Date): Promise<RouteHistory[]> {
    const paths = this.repository.routeHistory.findMany({
      where: {
        createdAt: {
          gte: dateInit,
          lte: dateFinal,
        },
      },
    });
    return paths;
  }
}
