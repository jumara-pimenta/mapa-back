import { FiltersRouteHistoryDTO } from './../dtos/routeHistory/filtersRouteHistory.dto';
import { Page, PageResponse } from 'src/configs/database/page.model';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RouteHistory } from '../entities/routeHistory.entity';
import IRouteHistoryRepository from '../repositories/routeHistory/routeHistory.repository.contract';
import {
  EmployeeHistoryDTO,
  LatAndLong,
  MappedRouteHistoryDTO,
} from '../dtos/routeHistory/mappedRouteHistory.dto';
import { compareDates } from 'src/utils/Date';
import { RouteHistoryByDate } from 'src/dtos/routeHistory/routeHistoryByDate.dto';
import { MappedPathHistoryDTO } from 'src/dtos/routeHistory/mappedPathHistory.dto';

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
    routeHistories: any,
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
        itinerary: this.separateItinerary(routeHistory.itinerary),
        startedAt: routeHistory.startedAt,
        finishedAt: routeHistory.finishedAt,
      };
    });
  }

  private async mapperPath(routeHistory: any): Promise<MappedPathHistoryDTO> {
    return {
      id: routeHistory.id,
      typeRoute: routeHistory.typeRoute,
      nameRoute: routeHistory.nameRoute,
      path: routeHistory.path.id,
      totalEmployees: routeHistory.totalEmployees,
      totalConfirmed: routeHistory.totalConfirmed,
      driverName: routeHistory.driver.name,
      vehiclePlate: routeHistory.vehicle.plate,
      itinerary: this.separateItinerary(routeHistory.itinerary),
      startedAt: routeHistory.startedAt,
      finishedAt: routeHistory.finishedAt,
    };
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
        itinerary: this.separateItinerary(routeHistory.itinerary),
        startedAt: routeHistory.startedAt,
        finishedAt: routeHistory.finishedAt,
      };
    });
  }

  separateItinerary(itinerary: string): LatAndLong[] {
    const split = itinerary.split(',');
    const latAndLong: LatAndLong[] = [];
    for (let i = 0; i < split.length; i += 2) {
      latAndLong.push({
        lat: split[i],
        lng: split[i + 1],
      });
    }
    return latAndLong;
  }

  async listAllEmployess(id: string): Promise<any> {
    const path = await this.routeHistoryRepository.findById(id);
    if (!path)
      throw new HttpException(
        `Não foi encontrado um routeHistory com o id: ${id}`,
        HttpStatus.NOT_FOUND,
      );

    const employeesHistory: EmployeeHistoryDTO[] = [];

    for await (const employee of path.employeeIds.split(',')) {
      const employeeHistory = await this.routeHistoryRepository.getEmployeeById(
        employee,
      );
      employeesHistory.push(employeeHistory);
    }

    const pathMapped = await this.mapperPath(path);
    return { ...pathMapped, employeesHistory };
  }
  async getHistoric(): Promise<any> {
    const historic = await this.routeHistoryRepository.getHistoric();
    let Pending = 0;
    let Started = 0;
    let Finished = 0;
    historic.map((routes) => {
      routes.path.map((path) => {
        if (path.status === 'PENDENTE') Pending++;
        if (path.status === 'EM ANDAMENTO') Started++;
        if (path.status === 'FINALIZADO') Finished++;
      });
    });
    return { Pending, Started, Finished };
  }

  async getHistoricByDate(dateInit: Date, dateFinal: Date): Promise<any> {
    const date = compareDates(dateInit, dateFinal);
    if (!date)
      throw new HttpException(
        'Data inicial tem que ser menor que a data final',
        HttpStatus.BAD_REQUEST,
      );

    const historic = await this.routeHistoryRepository.getHistoricByDate(
      dateInit,
      dateFinal,
    );
    const response: RouteHistoryByDate[] = [];

    historic.map((paths) => {
      const data = new RouteHistoryByDate();

      data.date = paths.startedAt.toISOString().split('T')[0];
      data.totalPaths = 1;
      data.totalEmployess = paths.totalEmployees;
      data.totalEmployessConfirmed = paths.totalConfirmed;
      data.totalEmployessNotConfirmed =
        data.totalEmployess - data.totalEmployessConfirmed;
      data.totalEmployessPresent = paths.employeeIds.split(',').length;
      data.totalEmployessConfirmedButNotPresent =
        data.totalEmployessConfirmed - data.totalEmployessPresent;
      response.push(data);
    });
    console.log(historic);

    const reponseReduce = response.reduce<RouteHistoryByDate[]>((acc, curr) => {
      const { date } = curr;
      const index = acc.findIndex((d) => d.date === date);

      if (index == -1) {
        acc.push(curr);
      }

      if (index >= 0) {
        acc[index].totalEmployess += curr.totalEmployess;
        acc[index].totalEmployessConfirmed += curr.totalEmployessConfirmed;
        acc[index].totalEmployessConfirmedButNotPresent +=
          curr.totalEmployessConfirmedButNotPresent;
        acc[index].totalEmployessNotConfirmed +=
          curr.totalEmployessNotConfirmed;
        acc[index].totalEmployessPresent += curr.totalEmployessPresent;
        acc[index].totalPaths += curr.totalPaths;
      }

      return acc;
    }, []);

    return reponseReduce;
  }
}
