import { TGoogleWaypointsStatus } from './../utils/TTypes';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Route } from '../entities/route.entity';
import IRouteRepository from '../repositories/route/route.repository.contract';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersRouteDTO } from '../dtos/route/filtersRoute.dto';
import { MappedRouteDTO } from '../dtos/route/mappedRoute.dto';
import { CreateRouteDTO } from '../dtos/route/createRoute.dto';
import { UpdateRouteDTO } from '../dtos/route/updateRoute.dto';
import { DriverService } from './driver.service';
import { VehicleService } from './vehicle.service';
import { PathService } from './path.service';
import {
  EStatusPath,
  EStatusRoute,
  ETypePath,
  ETypeRoute,
  ETypeRouteExport,
  ETypeShiftRotue,
} from '../utils/ETypes';
import { addHours, addMinutes } from 'date-fns';
import {
  convertTimeToDate,
  getDateInLocaleTime,
  getSpecialHour,
  getStartAtAndFinishAt,
} from '../utils/date.service';
import { EmployeeService } from './employee.service';
import { Employee } from '../entities/employee.entity';
import { StatusRouteDTO } from '../dtos/websocket/StatusRoute.dto';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import IMapBoxServiceIntegration from '../integrations/services/mapBoxService/mapbox.service.integration.contract';
import { RouteReplacementDriverDTO } from '../dtos/route/routeReplacementDriverDTO.dto';
import {
  convertToHours,
  distanceBetweenPoints,
  EmployeeList,
  employeesPerRoute,
  RouteMobile,
} from '../utils/Utils';
import { GoogleApiServiceIntegration } from '../integrations/services/googleService/google.service.integration';
import { DetailsRoute } from '../dtos/route/waypoints.dto';
import {
  canSchedule,
  getDuration,
  validateDurationIsInTheRange,
  verifyDateFilter,
} from '../utils/Date';
import { RouteHistoryService } from './routeHistory.service';
import { RouteHistory } from '../entities/routeHistory.entity';
import { faker } from '@faker-js/faker';
import { CreateRouteExtraEmployeeDTO } from '../dtos/route/createRouteExtraEmployee.dto';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';
import { CreateSugestedRouteDTO } from '../dtos/route/createSugestedRoute.dto';
import { SuggestionExtra } from '../dtos/route/createSuggestionExtra.dto';
import { SuggenstionResultDTO } from '../dtos/route/SuggenstionResult.dto';
import { scheduled } from 'rxjs';
import {
  DENSO_COORDINATES,
  DENSO_LOCATION,
  MAX_HOUR_DURATION,
  MAX_MINUTE_DURATION,
  MAXIMUM_DURATION_TIME_OF_THE_ROUTE_SECONDS,
  MIN_MINUTE_DURATION,
  ROUTE_LIMIT_EMPLOYEES,
} from '../utils/Constants';
import { Path } from '../entities/path.entity';
import { EmployeesOnPathService } from './employeesOnPath.service';

@Injectable()
export class RouteService {
  constructor(
    @Inject('IRouteRepository')
    private readonly routeRepository: IRouteRepository,
    private readonly driverService: DriverService,
    private readonly vehicleService: VehicleService,
    @Inject(forwardRef(() => EmployeeService))
    private readonly employeeService: EmployeeService,
    private readonly routeHistoryService: RouteHistoryService,
    @Inject(forwardRef(() => PathService))
    private readonly pathService: PathService,
    @Inject('IMapBoxServiceIntegration')
    private readonly mapBoxServiceIntegration: IMapBoxServiceIntegration,
    @Inject('IGoogleApiServiceIntegration')
    private readonly googleApiServiceIntegration: GoogleApiServiceIntegration,
    @Inject(forwardRef(() => EmployeesOnPathService))
    private readonly employeesOnPathService: EmployeesOnPathService
  ) {}

  async onModuleInit() {
    setTimeout(async () => {
      if (process.env.NODE_ENV !== 'production') {
        const page = new Page();
        const routes = await this.routeRepository.findAll(page);

        if (routes.total === 0) {
          const driver = await this.driverService.listAll(page);
          const vehicle = await this.vehicleService.listAll(page);
          const employee = await this.employeeService.listAll(page);

          await this.create({
            description: 'Rota de teste',
            driverId: driver.items[0].id,
            vehicleId: vehicle.items[0].id,
            employeeIds: employee.items.map((e) => e.id),
            type: ETypeRoute.CONVENTIONAL,
            shift: ETypeShiftRotue.FIRST,
            pathDetails: {
              startsAt: '08:00',
              duration: '00:30',
              startsReturnAt: '18:00',
              type: ETypePath.ROUND_TRIP,
              isAutoRoute: true,
              scheduleDate: getDateInLocaleTime(new Date()),
            },
          });

          await this.create({
            description: 'Rota de teste EXTRA',
            driverId: driver.items[1].id,
            vehicleId: vehicle.items[1].id,
            employeeIds: employee.items.map((e) => e.id),
            type: ETypeRoute.EXTRA,
            shift: ETypeShiftRotue.SECOND,
            pathDetails: {
              startsAt: '07:30',
              duration: '00:30',
              startsReturnAt: '17:30',
              type: ETypePath.ROUND_TRIP,
              isAutoRoute: true,
              scheduleDate: getDateInLocaleTime(new Date()),
            },
          });

          const allPaths = await this.pathService.listAll();
          const path = await this.pathService.listById(allPaths[0].id);
          const pathObj = await this.pathService.getPathById(allPaths[0].id);

          const path1 = await this.pathService.listById(allPaths[1].id);
          const pathObj1 = await this.pathService.getPathById(allPaths[1].id);
          const vehicleHistoric = await this.vehicleService.listById(
            path.vehicle,
          );
          const driverHistoric = await this.driverService.listById(path.driver);
          const today = new Date();
          //remove 1 day

          //create a for to create a route for 4 days
          for (let i = 0; i < 20; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const props = new RouteHistory(
              {
                typeRoute: path.type,
                nameRoute: faker.person.jobTitle(),
                employeeIds: path.employeesOnPath.map((e) => e.id).join(','),
                itinerary: '-3.4441,-60.025',
                totalEmployees: faker.number.int({ min: 10, max: 40 }),
                totalConfirmed: faker.number.int({ min: 10, max: 20 }),
                startedAt: getDateInLocaleTime(new Date(path.startedAt)),
                finishedAt: getDateInLocaleTime(new Date(path.startedAt)),
              },
              pathObj,
              driverHistoric,
              vehicleHistoric,
              [],
              date,
            );

            const props2 = new RouteHistory(
              {
                typeRoute: path1.type,
                nameRoute: faker.person.jobTitle(),
                employeeIds: path1.employeesOnPath.map((e) => e.id).join(','),
                itinerary: '-3.4441,-60.025',
                totalEmployees: faker.number.int({ min: 10, max: 40 }),
                totalConfirmed: faker.number.int({ min: 10, max: 20 }),
                startedAt: getDateInLocaleTime(new Date(path1.startedAt)),
                finishedAt: getDateInLocaleTime(new Date(path1.startedAt)),
              },
              pathObj1,
              driverHistoric,
              vehicleHistoric,
              [],
              date,
            );
            await this.routeHistoryService.create(props);
            await this.routeHistoryService.create(props2);
          }
        }
      }
    }, 10000);
  }

