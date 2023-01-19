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

  delete(id: string): Promise<RouteHistory> {
    return this.repository.routeHistory.delete({
      where: { id },
    });
  }

  findById(id: string): Promise<RouteHistory> {
    return this.repository.routeHistory.findUnique({
      where: { id },
    });
  }

  async create(data: RouteHistory): Promise<RouteHistory> {
    return await this.repository.routeHistory.create({
      data: {
        id: data.id,
        typeRoute: data.typeRoute,
        nameRoute: data.nameRoute,
        employeeIds: data.employeeIds,
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
}
