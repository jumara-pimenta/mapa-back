import { FiltersRouteHistoryDTO } from './../dtos/routeHistory/filtersRouteHistory.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RouteHistory } from '../entities/routeHistory.entity';
import IRouteHistoryRepository from '../repositories/routeHistory/routeHistory.repository.contract';
import {
  EmployeeHistoryDTO,
  LatAndLong,
  MappedRouteHistoryDTO,
} from '../dtos/routeHistory/mappedRouteHistory.dto';
import {
  compareDates,
  convertDate,
  getDateStartToEndOfDay,
  getPeriod,
} from '../utils/Date';
import {
  RouteByDateAndShift,
  RouteHistoryByDate,
  RouteSeparated,
  Shifts,
  ShiftsByDate,
} from '../dtos/routeHistory/routeHistoryByDate.dto';
import { MappedPathHistoryDTO } from '../dtos/routeHistory/mappedPathHistory.dto';
import { SinisterService } from './sinister.service';
import { ETypePeriodHistory } from '../utils/ETypes';
import {
  getShiftToGraphic,
  getStartAtAndFinishAt,
} from '../utils/date.service';

@Injectable()
export class RouteHistoryService {
  constructor(
    @Inject('IRouteHistoryRepository')
    private readonly routeHistoryRepository: IRouteHistoryRepository,
    @Inject(forwardRef(() => SinisterService))
    private readonly sinisterService: SinisterService,
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
        startedAt: props.path.startedAt ?? new Date(),
        finishedAt: new Date(),
      },
      props.path,
      props.driver,
      props.vehicle,
      props.sinister,
      props.createdAt,
    );
    const routeHistory = await this.routeHistoryRepository.create(
      newRouteHistory,
    );

    if (newRouteHistory.sinister) {
      for await (const sinister of newRouteHistory.sinister) {
        await this.sinisterService.vinculatePath(
          sinister,
          routeHistory.id,
          props.path,
        );
      }
    }

    return routeHistory;
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

  async listByPathId(id: string): Promise<any> {
    const routeHistory = await this.routeHistoryRepository.findByPathId(id);
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
        path: routeHistory.path.type,
        employeeIds: routeHistory.employeeIds,
        totalEmployees: routeHistory.totalEmployees,
        totalConfirmed: routeHistory.totalConfirmed,
        sinister:
          routeHistory.sinister.length > 0
            ? routeHistory.sinister.map((item) => {
                return {
                  id: item.id,
                  description: item.description,
                  type: item.type,
                  createdBy: item.createdBy,
                };
              })
            : [],
        siniterTotal: routeHistory.sinister.length,
        driver: routeHistory.driver.name,
        vehicle: routeHistory.vehicle.plate,
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
      path: routeHistory.path.type,
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
        sinister:
          routeHistory.sinister.length > 0
            ? routeHistory.sinister.map((item) => {
                return {
                  id: item.id,
                  description: item.description,
                  type: item.type,
                  createdBy: item.createdBy,
                };
              })
            : [],
        sinisterTotal: routeHistory.sinister.length,
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

  async getHistoricByDate(period: ETypePeriodHistory): Promise<any> {
    const dates = getPeriod(period);
    const historic = await this.routeHistoryRepository.getHistoricByDate(
      dates.dateInitial,
      dates.dateFinal,
    );
    const response: RouteHistoryByDate[] = [];

    historic.map((paths) => {
      const data = new RouteHistoryByDate();
      data.date = paths.createdAt.toISOString().split('T')[0];
      data.totalPaths = 1;
      response.push(data);
    });

    const reponseReduce = response.reduce<RouteHistoryByDate[]>((acc, curr) => {
      const { date } = curr;
      const index = acc.findIndex((d) => d.date === date);

      if (index == -1) {
        acc.push(curr);
      }

      if (index >= 0) {
        acc[index].totalPaths += 1;
      }

      return acc;
    }, []);

    reponseReduce.map((item) => {
      item.date = convertDate(item.date);
    });
    return reponseReduce;
  }

  async getShiftsByDate(date: string): Promise<any> {
    const data = getDateStartToEndOfDay(date);
    const historic = await this.routeHistoryRepository.getHistoricByDate(
      data.start,
      data.end,
    );

    const response: ShiftsByDate = { date: date, shifts: [] };
    response.shifts.push({ shift: 'Turno 1', totalPaths: 0 });
    response.shifts.push({ shift: 'Turno 2', totalPaths: 0 });
    response.shifts.push({ shift: 'Turno 3', totalPaths: 0 });
    response.shifts.push({ shift: 'Extra', totalPaths: 0 });

    historic.map((paths) => {
      const shift = getShiftToGraphic(paths.path.startsAt, paths.typeRoute);
      const index = response.shifts.findIndex((d) => d.shift === shift);
      response.shifts[index].totalPaths += 1;
    });

    response.date = convertDate(response.date);
    return response;
  }

  async getRoutesByDateAndShift(date: string, shift: string): Promise<any> {
    const data = getDateStartToEndOfDay(date);
    const historic = await this.routeHistoryRepository.getHistoricByDate(
      data.start,
      data.end,
    );

    const response: RouteByDateAndShift = {
      date: date,
      shift: shift,
      totalPaths: 0,
      routes: [],
    };

    historic.map((paths) => {
      const shiftGraphic = getShiftToGraphic(
        paths.path.startsAt,
        paths.typeRoute,
      );
      if (shiftGraphic === shift) {
        const route = new RouteSeparated();
        route.date = paths.nameRoute;
        route.totalEmployess = paths.totalEmployees;
        route.totalEmployessConfirmed = paths.totalConfirmed;
        route.totalEmployessNotConfirmed =
          route.totalEmployess - route.totalEmployessConfirmed;
        route.totalEmployessPresent = paths.employeeIds.split(',').length;
        route.totalEmployessConfirmedButNotPresent =
          route.totalEmployessConfirmed - route.totalEmployessPresent;
        route.totalSinister = paths.sinister.length;
        response.totalPaths += 1;
        route.startedAt = paths.startedAt;
        route.finishedAt = paths.finishedAt;
        route.type = paths.path.type;
        response.routes.push(route);
      }
    });

    response.date = convertDate(response.date);

    return response;
  }
}
