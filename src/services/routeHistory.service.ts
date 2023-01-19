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
    private readonly pathService: PathService,
    private readonly driverService: DriverService,
    private readonly vehicleService: VehicleService,
  ) {}

  async create(props: CreateRouteHistoryDTO): Promise<RouteHistory> {
    const path = await this.pathService.listById(props.path);
    const driver = await this.driverService.listById(props.driver);
    const vehicle = await this.vehicleService.listById(props.vehicle);

    const newRouteHistory = new RouteHistory(
      {
        typeRoute: props.typeRoute,
        nameRoute: props.nameRoute,
        employeeIds: props.employeesIds,
        itinerary: props.itinerary,
        startedAt: new Date(),
        finishedAt: new Date(),
      },
      path,
      driver,
      vehicle,
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
        employeeIds: routeHistory.employeeIds,
        finishedAt: routeHistory.finishedAt,
        startedAt: routeHistory.startedAt,
        createdAt: routeHistory.createdAt,
      };
    });
  }
}
