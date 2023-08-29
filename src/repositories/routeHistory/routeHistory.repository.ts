import { Page, PageResponse } from '../../configs/database/page.model';
import { FiltersRouteHistoryDTO } from './../../dtos/routeHistory/filtersRouteHistory.dto';
import { Injectable } from '@nestjs/common';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import IRouteHistoryRepository from './routeHistory.repository.contract';
import { RouteHistory } from '../../entities/routeHistory.entity';
import { EmployeeHistoryDTO } from '../../dtos/routeHistory/mappedRouteHistory.dto';
import { getDateInLocaleTimeManaus, getDateStartToEndOfDay } from '../../utils/Date';
import { generateQueryByFiltersForRouteHistory } from '../../configs/database/Queries';
import { RouteHistoryByDateAndShift } from '../../dtos/routeHistory/routeHistoryByDate.dto';

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

  findById(id: string): Promise<any> {
    return this.repository.routeHistory.findUnique({
      where: { id: id },
      select: {
        id: true,
        typeRoute: true,
        nameRoute: true,
        path: true,
        employeeIds: true,
        totalEmployees: true,
        totalConfirmed: true,
        sinister: true,
        employeesNotPresent: true,
        driver: {
          select: {
            name: true,
          },
        },
        vehicle: {
          select: {
            plate: true,
          },
        },
        itinerary: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
      },
    });
  }

  async findByPathId(id: string): Promise<any> {
    const date = getDateStartToEndOfDay(
      getDateInLocaleTimeManaus(new Date()).toISOString(),
    );
    const routeHistory = await this.repository.routeHistory.findMany({
      where: {
        path: {
          id: id,
        },
        createdAt: {
          gte: date.start,
          lte: date.end,
        },
      },
    });

    return routeHistory;
  }
  
  async findAll(
    page: Page,
    filters: FiltersRouteHistoryDTO,
  ): Promise<PageResponse<RouteHistory>> {
    const condition = generateQueryByFiltersForRouteHistory(filters);

    const items = condition
      ? await this.repository.routeHistory.findMany({
          ...this.buildPage(page),
          where: { ...condition },
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
            sinister: true,
            totalConfirmed: true,
            driver: true,
            vehicle: true,
            itinerary: true,
            employeesNotPresent: true,
            startedAt: true,
            finishedAt: true,
            createdAt: true,
          },
        })
      : await this.repository.routeHistory.findMany({
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
            sinister: true,
            totalConfirmed: true,
            driver: true,
            vehicle: true,
            itinerary: true,
            employeesNotPresent: true,
            startedAt: true,
            finishedAt: true,
            createdAt: true,
          },
        });

    const total = condition
      ? await this.repository.routeHistory.count({
          where: { ...condition },
        })
      : await this.repository.routeHistory.count({});

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
        employeesNotPresent: data.employeesNotPresent,
        shift: data.path.startsAt,
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

  async getHistoricByDate(
    dateInitial: Date,
    dateFinal: Date,
  ): Promise<RouteHistoryByDateAndShift[]> {
    const paths = await this.repository.routeHistory.findMany({
      where: {
        createdAt: {
          gte: dateInitial,
          lte: dateFinal,
        },
      },
      include: {
        sinister: true,
        path: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return paths;
  }

  async getEmployeeById(id: string): Promise<EmployeeHistoryDTO> {
    return await this.repository.employee.findUnique({
      where: { id },
      select: {
        name: true,
        costCenter: true,
        registration: true,
      },
    });
  }
}
