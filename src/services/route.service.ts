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
import {
  MappedRouteDTO,
  MappedRouteShortDTO,
} from '../dtos/route/mappedRoute.dto';
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
  getStartAtAndFinishAt,
} from '../utils/date.service';
import { EmployeeService } from './employee.service';
import { Employee } from '../entities/employee.entity';
import { StatusRouteDTO } from '../dtos/websocket/StatusRoute.dto';
import { MappedPathPinsDTO } from 'src/dtos/path/mappedPath.dto';
import * as turf from '@turf/turf';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { EmployeesOnPath } from 'src/entities/employeesOnPath.entity';
import { Path } from 'src/entities/path.entity';
import IMapBoxServiceIntegration from 'src/integrations/services/mapBoxService/mapbox.service.integration.contract';
import { UpdatePathDTO } from 'src/dtos/path/updatePath.dto';
import { RouteReplacementDriverDTO } from 'src/dtos/route/routeReplacementDriverDTO.dto';
import { distanceBetweenPoints, RouteMobile } from 'src/utils/Utils';
import { GoogleApiServiceIntegration } from 'src/integrations/services/googleService/google.service.integration';
import { DetailsRoute, Waypoints } from 'src/dtos/route/waypoints.dto';
import e from 'express';
import { getDuration } from 'src/utils/Date';

@Injectable()
export class RouteService {
  constructor(
    @Inject('IRouteRepository')
    private readonly routeRepository: IRouteRepository,
    private readonly driverService: DriverService,
    private readonly vehicleService: VehicleService,
    private readonly employeeService: EmployeeService,
    @Inject(forwardRef(() => PathService))
    private readonly pathService: PathService,
    @Inject('IMapBoxServiceIntegration')
    private readonly mapBoxServiceIntegration: IMapBoxServiceIntegration,
    @Inject('IGoogleApiServiceIntegration')
    private readonly googleApiServiceIntegration: GoogleApiServiceIntegration,
  ) {}