  async create(payload: CreateRouteDTO): Promise<any> {
    const {
      numberOfEmployeesIsInsufficient,
      shiftWasNotProvided,
      itsAnConventionalRoute,
      itsAnExtraRoute,
      itsAnRoundTripPath,
      roundTripTimeNotProvided,
      itsAnOneWayPath,
      oneWayTimeNotProvided,
    } = this.getValidationCriteriaToCreateRoute(payload);

    if (numberOfEmployeesIsInsufficient) {
      throw new HttpException(
        'É necessário selecionar pelo menos 2 colaboradores!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (itsAnConventionalRoute) {
      if (shiftWasNotProvided) {
        throw new HttpException(
          'É necessário selecionar o turno da rota ao criar uma rota convencional.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.checkForEmployeesOnAnotherConventionalRoute(
        payload.employeeIds,
      );
    }

    if (itsAnExtraRoute) {
      if (itsAnRoundTripPath && roundTripTimeNotProvided) {
        throw new HttpException(
          'É necessário selecionar o horário de ida e volta da rota extra.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (itsAnOneWayPath && oneWayTimeNotProvided)
        throw new HttpException(
          'É necessário selecionar o horário de ida da rota extra.',
          HttpStatus.BAD_REQUEST,
        );
    }

    await this.employeeService.checkIfThereAreDeletedEmployees(
      payload.employeeIds,
    );

    const { endRouteDate, initRouteDate } = this.getTimesForRoute(payload);

    const driver = await this.driverService.listById(
      payload.driverId ?? process.env.DENSO_ID,
    );

    const vehicle = await this.vehicleService.listById(
      payload.vehicleId ?? process.env.DENSO_ID,
    );

    const employeesPins = await this.employeeService.listAllEmployeesPins(
      payload.employeeIds,
    );

    await this.employeesInPins(employeesPins, payload.type);

    const employeeOrdened = await this.getWaypoints(
      employeesPins,
      payload.pathDetails.type,
      payload.pathDetails.duration,
      ETypeRoute.CONVENTIONAL,
    );

    const driverInRoute = await this.routeRepository.findByDriverId(driver.id);

    const employeeInRoute = await this.routeRepository.findByEmployeeIds(
      payload.employeeIds,
    );

    const vehicleInRoute = await this.routeRepository.findByVehicleId(
      vehicle.id,
    );

    if (driver.id !== process.env.DENSO_ID)
      await this.driversInRoute(driverInRoute, initRouteDate, endRouteDate);

    if (vehicle.id !== process.env.DENSO_ID)
      await this.vehiclesInRoute(vehicleInRoute, initRouteDate, endRouteDate);

    if (!scheduled)
      await this.checkIfEmployeesOnAnotherRoute(
        employeeInRoute,
        payload.type,
        employeeOrdened.employeesIds,
        payload.pathDetails.type,
      );

    const createdRoute = await this.routeRepository.create(
      new Route(
        {
          description: payload.description,
          distance: 'EM PROCESSAMENTO',
          status: EStatusRoute.PENDING,
          type: payload.type,
        },
        driver,
        vehicle,
      ),
    );

    await this.pathService.generate({
      routeId: createdRoute.id,
      employeeIds: employeeOrdened.employeesIds,
      details: {
        ...payload.pathDetails,
        startsAt: initRouteDate,
        startsReturnAt: endRouteDate,
        scheduleDate:
          payload.pathDetails.scheduleDate ?? getDateInLocaleTime(new Date()),
      },
    });

    const updatedRoute = await this.update(createdRoute.id, {
      distance: employeeOrdened.distance,
    });

    return updatedRoute;
  }

  async createOrderedRoute(payload: CreateRouteDTO): Promise<any> {
    const {
      numberOfEmployeesIsInsufficient,
      shiftWasNotProvided,
      itsAnConventionalRoute,
      itsAnExtraRoute,
      itsAnRoundTripPath,
      roundTripTimeNotProvided,
      itsAnOneWayPath,
      oneWayTimeNotProvided,
    } = this.getValidationCriteriaToCreateRoute(payload);

    if (numberOfEmployeesIsInsufficient) {
      throw new HttpException(
        'É necessário selecionar pelo menos 2 colaboradores!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (itsAnConventionalRoute) {
      if (shiftWasNotProvided) {
        throw new HttpException(
          'É necessário selecionar o turno da rota ao criar uma rota convencional.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.checkForEmployeesOnAnotherConventionalRoute(
        payload.employeeIds,
      );
    }

    if (itsAnExtraRoute) {
      if (itsAnRoundTripPath && roundTripTimeNotProvided) {
        throw new HttpException(
          'É necessário selecionar o horário de ida e volta da rota extra.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (itsAnOneWayPath && oneWayTimeNotProvided)
        throw new HttpException(
          'É necessário selecionar o horário de ida da rota extra.',
          HttpStatus.BAD_REQUEST,
        );
    }

    await this.employeeService.checkIfThereAreDeletedEmployees(
      payload.employeeIds,
    );

    const { endRouteDate, initRouteDate } = this.getTimesForRoute(payload);

    const driver = await this.driverService.listById(
      payload.driverId ?? process.env.DENSO_ID,
    );

    const vehicle = await this.vehicleService.listById(
      payload.vehicleId ?? process.env.DENSO_ID,
    );

    const employeesPins = await this.employeeService.listAllEmployeesPins(
      payload.employeeIds,
    );

    await this.employeesInPins(employeesPins, payload.type);

    const driverInRoute = await this.routeRepository.findByDriverId(driver.id);

    const employeeInRoute = await this.routeRepository.findByEmployeeIds(
      payload.employeeIds,
    );

    const vehicleInRoute = await this.routeRepository.findByVehicleId(
      vehicle.id,
    );

    if (driver.id !== process.env.DENSO_ID)
      await this.driversInRoute(driverInRoute, initRouteDate, endRouteDate);

    if (vehicle.id !== process.env.DENSO_ID)
      await this.vehiclesInRoute(vehicleInRoute, initRouteDate, endRouteDate);

    if (!scheduled)
      await this.checkIfEmployeesOnAnotherRoute(
        employeeInRoute,
        payload.type,
        payload.employeeIds,
        payload.pathDetails.type,
      );

    const createdRoute = await this.routeRepository.create(
      new Route(
        {
          description: payload.description,
          distance: 'EM PROCESSAMENTO',
          status: EStatusRoute.PENDING,
          type: payload.type,
        },
        driver,
        vehicle,
      ),
    );

    await this.pathService.generate({
      routeId: createdRoute.id,
      employeeIds: payload.employeeIds,
      details: {
        ...payload.pathDetails,
        startsAt: initRouteDate,
        startsReturnAt: endRouteDate,
        scheduleDate:
          payload.pathDetails.scheduleDate ?? getDateInLocaleTime(new Date()),
      },
    });

    const updatedRoute = await this.update(createdRoute.id, {
      distance: payload.distance,
    });

    return updatedRoute;
  }

  async createSuggestedRoutes(
    payload: CreateSugestedRouteDTO,
  ): Promise<SuggenstionResultDTO[]> {
    const routes = payload.suggestedExtras.map((route) => {
      return {
        description: route.description,
        driverId: route.driver,
        employeeIds: route.employeesIds,
        vehicleId: route.vehicle,
        type: ETypeRoute.EXTRA,
        distance: route.distance,
        pathDetails: {
          duration: route.duration,
          type:
            payload.type === 'VOLTA' ? ETypePath.RETURN : ETypePath.ROUND_TRIP,
          startsAt: route.time,
          startsReturnAt: route.time,
          isAutoRoute: true,
          scheduleDate: payload.schedule
            ? new Date(payload.date)
            : getDateInLocaleTime(new Date()),
        },
      } as CreateRouteDTO;
    });

    const manyRoutesProcessed = await Promise.allSettled(
      routes.map((route) => this.createOrderedRoute(route)),
    );

    const resolvedRoutes: SuggenstionResultDTO[] = manyRoutesProcessed.map(
      (resolved, routePosition) => {
        if (resolved.status === 'rejected') {
          return {
            description: routes[routePosition].description,
            status: 400,
            error:
              resolved.reason.response?.message ?? resolved.reason.response,
          };
        }

        if (resolved.status === 'fulfilled') {
          return {
            description: routes[routePosition].description,
            status: 201,
          };
        }
      },
    );

    return resolvedRoutes;
  }

  async createExtras(payload: CreateRouteExtraEmployeeDTO): Promise<any> {
    if (payload.schedule) {
      if (payload.date === undefined)
        throw new HttpException(
          'É necessário informar a data para agendar a rota.',
          HttpStatus.BAD_REQUEST,
        );

      verifyDateFilter(payload.date);

      if (!canSchedule(new Date(payload.date))) {
        throw new HttpException(
          'Só é possível agendar rotas para datas futuras.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.employeeService.findJokerPin(payload.employeeIds);

    await this.employeeService.checkExtraEmployee(
      payload.employeeIds,
      payload.date,
    );

    const colabs: MappedEmployeeDTO[] = [];

    for await (const employeeId of payload.employeeIds) {
      const employe = await this.employeeService.listById(employeeId);
      colabs.push(employe);
    }

    const extra = this.suggestRouteExtra(colabs, [], payload.duration);

    return extra;
  }

  async delete(id: string): Promise<Route> {
    const route = await this.listById(id);

    return await this.routeRepository.delete(route.id);
  }

  async listById(id: string): Promise<MappedRouteDTO> {
    const route = await this.routeRepository.findById(id);

    if (!route)
      throw new HttpException(
        'Não foi encontrada está rota!',
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(route);
  }

  async listByDriverId(
    id: string,
    page: Page,
    filters?: FiltersRouteDTO,
  ): Promise<PageResponse<MappedRouteDTO>> {
    const routes = await this.routeRepository.listByDriverId(id, page, filters);

    if (routes.total === 0) {
      throw new HttpException(
        'Não existe routes para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = await this.mapperMany(routes.items);

    return {
      total: routes.total,
      items,
    };
  }

  async listByIdWebsocket(id: string): Promise<Route> {
    const route = await this.routeRepository.findByIdWebsocket(id);

    if (!route)
      throw new HttpException(
        `Não foi encontrada uma rota com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );

    return route;
  }

  async listAll(
    page: Page,
    filters?: FiltersRouteDTO,
  ): Promise<PageResponse<MappedRouteDTO>> {
    const routes = await this.routeRepository.findAll(page, filters);

    if (routes.total === 0) {
      throw new HttpException(
        'Não existe(m) rota(s) para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = await this.mapperMany(routes.items);

    return {
      total: routes.total,
      items,
    };
  }

  async getById(id: string): Promise<Route> {
    const route = await this.routeRepository.findById(id);
    if (!route)
      throw new HttpException(
        'Não foi encontrada esta rota!',
        HttpStatus.NOT_FOUND,
      );

    return route;
  }

  async update(id: string, data: UpdateRouteDTO): Promise<Route> {
    const route = await this.listById(id);
    const routeEntity = await this.getById(id);

    if (data.employeeIds?.length <= 1) {
      throw new HttpException(
        'É necessário selecionar pelo menos 2 colaboradores',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.employeeIds)
      this.employeeService.checkIfThereAreDeletedEmployees(data.employeeIds);

    if (data.employeeIds) {
      const employeeInRoute: Route[] =
        await this.routeRepository.findByEmployeeIds(data.employeeIds);

      const employeesPins = await this.employeeService.listAllEmployeesPins(
        data.employeeIds,
      );
      const type = data.type ?? route.type;

      await this.employeesInPins(employeesPins, type);

      const types = route.paths.map((path) => {
        return path.type;
      });

      let pathType;

      if (types.length === 2) {
        pathType = ETypePath.ROUND_TRIP;
      }
      if (types.length === 1) {
        pathType = types[0];
      }

      for await (const employee of data.employeeIds) {
        await this.employeeService.listById(employee);
      }

      await this.checkIfEmployeesOnAnotherRouteOnUpdate(
        employeeInRoute,
        type,
        route,
        data.employeeIds,
        pathType,
      );

      for await (const path of route.paths) {
        await this.pathService.softDelete(path.id);
      }

      await this.pathService.generate({
        routeId: id,
        employeeIds: data.employeeIds,
        details: {
          type: pathType as ETypePath,
          startsAt:
            route.type === ETypeRoute.CONVENTIONAL
              ? data.shift
                ? getStartAtAndFinishAt(data.shift).startAt
                : route.paths[0].startsAt
              : data.startsAt ?? route.paths[0].startsAt,
          startsReturnAt:
            route.type === ETypeRoute.CONVENTIONAL
              ? data.shift
                ? getStartAtAndFinishAt(data.shift).finishAt
                : route.paths[0].startsAt
              : data.startsReturnAt ?? route.paths[0].startsAt,
          duration: data.duration ?? route.paths[0].duration,
          isAutoRoute: true,
        },
      });
    }

    if (
      !data.employeeIds &&
      (data.startsAt || data.startsReturnAt || data.duration || data.shift)
    ) {
      if (route.paths.length === 2) {
        for await (const path of route.paths) {
          const isOneWay = path.type === ETypePath.ONE_WAY;
          const isReturn = path.type === ETypePath.RETURN;
          const newData = {
            duration: data.duration ?? path.duration,
            startsAt: isOneWay
              ? data.shift
                ? getStartAtAndFinishAt(data.shift).startAt
                : data.startsAt
              : isReturn
              ? data.shift
                ? getStartAtAndFinishAt(data.shift).finishAt
                : data.startsReturnAt
              : path.startsAt,
          };
          await this.pathService.update(path.id, newData);
        }
      }
      if (route.paths.length === 1) {
        await this.pathService.update(route.paths[0].id, {
          startsAt: data.startsAt ?? route.paths[0].startsAt,
          duration: data.duration ?? route.paths[0].duration,
        });
      }
    }

    let driver = routeEntity.driver;
    let vehicle = routeEntity.vehicle;

    if (data.driverId) {
      driver = await this.driverService.listById(data.driverId);
    }

    if (data.vehicleId) {
      vehicle = await this.vehicleService.listById(data.vehicleId);
    }

    const { ...rest } = routeEntity;

    const UpdateRoute = new Route(
      Object.assign(rest, data),
      driver,
      vehicle,
      rest.id,
    );

    return await this.routeRepository.update(UpdateRoute);
  }

  async routeReplacementDriver(data: RouteReplacementDriverDTO): Promise<void> {
    const route1 = await this.listById(data.routeId1);
    const route2 = await this.listById(data.routeId2);

    if (
      route1.status === EStatusRoute.IN_PROGRESS ||
      route2.status === EStatusRoute.IN_PROGRESS
    )
      throw new HttpException(
        'Não é possível trocar o motorista de uma rota em andamento!',
        HttpStatus.CONFLICT,
      );

    await this.update(route1.id, { driverId: route2.driver.id });

    await this.update(route2.id, { driverId: route1.driver.id });
  }

  async updateWebsocket(payload: StatusRouteDTO): Promise<unknown> {
    if (payload.path.startedAt) {
      const Pathdata = await this.pathService.listById(payload.pathId);

      if (Pathdata.employeesOnPath.length === 0) {
        throw new HttpException(
          'Não é possível iniciar uma rota sem colaboradores!',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (payload.route) {
      await this.update(payload.routeId, payload.route);
    }
    if (payload.path) {
      await this.pathService.update(payload.pathId, payload.path);
    }

    const dataFilter = await this.listByIdWebsocket(payload.routeId);

    const dataFilterWebsocket = {
      id: dataFilter.id,
      description: dataFilter.description,
      distance: dataFilter.distance,
      status: dataFilter.status,
      type: dataFilter.type,
      driver: dataFilter.driver.name,
      vehicle: dataFilter.vehicle.plate,
      path: dataFilter.path,
    };

    const path = await this.pathService.listByIdMobile(payload.pathId);

    // check if this date: finishedAt is equal to today

    const today = new Date();
    const date = new Date(path?.finishedAt ?? new Date('2000-01-01'));

    if (
      today.getDay() === date.getDay() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    ) {
      path.status = EStatusPath.FINISHED;
    }
    return {
      vehicle: dataFilterWebsocket.vehicle,
      driver: dataFilterWebsocket.driver,
      ...path,
    };
  }

  async softDelete(id: string): Promise<Route> {
    const route = await this.listById(id);

    return await this.routeRepository.softDelete(route.id);
  }

  async listByIdWithPaths(id: string): Promise<MappedRouteDTO> {
    const route = await this.routeRepository.findById(id);

    return this.mapperOne(route);
  }

  async driversInRoute(
    route: Route[],
    init: string,
    end: string,
  ): Promise<void> {
    route.forEach((route) => {
      route.path.forEach((path) => {
        const startedAtDate = convertTimeToDate(path.startsAt);
        const durationTime = convertTimeToDate(path.duration);

        const finishedAtTime = addHours(
          addMinutes(startedAtDate, durationTime.getMinutes()),
          durationTime.getHours(),
        );

        if (
          convertTimeToDate(init) >= startedAtDate &&
          convertTimeToDate(init) <= finishedAtTime
        ) {
          throw new HttpException(
            'O motorista já está em uma rota neste horário!',
            HttpStatus.CONFLICT,
          );
        }
        if (
          convertTimeToDate(end) >= startedAtDate &&
          convertTimeToDate(end) <= finishedAtTime
        ) {
          throw new HttpException(
            'O motorista já está em uma rota neste horário!',
            HttpStatus.CONFLICT,
          );
        }
      });
    });
  }

  async checkIfEmployeesOnAnotherRoute(
    employeeRoute: Route[],
    type: string,
    ids: string[],
    pathType?: string,
  ): Promise<void> {
    let employeesAllocatedToAnotherRoute = [];
    const employeeOnOneWay = [];
    const employeeOnReturn = [];

    let ida;
    let volta;

    employeeRoute.forEach((route: Route) => {
      if (route.type !== ETypeRoute.EXTRA) {
        route.path.forEach((path) => {
          path.employeesOnPath.filter((item) => {
            if (type === route.type && ids.includes(item.employee.id)) {
              employeesAllocatedToAnotherRoute.push(item.employee);
            }
          });
        });
      }

      if (route.type === ETypeRoute.EXTRA) {
        route.path.forEach((path) => {
          if (type === ETypeRoute.EXTRA) {
            if (path.type === ETypePath.ONE_WAY) {
              if (
                pathType === ETypePath.ONE_WAY ||
                pathType === ETypePath.ROUND_TRIP
              ) {
                ida = path.employeesOnPath.filter((item) => {
                  return ids.includes(item.employee.id);
                });
                employeeOnOneWay.push(ida);
              }
            }

            if (path.type === ETypePath.RETURN) {
              if (
                pathType === ETypePath.RETURN ||
                pathType === ETypePath.ROUND_TRIP
              ) {
                volta = path.employeesOnPath.filter((item) => {
                  return ids.includes(item.employee.id);
                });
                employeeOnReturn.push(volta);
              }
            }
          }
        });
      }
    });

    employeesAllocatedToAnotherRoute.filter((item) => item !== null);

    if (employeesAllocatedToAnotherRoute.length > 0) {
      employeesAllocatedToAnotherRoute =
        employeesAllocatedToAnotherRoute.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        );

      throw new HttpException(
        `O(s) colaborador(es)${employeesAllocatedToAnotherRoute.map(
          (item) => ' ' + item.name,
        )} já está(ão) em uma rota do tipo ${type.toLocaleLowerCase()}!`,
        HttpStatus.CONFLICT,
      );
    }

    const employeesAllocatedInAnotherExtraRoute =
      employeeOnOneWay.length > 0 || employeeOnReturn.length > 0 ? true : false;

    if (employeesAllocatedInAnotherExtraRoute) {
      let message = [
        employeeOnOneWay.length > 0
          ? `O(s) colaborador(es)${employeeOnOneWay.map((item) =>
              item?.map((employee) => ' ' + employee.employee.name),
            )} já está(ão) em uma rota extra do tipo ${ETypePath.ONE_WAY}!`
          : null,
        employeeOnReturn.length > 0
          ? `O(s) colaborador(es)${employeeOnReturn.map((item) =>
              item?.map((employee) => ' ' + employee.employee.name),
            )} já está(ão) em uma rota extra do tipo ${ETypePath.RETURN}!`
          : null,
      ];

      message = message.filter((item) => item !== null);

      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async employeesInPins(route: Employee[], type: string): Promise<void> {
    const employeeArrayPins = [];
    route.forEach((employee: Employee) => {
      if (employee.pins.length === 0) {
        employeeArrayPins.push(employee.name);
      }
      const _employee = [];

      if (type !== ETypeRoute.EXTRA) {
        employee.pins.forEach((item: any) => {
          if (item.type === type) {
            _employee.push(employee.name);
          }
          if (_employee.length === 0) employeeArrayPins.push(employee.name);
        });
      }
    });

    if (employeeArrayPins.length > 0) {
      throw new HttpException(
        `O(s) funcionário(s) ${employeeArrayPins} não pode(m) não possui(em) ponto(s)!`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async vehiclesInRoute(
    route: Route[],
    init: string,
    end: string,
  ): Promise<void> {
    route.forEach((route) => {
      route.path.forEach((path) => {
        const startedAtDate = convertTimeToDate(path.startsAt);
        const durationTime = convertTimeToDate(path.duration);

        const finishedAtTime = addHours(
          addMinutes(startedAtDate, durationTime.getMinutes()),
          durationTime.getHours(),
        );

        if (
          convertTimeToDate(init) >= startedAtDate &&
          convertTimeToDate(init) <= finishedAtTime
        ) {
          throw new HttpException(
            'O veículo já está em uma rota neste horário!',
            HttpStatus.CONFLICT,
          );
        }
        if (
          convertTimeToDate(end) >= startedAtDate &&
          convertTimeToDate(end) <= finishedAtTime
        ) {
          throw new HttpException(
            'O veículo já está em uma rota neste horário!',
            HttpStatus.CONFLICT,
          );
        }
      });
    });
  }

  async checkIfEmployeesOnAnotherRouteOnUpdate(
    routes: Route[],
    type: string,
    route: Route,
    employeeIds: string[],
    pathType: string,
  ): Promise<void> {
    let employeeArray = [];

    const employeeOnReturn = [];
    const employeeOnOneWay = [];

    let ida;
    let volta;

    routes
      .filter((_r) => _r.id != route.id && route.type === _r.type)
      .forEach((routeItem: Route) => {
        if (route.type !== ETypeRoute.EXTRA) {
          routeItem.path.forEach((path) => {
            const employeeInPath = path.employeesOnPath.filter((item) =>
              employeeIds.includes(item.employee.id),
            );

            employeeInPath.forEach((__r) => {
              __r.routeName = routeItem.description;
            });
            if (employeeInPath) {
              employeeArray.push(employeeInPath);
            }
          });
        }

        if (route.type === ETypeRoute.EXTRA) {
          routeItem.path.forEach((path) => {
            if (path.type === ETypePath.ONE_WAY) {
              if (
                pathType === ETypePath.ONE_WAY ||
                pathType === ETypePath.ROUND_TRIP
              ) {
                ida = path.employeesOnPath.filter((item) => {
                  return employeeIds.includes(item.employee.id);
                });
                employeeOnOneWay.push(ida);
              }
            }
            if (path.type === ETypePath.RETURN) {
              if (
                pathType === ETypePath.RETURN ||
                pathType === ETypePath.ROUND_TRIP
              ) {
                volta = path.employeesOnPath.filter((item) => {
                  return employeeIds.includes(item.employee.id);
                });
                employeeOnReturn.push(volta);
              }
            }
          });
        }
      });

    employeeArray.filter((item) => item !== null);

    if (employeeArray.length > 0) {
      throw new HttpException(
        `Um ou mais coloboradores já estão em outra rota do tipo ${type.toLocaleLowerCase()}.  ${employeeArray.map(
          (item) =>
            item.map(
              (employee) =>
                ' Nome: ' +
                employee.employee.name +
                ' Rota: ' +
                employee.routeName,
            ),
        )}`,
        HttpStatus.CONFLICT,
      );
    }

    employeeArray = employeeArray.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );

    if (employeeOnOneWay.length > 0 || employeeOnReturn.length > 0) {
      let message = [
        employeeOnOneWay.length &&
          `O(s) colaborador(es)${employeeOnOneWay.map((item) =>
            item?.map((employee) => ' ' + employee.employee.name),
          )} já está(ão) em uma rota extra do tipo ${ETypePath.ONE_WAY}!`,
        employeeOnReturn.length > 0
          ? `O(s) colaborador(es)${employeeOnReturn.map((item) =>
              item?.map((employee) => ' ' + employee.employee.name),
            )} já está(ão) em uma rota extra do tipo ${ETypePath.RETURN}!`
          : null,
      ];

      message = message.filter((item) => item !== null);

      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async routeIdByPathId(pathId: string): Promise<string> {
    const path = await this.routeRepository.findRouteIdByPathId(pathId);
    if (!path) {
      throw new HttpException('Rota não encontrada!', HttpStatus.NOT_FOUND);
    }
    return path;
  }

  async routeDataByPathId(pathId: string): Promise<any> {
    const path = await this.routeRepository.findRouteDataByPathId(pathId);
    if (!path) {
      throw new HttpException('Rota não encontrada!', HttpStatus.NOT_FOUND);
    }
    return path;
  }

  async exportsRouteFile(page: Page, type: ETypeRouteExport): Promise<any> {
    const headers = [
      'DESCRIÇÃO',
      'DISTÂNCIA',
      'MOTORISTA',
      'ESTADO',
      'TIPO DA ROTA',
      'VEÍCULO',
      'QUANTIDADE DE COLABORADORES',
    ];
    const today = new Date().toLocaleDateString('pt-BR');

    const filePath = './routes.xlsx';
    const workSheetName = 'Rotas';

    // const employees = await this.listAll(page, filters);
    const route = await this.routeRepository.findAllToExport(page, type);
    if (route.total === 0) {
      throw new HttpException(
        'Não existem rotas para serem exportados!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const exportedRouteToXLSX = async (
      routes: Route[],
      headers,
      workSheetName,
      filePath,
    ) => {
      const data = routes.map((route) => {
        return [
          route.description,
          route.distance,
          route.driver.name,
          route.status,
          route.type,
          route.vehicle.plate,
          route.path[0].employeesOnPath.length,
        ];
      });

      const routeInformationHeader = [
        [`ROTAS EXPORTADOS: ${today}`],
        [`TOTAL DE ROTAS EXPORTADAS: ${data.length}`],
      ];

      const routeInformationFooter = [
        ['**********************************************'],
        ['***********************************************'],
        ['************************'],
        ['*************************************'],
        ['**********'],
        ['************************************************************'],
        ['**********'],
        ['*******'],
      ];

      const workBook = XLSX.utils.book_new();
      const workSheetData = [
        '',
        routeInformationHeader,
        '',
        routeInformationFooter,
        '',
        headers,
        ...data,
        '',
        routeInformationFooter,
      ];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
      XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
      const pathFile = path.resolve(filePath);
      XLSX.writeFile(workBook, pathFile);

      const exportedKanbans = fs.createReadStream(pathFile);

      return new StreamableFile(exportedKanbans);
    };

    return exportedRouteToXLSX(route.items, headers, workSheetName, filePath);
  }

  async exportsPathToFile(id: string): Promise<any> {
    const filePath = './routes.xlsx';
    const workSheetName = 'Rotas';
    const workSheetPath = 'Trajetos';

    // const employees = await this.listAll(page, filters);
    const route = await this.routeRepository.findById(id);

    if (!route)
      throw new HttpException('Rota não encontrada!', HttpStatus.NOT_FOUND);

    const exportedPathToXLSX = async (
      routes: Route,
      workSheetName,
      workSheetPath,
      filePath,
    ) => {
      /*  const data1 = routes.map((route) => {
        return [
          route.description,
          route.distance,
          route.driver.name,
          route.status,
          route.type,
          route.vehicle.plate,
          route.path[0].employeesOnPath.length,
        ];
      });
 */
      const data = [
        [route.description],
        [
          `Motorista: ${route.driver.name}`,
          `Tipo da Rota: ${route.type}`,
          `Veículo: ${route.vehicle.plate}`,
          `Quantidade de Colaboradores: ${route.path[0].employeesOnPath.length}`,
        ],
      ];
      for await (const path of route.path) {
        data.push(['']);
        data.push(['']);
        data.push(['', `Trajeto de ${path.type}`, '']);
        data.push(['Posição', 'Colaborador', 'Endereço']);
        for await (const employee of path.employeesOnPath) {
          data.push([
            employee.position.toString(),
            employee.employee.name,
            employee.employee.pins[0].pin.details,
          ]);
        }
      }

      const workBook = XLSX.utils.book_new();
      const workSheetData = [...data];
      const sheetOptions = [
        { wch: 20 },
        { wch: 40 },
        { wch: 60 },
        { wch: 40 },
        { wch: 40 },
        { wch: 40 },
        { wch: 40 },
      ];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
      workSheet['!cols'] = sheetOptions;
      XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
      XLSX.utils.book_append_sheet(workBook, workSheet, workSheetPath);

      const pathFile = path.resolve(filePath);
      XLSX.writeFile(workBook, pathFile);

      const exportedKanbans = fs.createReadStream(pathFile);

      return new StreamableFile(exportedKanbans);
    };

    return exportedPathToXLSX(route, workSheetName, workSheetPath, filePath);
  }

  async listAllMobile(
    page: Page,
    filters?: FiltersRouteDTO,
    driverId?: string,
  ): Promise<RouteMobile[]> {
    const res = await this.listAll(page, filters);

    const routes = res.items.map((route) => {
      const pathType =
        route.paths.length === 1 ? route.paths[0].type : 'Ida e Volta';

      const time = () => {
        if (pathType === 'Ida e Volta') {
          if (route.paths[0].type === 'VOLTA')
            return `${route.paths[1].startsAt} - ${route.paths[0].startsAt}`;
          return `${route.paths[0].startsAt} - ${route.paths[1].startsAt}`;
        }
        return `${route.paths[0].startsAt}`;
      };

      return {
        id: route.id,
        description: route.description,
        distance: route.distance,
        driver: route.driver.name,
        driverId: route.driver.id,
        vehicle: route.vehicle.plate,
        status: route.status,
        pathType,
        type: route.type,
        time: time(),
        duration: route.paths[0].duration,
      };
    });

    if (driverId) {
      return routes.filter((route) => route.driverId !== driverId);
    }
    return routes;
  }

  async getWaypoints(
    employees: Employee[],
    type: ETypePath,
    duration: string,
    typeRoute: ETypeRoute,
  ): Promise<DetailsRoute> {
    if (employees.length > ROUTE_LIMIT_EMPLOYEES)
      throw new HttpException(
        `A roterização automática não pode ter mais de ${ROUTE_LIMIT_EMPLOYEES} colaboradores`,
        HttpStatus.BAD_REQUEST,
      );

    let farthestEmployee: Employee = null;
    let MAX_DISTANCE = 0;

    for (const employee of employees) {
      const EMPLOYEE_COORDINATES = {
        lat: employee.pins[0].pin.lat,
        lng: employee.pins[0].pin.lng,
      };

      const distance = distanceBetweenPoints(
        DENSO_COORDINATES,
        EMPLOYEE_COORDINATES,
      );

      if (distance > MAX_DISTANCE) {
        MAX_DISTANCE = distance;
        farthestEmployee = employee;
      }
    }

    const index = employees.indexOf(farthestEmployee);

    if (index > -1) {
      employees.splice(index, 1);
    }

    const waypoints = employees.map((employee) => {
      return `${employee.pins[0].pin.lat},${employee.pins[0].pin.lng}`;
    });

    const FARTHEST_EMPLOYEE_LOCATION = `${farthestEmployee.pins[0].pin.lat},${farthestEmployee.pins[0].pin.lng}`;

    const generatedWaypoints =
      await this.googleApiServiceIntegration.getWaypoints({
        origin:
          type === ETypePath.RETURN
            ? DENSO_LOCATION
            : FARTHEST_EMPLOYEE_LOCATION,
        destination:
          type === ETypePath.RETURN
            ? FARTHEST_EMPLOYEE_LOCATION
            : DENSO_LOCATION,
        waypoints: waypoints.join('|'),
        travelMode: 'DRIVING',
      });

    if (
      (generatedWaypoints?.status &&
        (generatedWaypoints.status as TGoogleWaypointsStatus) ==
          'ZERO_RESULTS') ||
      !generatedWaypoints
    ) {
      throw new HttpException(
        'Não foi possível traçar um trajeto entre os pontos. Verifique se o ponto dos colaboradores estão dentro do limite permitido!',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const legs = generatedWaypoints.routes[0].legs;

    let totalDistance = 0;
    let totalDuration = 0;

    for (const leg of legs) {
      totalDuration += leg.duration.value;
      totalDistance += leg.distance.value;
    }

    if (typeRoute === ETypeRoute.CONVENTIONAL) {
      if (totalDuration > MAXIMUM_DURATION_TIME_OF_THE_ROUTE_SECONDS) {
        throw new HttpException(
          `A duração da rota é maior do que ${MAXIMUM_DURATION_TIME_OF_THE_ROUTE_SECONDS} horas. Reduza a quantidade de colaboradores e/ou aumente a duração da rota.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const waypointsOrder: number[] =
      generatedWaypoints.routes[0]?.waypoint_order;

    const order = waypointsOrder.map((item) => {
      return employees[item];
    });

    const FINISH_DISTANCE = totalDistance / 1000 + 'km';

    type === ETypePath.RETURN
      ? order.push(farthestEmployee)
      : order.unshift(farthestEmployee);

    const employeesIds = order.map((employee) => {
      return employee.id;
    });

    return { employeesIds, distance: FINISH_DISTANCE };
  }

  async getWaypointsExtra(
    employees: any[],
    duration: string,
    typeRoute: ETypeRoute,
  ): Promise<SuggestionExtra> {
    const FARTHEST_EMPLOYEE = this.getFarthestEmployee(employees);

    const FARTHEST_EMPLOYEE_POSITION = employees.indexOf(FARTHEST_EMPLOYEE);

    if (FARTHEST_EMPLOYEE_POSITION > -1) {
      employees.splice(FARTHEST_EMPLOYEE_POSITION, 1);
    }

    const waypoints = employees.map((employee) => {
      return `${employee.pins[0].lat},${employee.pins[0].lng}`;
    });

    const FARTHEST_EMPLOYEE_COORDINATES = `${FARTHEST_EMPLOYEE.pins[0].lat},${FARTHEST_EMPLOYEE.pins[0].lng}`;

    const generatedWaypoints =
      await this.googleApiServiceIntegration.getWaypoints({
        origin: DENSO_LOCATION,
        destination: FARTHEST_EMPLOYEE_COORDINATES,
        waypoints: waypoints.join('|'),
        travelMode: 'DRIVING',
      });

    const legs = generatedWaypoints.routes[0].legs;

    let TOTAL_DISTANCE = 0;
    let TOTAL_DURATION = 0;

    for (const leg of legs) {
      TOTAL_DURATION += leg.duration.value;
      TOTAL_DISTANCE += leg.distance.value;
    }

    if (typeRoute === ETypeRoute.CONVENTIONAL) {
      if (TOTAL_DURATION > MAXIMUM_DURATION_TIME_OF_THE_ROUTE_SECONDS) {
        throw new HttpException(
          `Tempo da viagem é maior que ${duration} hora(s), favor diminuir a quantidade de colaboradores e/ou aumentar a duração da rota.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const waypointsOrder: number[] =
      generatedWaypoints.routes[0]?.waypoint_order;

    const order = waypointsOrder.map((item) => {
      return employees[item];
    });

    const FINAL_DISTANCE = TOTAL_DISTANCE / 1000 + 'km';

    order.push(FARTHEST_EMPLOYEE);

    const finalOrderEmployees = order.map((employee, index) => {
      return {
        id: employee.id,
        name: employee.name,
        registration: employee.registration,
        sequency: index + 1,
        distance: employee.distance,
        pins: [
          {
            id: employee.pins[0].id,
            title: employee.pins[0].title,
            local: employee.pins[0].local,
            details: employee.pins[0].details,
            lat: employee.pins[0].lat,
            lng: employee.pins[0].lng,
          },
        ],
      };
    });

    return {
      employee: finalOrderEmployees,
      distance: FINAL_DISTANCE,
      totalDurationTime: TOTAL_DURATION,
    };
  }

  private getFarthestEmployee(employees: any[]) {
    let FARTHEST_EMPLOYEE: any = null;
    let MAX_DISTANCE = 0;

    for (const employee of employees) {
      const EMPLOYEE_COORDINATES = {
        lat: employee.pins[0].lat,
        lng: employee.pins[0].lng,
      };

      const DISTANCE = distanceBetweenPoints(
        DENSO_COORDINATES,
        EMPLOYEE_COORDINATES,
      );

      if (DISTANCE > MAX_DISTANCE) {
        MAX_DISTANCE = DISTANCE;
        FARTHEST_EMPLOYEE = employee;
      }
    }

    return FARTHEST_EMPLOYEE;
  }

  async suggestRouteExtra(
    colabs: any,
    rotas: any[],
    duration: string,
    rotasExtraTime?: any[],
    quantityColabs?: number,
  ) {
    validateDurationIsInTheRange(duration, {
      maxHour: MAX_HOUR_DURATION,
      maxMinute: MAX_MINUTE_DURATION,
      minMinute: MIN_MINUTE_DURATION,
    });

    const ordemEmployee = this.calculateDistance(colabs, DENSO_COORDINATES, []);

    const routes = this.separateWays(ordemEmployee, [], quantityColabs);

    const extra: SuggestionExtra[] = [...rotas];

    const extraTime: SuggestionExtra[] = rotasExtraTime
      ? [...rotasExtraTime]
      : [];

    for await (const route of routes) {
      const path: SuggestionExtra = await this.getWaypointsExtra(
        route,
        duration,
        ETypeRoute.EXTRA,
      );

      if (path.totalDurationTime > getDuration(duration)) extraTime.push(path);

      if (path.totalDurationTime < getDuration(duration)) extra.push(path);
    }

    if (extraTime.length > 0) {
      const colabs = extraTime.map((item) => {
        return item.employee;
      });

      extraTime.shift();

      return await this.suggestRouteExtra(
        colabs[0],
        extra,
        duration,
        extraTime,
        Math.round(colabs[0].length / 2),
      );
    }

    const response = extra.map((item) => {
      return {
        employees: item.employee,
        distance: item.distance,
        duration: convertToHours(item.totalDurationTime),
      };
    });

    return response;
  }

  private getValidationCriteriaToCreateRoute(payload: CreateRouteDTO) {
    const numberOfEmployeesIsInsufficient =
      payload.employeeIds?.length <= 1 ? true : false;

    const shiftWasNotProvided = !payload.shift ? true : false;

    const itsAnConventionalRoute =
      payload.type === ETypeRoute.CONVENTIONAL ? true : false;

    const itsAnExtraRoute = payload.type === ETypeRoute.EXTRA ? true : false;

    const itsAnRoundTripPath =
      payload.pathDetails.type === ETypePath.ROUND_TRIP ? true : false;

    const roundTripTimeNotProvided =
      !payload.pathDetails.startsAt || !payload.pathDetails.startsReturnAt
        ? true
        : false;

    const itsAnOneWayPath =
      payload.pathDetails.type === ETypePath.ONE_WAY ? true : false;

    const oneWayTimeNotProvided = !payload.pathDetails.startsAt ? true : false;

    return {
      numberOfEmployeesIsInsufficient,
      shiftWasNotProvided,
      itsAnConventionalRoute,
      itsAnExtraRoute,
      itsAnRoundTripPath,
      roundTripTimeNotProvided,
      itsAnOneWayPath,
      oneWayTimeNotProvided,
    };
  }

  async listByIdNotMapped(id: string): Promise<Route> {
    const route = await this.routeRepository.findById(id);

    if (!route)
      throw new HttpException(
        'Não foi encontrada está rota!',
        HttpStatus.NOT_FOUND,
      );

    return route;
  }

  async updateTotalDistanceRoute(path: Path): Promise<void> {

    const route = await this.listById(path.route.id);

    const employees = await this.employeeService.listManyEmployeesByPath(
      path.id,
    );

    const totalDistance = await this.getTotalDistanceRoute(
      employees,
      path.type as ETypePath,
    );

    await this.routeRepository.updateTotalDistance(route.id, totalDistance);
  }

  async updateEmployeePositionOnPath(routeId: string): Promise<void> {
    const route = await this.listByIdNotMapped(routeId);
    
    const { path: paths } = route;

    let newPosition = 1;
    let currentPathId = '';

    for await (const path of paths) {
      if (currentPathId === '') currentPathId = path.id;

      if (currentPathId !== '' && currentPathId !== path.id) {
        currentPathId = path.id;
        newPosition = 1;
      }

      for await (const employeeOnPath of path.employeesOnPath) {
        await this.employeesOnPathService.updateEmployeePositionByEmployeeAndPath(
          employeeOnPath.employee.id,
          path.id,
          newPosition,
        );

        newPosition++;
      }

      await this.updateTotalDistanceRoute(path as Path);
    }

  }

  async getTotalDistanceRoute(
    employees: Employee[],
    type: ETypePath,
  ): Promise<string> {
    if (!employees.length) return;

    let farthestEmployee: Employee = null;
    let MAX_DISTANCE = 0;

    for (const employee of employees) {
      const EMPLOYEE_COORDINATES = {
        lat: employee.pins[0].pin.lat,
        lng: employee.pins[0].pin.lng,
      };

      const distance = distanceBetweenPoints(
        DENSO_COORDINATES,
        EMPLOYEE_COORDINATES,
      );

      if (distance > MAX_DISTANCE) {
        MAX_DISTANCE = distance;
        farthestEmployee = employee;
      }
    }

    const index = employees.indexOf(farthestEmployee);

    if (index > -1) {
      employees.splice(index, 1);
    }

    const waypoints = employees.map((employee) => {
      return `${employee.pins[0].pin.lat},${employee.pins[0].pin.lng}`;
    });

    const FARTHEST_EMPLOYEE_LOCATION = `${farthestEmployee.pins[0].pin.lat},${farthestEmployee.pins[0].pin.lng}`;

    const generatedWaypoints =
      await this.googleApiServiceIntegration.getWaypoints({
        origin:
          type === ETypePath.RETURN
            ? DENSO_LOCATION
            : FARTHEST_EMPLOYEE_LOCATION,
        destination:
          type === ETypePath.RETURN
            ? FARTHEST_EMPLOYEE_LOCATION
            : DENSO_LOCATION,
        waypoints: waypoints.join('|'),
        travelMode: 'DRIVING',
      });

    if (
      (generatedWaypoints?.status &&
        (generatedWaypoints.status as TGoogleWaypointsStatus) ==
          'ZERO_RESULTS') ||
      !generatedWaypoints
    ) {
      throw new HttpException(
        'Não foi possível traçar um trajeto entre os pontos. Verifique se o ponto dos colaboradores estão dentro do limite permitido!',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const legs = generatedWaypoints.routes[0].legs;

    let totalDistance = 0;

    for (const leg of legs) {
      totalDistance += leg.distance.value;
    }

    const waypointsOrder: number[] =
      generatedWaypoints.routes[0]?.waypoint_order;

    const order = waypointsOrder.map((item) => {
      return employees[item];
    });

    const FINISH_DISTANCE = totalDistance / 1000 + 'km';

    type === ETypePath.RETURN
      ? order.push(farthestEmployee)
      : order.unshift(farthestEmployee);

    return FINISH_DISTANCE;
  }

  private async checkForEmployeesOnAnotherConventionalRoute(
    employeesId: string[],
  ): Promise<void> {
    for await (const id of employeesId) {
      const employee = await this.employeeService.listById(id);

      const employeeOnAnotherRoute =
        await this.routeRepository.findEmployeeOnRouteByType(
          employee.id,
          'CONVENCIONAL',
        );

      if (employeeOnAnotherRoute) {
        throw new HttpException(
          `Colaborador já está alocado em outra rota convencional: ${employee.name}`,
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  private getTimesForRoute(props: CreateRouteDTO) {
    const startAndReturnAt =
      props.shift && props.type === ETypeRoute.CONVENTIONAL
        ? props.shift !== ETypeShiftRotue.SPECIAL
          ? getStartAtAndFinishAt(props.shift)
          : getSpecialHour(
              props.pathDetails.departureTime,
              props.pathDetails.backTime,
            )
        : null;

    const initRouteDate = startAndReturnAt
      ? startAndReturnAt.startAt
      : props.pathDetails.startsAt;

    const endRouteDate = startAndReturnAt
      ? startAndReturnAt.finishAt
      : props.pathDetails.startsReturnAt
      ? props.pathDetails.startsReturnAt
      : '';

    return { startAndReturnAt, initRouteDate, endRouteDate };
  }

  private calculateDistance(employee: any[], location: any, list: any): any {
    const employees = employee;

    const startPoint = { lat: location.lat, lng: location.lng };

    let closestEmployee: any = null;

    let minDistance = 10000;

    for (const employee of employees) {
      const employeeLocation = {
        lat: employee.pins[0].lat,
        lng: employee.pins[0].lng,
      };

      const distance = distanceBetweenPoints(startPoint, employeeLocation);

      if (distance <= minDistance) {
        minDistance = distance;
        closestEmployee = employee;
      }
    }

    const index = employees.indexOf(closestEmployee);

    const listaLegal = list;

    if (index > -1) {
      employees.splice(index, 1);
      listaLegal.push({ ...closestEmployee, minDistance });
    }

    if (employees.length > 0)
      this.calculateDistance(employees, closestEmployee.pins[0], listaLegal);

    return listaLegal;
  }

  private separateWays(
    list: EmployeeList[],
    new_list: any[],
    quantityColabs?: number,
  ): any {
    const manipulateList = [...list];
    const route = [...new_list];

    if (list.length === 0) {
      return new_list;
    }

    const colabsPerRoute = employeesPerRoute(list.length, quantityColabs);

    if (list.length <= colabsPerRoute && list.length > 0) {
      const listRoute = manipulateList.slice(0, list.length);
      route.push([...listRoute]);
      return this.separateWays([], route);
    }

    if (list.length > colabsPerRoute) {
      const listRoute = manipulateList.slice(0, colabsPerRoute);
      const listRest = manipulateList.slice(colabsPerRoute, list.length);
      const ordemListRest = this.calculateDistance(
        listRest,
        DENSO_COORDINATES,
        [],
      );
      route.push([...listRoute]);

      return this.separateWays(ordemListRest, route);
    }
  }

  private async mapperMany(routes: Route[]): Promise<MappedRouteDTO[]> {
    return routes.map((route) => {
      const { driver, vehicle, path } = route;

      return {
        id: route.id,
        description: route.description,
        distance: route.distance,
        status: route.status,
        type: route.type,
        createdAt: route.createdAt,
        driver: {
          id: driver.id,
          name: driver.name,
          cpf: driver.cpf,
          cnh: driver.cnh,
          validation: driver.validation,
          category: driver.category,
          createdAt: driver.createdAt,
          updatedAt: driver.updatedAt,
        },
        vehicle: {
          id: vehicle.id,
          plate: vehicle.plate,
          company: vehicle.company,
          type: vehicle.type,
          lastSurvey: vehicle.lastSurvey,
          expiration: vehicle.expiration,
          capacity: vehicle.capacity,
          renavam: vehicle.renavam,
          lastMaintenance: vehicle.lastMaintenance,
          note: vehicle.note,
          isAccessibility: vehicle.isAccessibility,
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
        },
        paths: path.map((item) => {
          const { employeesOnPath } = item;

          return {
            id: item.id,
            duration: item.duration,
            finishedAt: item.finishedAt,
            startedAt: item.startedAt,
            startsAt: item.startsAt,
            status: item.status,
            type: item.type,
            createdAt: item.createdAt,
            scheduleDate: item.scheduleDate,
            employeesOnPath: employeesOnPath.map((item) => {
              const { employee } = item;

              return {
                id: item.id,
                boardingAt: item.boardingAt,
                confirmation: item.confirmation,
                disembarkAt: item.disembarkAt,
                position: item.position,
                details: {
                  id: employee?.id,
                  name: employee?.name,
                  address: employee?.address,
                  shift: employee?.shift,
                  registration: employee?.registration,
                  location: {
                    lat: item?.employee?.pins?.at(0)?.pin?.lat,
                    lng: item?.employee?.pins?.at(0)?.pin?.lng,
                  },
                },
              };
            }),
          };
        }),
        quantityEmployees: path[0]?.employeesOnPath?.length,
      };
    });
  }

  private mapperOne(route: Route): MappedRouteDTO {
    const { driver, vehicle, path } = route;

    return {
      id: route.id,
      description: route.description,
      distance: route.distance,
      status: route.status,
      type: route.type,
      createdAt: route.createdAt,
      driver: {
        id: driver.id,
        name: driver.name,
        cpf: driver.cpf,
        cnh: driver.cnh,
        validation: driver.validation,
        category: driver.category,
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt,
      },
      vehicle: {
        id: vehicle.id,
        plate: vehicle.plate,
        company: vehicle.company,
        type: vehicle.type,
        lastSurvey: vehicle.lastSurvey,
        expiration: vehicle.expiration,
        capacity: vehicle.capacity,
        renavam: vehicle.renavam,
        lastMaintenance: vehicle.lastMaintenance,
        note: vehicle.note,
        isAccessibility: vehicle.isAccessibility,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
      },
      paths: path.map((item) => {
        const { employeesOnPath } = item;

        return {
          id: item.id,
          duration: item.duration,
          finishedAt: item.finishedAt,
          startedAt: item.startedAt,
          startsAt: item.startsAt,
          status: item.status,
          type: item.type,
          createdAt: item.createdAt,
          employeesOnPath: employeesOnPath.map((item) => {
            const { employee } = item;
            const { pins } = employee;

            return {
              id: item.id,
              boardingAt: item.boardingAt,
              confirmation: item.confirmation,
              disembarkAt: item.disembarkAt,
              position: item.position,
              details: {
                id: employee.id,
                name: employee.name,
                address: employee.address,
                shift: employee.shift,
                registration: employee.registration,
                location: {
                  lat: pins.at(0).pin.lat,
                  lng: pins.at(0).pin.lng,
                  title: pins.at(0).pin.title,
                  details: pins.at(0).pin.details,
                  local: pins.at(0).pin.local,
                },
              },
            };
          }),
        };
      }),
      quantityEmployees: path[0]?.employeesOnPath?.length,
    };
  }
}
