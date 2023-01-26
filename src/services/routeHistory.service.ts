import { FiltersRouteHistoryDTO } from './../dtos/routeHistory/filtersRouteHistory.dto';
import { Page, PageResponse } from 'src/configs/database/page.model';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RouteHistory } from '../entities/routeHistory.entity';
import IRouteHistoryRepository from '../repositories/routeHistory/routeHistory.repository.contract';
import { MappedRouteHistoryDTO } from '../dtos/routeHistory/mappedRouteHistory.dto';

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
        totalEmployees: props.totalEmployees,
        totalConfirmed: props.totalConfirmed,
        itinerary: props.itinerary,
        startedAt: props.path.startedAt,
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

  async listAll(
    page: Page,
    filters?: FiltersRouteHistoryDTO,
  ): Promise<PageResponse<MappedRouteHistoryDTO>> {
    const routeHistory = await this.routeHistoryRepository.findAll(
      page,
      filters,
    );

    if (routeHistory.total === 0) {
      throw new HttpException(
        'Não existe(m) histórico(s) de trajeto(s) para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = await this.mapperMany(routeHistory.items);

    return {
      total: routeHistory.total,
      items,
    };
  }

  private async mapperMany(
    routeHistories: RouteHistory[],
  ): Promise<MappedRouteHistoryDTO[]> {
    return routeHistories.map((routeHistory) => {
      return {
        id: routeHistory.id,
        typeRoute: routeHistory.typeRoute,
        nameRoute: routeHistory.nameRoute,
        path: routeHistory.path.id,
        employeeIds: routeHistory.employeeIds,
        totalEmployees: routeHistory.totalEmployees,
        totalConfirmed: routeHistory.totalConfirmed,
        driver: routeHistory.driver.id,
        vehicle: routeHistory.vehicle.id,
        itinerary: routeHistory.itinerary,
        startedAt: routeHistory.startedAt,
        finishedAt: routeHistory.finishedAt,
      };
    });
  }

  private toDTO(routeHistorys: RouteHistory[]): MappedRouteHistoryDTO[] {
    return routeHistorys.map((routeHistory) => {
      return {
        id: routeHistory.id,
        typeRoute: routeHistory.typeRoute,
        nameRoute: routeHistory.nameRoute,
        path: routeHistory.path.id,
        employeeIds: routeHistory.employeeIds,
        totalEmployees: routeHistory.totalEmployees,
        totalConfirmed: routeHistory.totalConfirmed,
        driver: routeHistory.driver.id,
        vehicle: routeHistory.vehicle.id,
        itinerary: routeHistory.itinerary,
        startedAt: routeHistory.startedAt,
        finishedAt: routeHistory.finishedAt,
      };
    });
  }
}
