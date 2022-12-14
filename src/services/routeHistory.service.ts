import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RouteHistory } from '../entities/routeHistory.entity';
import IRouteHistoryRepository from '../repositories/routeHistory/routeHistory.repository.contract';
import { MappedRouteHistoryDTO } from '../dtos/routeHistory/mappedRouteHistory.dto';
import { CreateRouteHistoryDTO } from '../dtos/routeHistory/createRouteHistory.dto';
import { RouteService } from './route.service';

@Injectable()
export class RouteHistoryService {
  constructor(
    @Inject('IRouteHistoryRepository')
    private readonly routeHistoryRepository: IRouteHistoryRepository,
    private readonly routeService: RouteService,
  ) {}

  async create(payload: CreateRouteHistoryDTO): Promise<RouteHistory> {
    const route = await this.routeService.listById(payload.routeId);

    const newRouteHistory = new RouteHistory(
      {
        employeeIds: payload.employeesId,
        finishedAt: new Date(),
        startedAt: new Date(),
      },
      route,
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