  async onModuleInit() {
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
          startsAt: '06:00',
          duration: '00:30',
          startsReturnAt: '18:00',
          type: ETypePath.ROUND_TRIP,
          isAutoRoute: true,
        },
      });
    }
  }

  async create(payload: CreateRouteDTO): Promise<Route> {
    if (payload.employeeIds.length <= 1) {
      throw new HttpException(
        'É necessário selecionar pelo menos 2 colaboradores',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (payload.type === ETypeRoute.CONVENTIONAL && !payload.shift)
      throw new HttpException(
        'É necessário selecionar o turno da rota ao criar uma rota convencional.',
        HttpStatus.BAD_REQUEST,
      );

    if (payload.type === ETypeRoute.EXTRA) {
      if (
        payload.pathDetails.type === ETypePath.ROUND_TRIP &&
        (!payload.pathDetails.startsAt || !payload.pathDetails.startsReturnAt)
      )
        throw new HttpException(
          'É necessário selecionar o horário de ida e volta da rota extra.',
          HttpStatus.BAD_REQUEST,
        );

      if (
        payload.pathDetails.type === ETypePath.ONE_WAY &&
        !payload.pathDetails.startsAt
      )
        throw new HttpException(
          'É necessário selecionar o horário de ida da rota extra.',
          HttpStatus.BAD_REQUEST,
        );
    }

    const startAndReturnAt = (payload.shift && payload.type === ETypeRoute.CONVENTIONAL)
      ? getStartAtAndFinishAt(payload.shift)
      : null;

    const initRouteDate = startAndReturnAt ? startAndReturnAt.startAt : payload.pathDetails.startsAt
    const endRouteDate = startAndReturnAt ? startAndReturnAt.finishAt 
    : payload.pathDetails.startsReturnAt ? payload.pathDetails.startsReturnAt : ''
    const driver = await this.driverService.listById(payload.driverId);
    const vehicle = await this.vehicleService.listById(payload.vehicleId);

    const employeesPins = await this.employeeService.listAllEmployeesPins(
      payload.employeeIds,
    );

    await this.employeesInPins(employeesPins, payload.type);

    const emplopyeeOrdened = await this.getWaypoints(employeesPins, payload.pathDetails.type, payload.pathDetails.duration);
     // const emplopyeeOrdened = employeesPins.map((e) => e.id);
   
    const driverInRoute = await this.routeRepository.findByDriverId(driver.id);

    const employeeInRoute = await this.routeRepository.findByEmployeeIds(
      payload.employeeIds,
    );

    const vehicleInRoute = await this.routeRepository.findByVehicleId(
      vehicle.id,
    );

    await this.driversInRoute(driverInRoute, initRouteDate, endRouteDate);

    await this.vehiclesInRoute(vehicleInRoute, initRouteDate, endRouteDate);

    await this.employeesInRoute(
      employeeInRoute,
      payload.type,
      emplopyeeOrdened.employeesIds,
      payload.pathDetails.type,
    );

    const props = new Route(
      {
        description: payload.description,
        distance: 'EM PROCESSAMENTO',
        status: EStatusRoute.PENDING,
        type: payload.type,
      },
      driver,
      vehicle,
    );

    const route = await this.routeRepository.create(props);
    await this.pathService.generate({
      routeId: route.id,
      employeeIds: emplopyeeOrdened.employeesIds,
      details: {
        ...payload.pathDetails,
        startsAt: initRouteDate,
        startsReturnAt: endRouteDate,
      },
    });

    const routeForUpdate = await this.routeRepository.findById(route.id);

    const distanceLngLat = [];

    routeForUpdate.path[0].employeesOnPath.map((e: EmployeesOnPath) => {
      const lng = +e.employee.pins.at(0).pin.lng;
      const lat = +e.employee.pins.at(0).pin.lat;
      distanceLngLat.push([lng, lat]);
    });

    

    const newRoute = await this.update(route.id, {
      distance: emplopyeeOrdened.distance,
    });

    return newRoute;
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
    let distance = '';
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

      const duration = data.duration ?? route.paths[0].duration;
      const emplopyeeOrdened = await this.getWaypoints(employeesPins,pathType,duration);
     
      distance = emplopyeeOrdened.distance

      for await (const employee of data.employeeIds) {
         await this.employeeService.listById(employee);
      }
      await this.employeesInRouteUpdate(
        employeeInRoute,
        type,
        route,
        emplopyeeOrdened.employeesIds,
        pathType,
      );

      for await (const path of route.paths) {
        await this.pathService.delete(path.id);
      }

      await this.pathService.generate({
        routeId: id,
        employeeIds: emplopyeeOrdened.employeesIds,
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
      (data.startsAt || data.startsReturnAt || data.duration || data.shift )
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
    
    routeEntity.distance = distance === '' ? routeEntity.distance : distance
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

  private mapperDataRoutes(routes: Route[]): MappedRouteShortDTO[] {
    return routes.map((route) => {
      const { driver, vehicle } = route;

      return {
        id: route.id,
        description: route.description,
        distance: route.description,
        type: route.type,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        vehicle: {
          id: vehicle.id,
          plate: vehicle.plate,
        },
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

   async employeesInRoute(
    employeeRoute: Route[],
    type: string,
    ids: string[],
    pathType?: string,
  ): Promise<void> {
    let employeeArray = [];
    const employeeOnReturn = [];
    const employeeOnOneWay = [];
    let ida;
    let volta;
    employeeRoute.forEach((route: Route) => {
      if (route.type !== ETypeRoute.EXTRA) {
        route.path.forEach((path) => {
          path.employeesOnPath.filter((item) => {
            if (type === route.type && ids.includes(item.employee.id)) {
              employeeArray.push(item.employee);
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
    employeeArray.filter((item) => item !== null);
    if (employeeArray.length > 0) {
      employeeArray = employeeArray.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id === item.id),
      );

      throw new HttpException(
        `O(s) colaborador(es)${employeeArray.map(
          (item) => ' ' + item.name,
        )} já está(ão) em uma rota do tipo ${type.toLocaleLowerCase()}!`,
        HttpStatus.CONFLICT,
      );
    }

    if (employeeOnOneWay.length > 0 || employeeOnReturn.length > 0) {
      let message = [
        employeeOnOneWay.length > 0
          ? `O(s) colaborador(es)${employeeOnOneWay.map((item) =>
              item?.map((employee) => ' ' + employee.employee.name),
            )} já está(ão) em uma rota extra do tipo ${ETypePath.ONE_WAY.toLocaleLowerCase()}!`
          : null,
        employeeOnReturn.length > 0
          ? `O(s) colaborador(es)${employeeOnReturn.map((item) =>
              item?.map((employee) => ' ' + employee.employee.name),
            )} já está(ão) em uma rota extra do tipo ${ETypePath.RETURN.toLocaleLowerCase()}!`
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
 /* 
  async  employeesInRoute(
    employeeRoute: Route[],
    type: string,
    ids: string[],
    pathType?: string,
  ): Promise<void> {
    const employeesOnRoute: string[] = [];
    const employeesOnOneWay: string[] = [];
    const employeesOnReturn: string[] = [];
  
    employeeRoute.forEach((route: Route) => {
      if (route.type !== ETypeRoute.EXTRA) {
        route.path.forEach((path) => {
          path.employeesOnPath.forEach((item) => {
            if (type === route.type) {
              employeesOnRoute.push(item.employee.name);
            }
          });
        });
      }
      if (route.type === ETypeRoute.EXTRA) {
        route.path.forEach((path) => {
          if (type === ETypeRoute.EXTRA) {
            if (path.type === ETypePath.ONE_WAY && pathType !== ETypePath.RETURN) {
              const employees = path.employeesOnPath.filter((item) => {
                return ids.includes(item.employee.id);
              }).map((item) => item.employee.name);
              employeesOnOneWay.push(...employees);
            }
            if (path.type === ETypePath.RETURN && pathType !== ETypePath.ONE_WAY) {
              const employees = path.employeesOnPath.filter((item) => {
                return ids.includes(item.employee.id);
              }).map((item) => item.employee.name);
              employeesOnReturn.push(...employees);
            }
          }
        });
      }
    });
  
    if (employeesOnRoute.length > 0) {
      throw new HttpException(
        `The following employee(s) ${employeesOnRoute.join(', ')} is/are already in a route of type ${type.toLowerCase()}!`,
        HttpStatus.CONFLICT,
      );
    }
  
    if (employeesOnOneWay.length > 0 || employeesOnReturn.length > 0) {
      const message = [];
      if (employeesOnOneWay.length > 0) {
        message.push(`The following employee(s) ${employeesOnOneWay.join(', ')} is/are already in an extra route of type ${ETypePath.ONE_WAY.toLowerCase()}!`);
      }
      if (employeesOnReturn.length > 0) {
        message.push(`The following employee(s) ${employeesOnReturn.join(', ')} is/are already in an extra route of type ${ETypePath.RETURN.toLowerCase()}!`);
      }
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message,
        },
        HttpStatus.CONFLICT,
      );
    }
  }
  */ 
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

  async employeesInRouteUpdate(
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
          )} já está(ão) em uma rota extra do tipo ${ETypePath.ONE_WAY.toLocaleLowerCase()}!`,
        employeeOnReturn.length > 0
          ? `O(s) colaborador(es)${employeeOnReturn.map((item) =>
              item?.map((employee) => ' ' + employee.employee.name),
            )} já está(ão) em uma rota extra do tipo ${ETypePath.RETURN.toLocaleLowerCase()}!`
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
    const today = new Date().toLocaleDateString('pt-BR');
    const filePath = './routes.xlsx';
    const workSheetName = 'Rotas';
    const workSheetPath = 'Trajetos';

    // const employees = await this.listAll(page, filters);
    const route = await this.routeRepository.findById(id);

    if (!route)
      throw new HttpException('Rota não encontrada!', HttpStatus.NOT_FOUND);

    const paths: Path[] = [];

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
      // check if path is Return, One Way or Round Trip
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

    // return routes without driver
    if (driverId) {
      return routes.filter((route) => route.driverId !== driverId);
    }
    return routes;
  }

  async getWaypoints(employees: Employee[], type : ETypePath, duration : string): Promise<DetailsRoute> {

 
    const denso = {lat : '-3.110944',
                   lng : '-59.962604'}

    let farthestEmployee: Employee = null;
    let maxDistance = 0;
    for (const employee of employees) {
    const employeeLocation = { lat: employee.pins[0].pin.lat, lng: employee.pins[0].pin.lng };
    const distance = distanceBetweenPoints(denso, employeeLocation);
    if (distance > maxDistance) {
      maxDistance = distance;
      farthestEmployee = employee;
    }
  }
    const index = employees.indexOf(farthestEmployee);
    if (index > -1) {
      employees.splice(index, 1);
    }
    const waypoints =  employees.map((employee) => {
          return  `${employee.pins[0].pin.lat},${employee.pins[0].pin.lng}`
     })
    
  
    const farthestEmployeeLatLng = `${farthestEmployee.pins[0].pin.lat},${farthestEmployee.pins[0].pin.lng}`
    const densoLatLng = `${denso.lat},${denso.lng}`
    const payload = {
      origin: type === ETypePath.RETURN ? densoLatLng : farthestEmployeeLatLng,
      destination: type === ETypePath.RETURN ? farthestEmployeeLatLng : densoLatLng,
      waypoints: waypoints.join('|'),
      travelMode : 'DRIVING'
    }
    const response = await this.googleApiServiceIntegration.getWaypoints(payload);
    const legs = response.routes[0].legs;
    let totalDistance = 0
    let totalDuration = 0;
    for (const leg of legs) {
      totalDuration += leg.duration.value;
      totalDistance += leg.distance.value;
    }

    const maxDuration = getDuration(duration)
    if (totalDuration > maxDuration) {
      throw new HttpException(`Tempo da viagem é maior que ${duration} hora(s), favor diminuir a quantidade de colaboradores e/ou aumentar a duração da rota.`, HttpStatus.BAD_REQUEST);
    }

    const waypointsOrder : number[]= response.routes[0]?.waypoint_order;
    const order  = waypointsOrder.map((item) => {
      return employees[item]
    })

    const distance = totalDistance / 1000 +'km'
    
    type === ETypePath.RETURN ? order.push(farthestEmployee) : order.unshift(farthestEmployee)
    const employeesIds = order.map((employee) => {
      return employee.id;
    })

    return {employeesIds,distance}
}

}



const orderPins = (arr: Employee[]): string[] => {
  const latDenso = -3.110944;
  const longDenso = -59.962604;

  const newArr = [];

  for (const employee of arr) {
    newArr.push(employee);
  }

  const n = newArr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const lat = Number(
        Number(
          newArr[j].pins[newArr[j].pins.length - 1].pin.lat.trim(),
        ).toFixed(5),
      );
      const long = Number(
        Number(
          newArr[j].pins[newArr[j].pins.length - 1].pin.lng.trim(),
        ).toFixed(5),
      );

      const latPointAhead = Number(
        Number(
          newArr[j + 1].pins[newArr[j].pins.length - 1].pin.lat.trim(),
        ).toFixed(5),
      );
      const longPointAhead = Number(
        Number(
          newArr[j + 1].pins[newArr[j].pins.length - 1].pin.lng.trim(),
        ).toFixed(5),
      );
      const fromPoint = turf.point([long, lat]);
      const fromPointAhead = turf.point([longPointAhead, latPointAhead]);

      const toDenso = turf.point([longDenso, latDenso]);

      const distanceToDenso = turf.distance(fromPoint, toDenso);
      const distancePointAheadToDenso = turf.distance(fromPointAhead, toDenso);

      if (distanceToDenso < distancePointAheadToDenso) {
        const temp = newArr[j];
        newArr[j] = newArr[j + 1];
        newArr[j + 1] = temp;
      }
    }
  }

  const employeeIdOrdened = [];

  for (const employee of newArr) {
    employeeIdOrdened.push(employee.id);
  }

  return employeeIdOrdened;
};
