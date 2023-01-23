import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RouteHistory } from '../entities/routeHistory.entity';
import IRouteHistoryRepository from '../repositories/routeHistory/routeHistory.repository.contract';
import { MappedRouteHistoryDTO } from '../dtos/routeHistory/mappedRouteHistory.dto';
import { CreateRouteHistoryDTO } from '../dtos/routeHistory/createRouteHistory.dto';
import { PathService } from './path.service';
import { DriverService } from './driver.service';
import { VehicleService } from './vehicle.service';

@Injectable()
export class RouteHistoryService {
  constructor(
    @Inject('IRouteHistoryRepository')
    private readonly routeHistoryRepository: IRouteHistoryRepository,
  ) {}

  async create(props: RouteHistory): Promise<RouteHistory> {
 
    const newRouteHistory = new RouteHistory(
      {
        typeRoute: props.typeRoute,
        nameRoute: props.nameRoute,
        employeeIds: props.employeeIds,
        itinerary: props.itinerary,
        startedAt: new Date(),
        finishedAt: new Date(),
      },
      props.path,
      props.driver,
      props.vehicle,
    );

    return await this.routeHistoryRepository.create(newRouteHistory);
  }

  async delete(id: string): Promise<RouteHistory> {
    const routeHistory = await this.listById(id);

    return await this.routeHistoryRepository.delete(routeHistory.id);
  }

  async listById(id: string): Promise<RouteHistory> {
    const routeHistory = await this.routeHistoryRepository.findById(id);

    if (!routeHistory)
      throw new HttpException(
        `Não foi encontrado um routeHistory com o id: ${id}`,
        HttpStatus.NOT_FOUND,
      );

    return routeHistory;
  }

  private toDTO(routeHistorys: RouteHistory[]): MappedRouteHistoryDTO[] {
    return routeHistorys.map((routeHistory) => {
      return {
        id: routeHistory.id,
        typeRoute: routeHistory.typeRoute,
        nameRoute: routeHistory.nameRoute,
        path: routeHistory.path.id,
        employeeIds: routeHistory.employeeIds,
        driver: routeHistory.driver.id,
        vehicle: routeHistory.vehicle.id,
        itinerary: routeHistory.itinerary,
        startedAt: routeHistory.startedAt,
        finishedAt: routeHistory.finishedAt,
        createdAt: new Date(),
      };
    });
  }
}
