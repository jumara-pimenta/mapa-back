import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Route } from '../entities/route.entity';
import IRouteRepository from '../repositories/route/route.repository.contract';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersRouteDTO } from '../dtos/route/filtersRoute.dto';
import { MappedRouteDTO, MappedRouteShortDTO } from '../dtos/route/mappedRoute.dto';
import { CreateRouteDTO } from '../dtos/route/createRoute.dto';
import { UpdateRouteDTO } from '../dtos/route/updateRoute.dto';
import { DriverService } from './driver.service';
import { VehicleService } from './vehicle.service';
import { PathService } from './path.service';
import { EStatusRoute, ETypePath } from '../utils/ETypes';
import { addHours, addMinutes } from 'date-fns';
import { convertTimeToDate } from '../utils/date.service';
import { EmployeeService } from './employee.service';
import { Employee } from '../entities/employee.entity';
import { StatusRouteDTO } from '../dtos/websocket/StatusRoute.dto';

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
  ) {}

  async create(payload: CreateRouteDTO): Promise<Route> {
    const employeeArray = [];
    const employeeArrayPins = [];
    const initRouteDate = convertTimeToDate(payload.pathDetails.startsAt);
    const endRouteDate = convertTimeToDate(payload.pathDetails.duration);

    const driver = await this.driverService.listById(payload.driverId);
    const vehicle = await this.vehicleService.listById(payload.vehicleId);

    const employeesPins = await this.employeeService.listAllEmployeesPins(
      payload.employeeIds,
    );
    employeesPins.forEach((employee: Employee) => {
      if (employee.pins.length === 0) {
        employeeArrayPins.push(employee.name);
      }
      const _employee = [];

      employee.pins.forEach((item: any) => {
        if (item.type === payload.type) {
          _employee.push(employee.name);
        }
        if (_employee.length === 0) employeeArrayPins.push(employee.name);
      });
    });

    if (employeeArrayPins.length > 0) {
      throw new HttpException(
        `O(s) funcionário(s) ${employeeArrayPins} não pode(m) não possui(em) ponto em rota do tipo ${payload.type.toLocaleLowerCase()}!`,
        HttpStatus.CONFLICT,
      );
    }

    const driverInRoute = await this.routeRepository.findByDriverId(driver.id);

    const employeeInRoute = await this.routeRepository.findByEmployeeIds(
      payload.employeeIds,
    );

    const vehicleInRoute = await this.routeRepository.findByVehicleId(
      vehicle.id,
    );

    driverInRoute.forEach((route) => {
      route.path.forEach((path) => {
        const startedAtDate = convertTimeToDate(path.startsAt);
        const durationTime = convertTimeToDate(path.duration);

        const finishedAtTime = addHours(
          addMinutes(startedAtDate, durationTime.getMinutes()),
          durationTime.getHours(),
        );

        if (initRouteDate >= startedAtDate && initRouteDate <= finishedAtTime) {
          throw new HttpException(
            'O motorista já está em uma rota neste horário!',
            HttpStatus.CONFLICT,
          );
        }
        if (endRouteDate >= startedAtDate && endRouteDate <= finishedAtTime) {
          throw new HttpException(
            'O motorista já está em uma rota neste horário!',
            HttpStatus.CONFLICT,
          );
        }
      });
    });

    vehicleInRoute.forEach((route) => {
      route.path.forEach((path) => {
        const startedAtDate = convertTimeToDate(path.startsAt);
        const durationTime = convertTimeToDate(path.duration);

        const finishedAtTime = addHours(
          addMinutes(startedAtDate, durationTime.getMinutes()),
          durationTime.getHours(),
        );

        if (initRouteDate >= startedAtDate && initRouteDate <= finishedAtTime) {
          throw new HttpException(
            'O veículo já está em uma rota neste horário!',
            HttpStatus.CONFLICT,
          );
        }
        if (endRouteDate >= startedAtDate && endRouteDate <= finishedAtTime) {
          throw new HttpException(
            'O veículo já está em uma rota neste horário!',
            HttpStatus.CONFLICT,
          );
        }
      });
    });

    employeeInRoute.forEach((route: Route) => {
      route.path.forEach((path) => {
        const employeeInPath = path.employeesOnPath.filter((item) => {
          if (payload.type === route.type) {
            return payload.employeeIds.includes(item.employee.id);
          }
        });

        employeeArray.push(employeeInPath);
      });
    });

    if (employeeArray.length > 0) {
      throw new HttpException(
        `O(s) colaborador(es)${employeeArray.map((item) =>
          item.map((employee) => ' ' + employee.employee.name),
        )} já está(ão) em uma rota do tipo ${payload.type.toLocaleLowerCase()}!`,
        HttpStatus.CONFLICT,
      );
    }

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
      employeeIds: payload.employeeIds,
      details: { ...payload.pathDetails },
    });

    return route;
  }

  async delete(id: string): Promise<Route> {
    const route = await this.listById(id);

    return await this.routeRepository.delete(route.id);
  }

  async listById(id: string): Promise<MappedRouteDTO> {
    const route = await this.routeRepository.findById(id);
    if (!route)
      throw new HttpException(
        `Não foi encontrada uma rota com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(route);
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

  async update(id: string, data: UpdateRouteDTO): Promise<Route> {
    const employeeArray = [];
    const employeeArrayPins = [];

    const route = await this.listById(id);

    if (route.paths[0].finishedAt !== null)
      throw new HttpException(
        'Não é possível alterar uma rota que já foi finalizada!',
        HttpStatus.CONFLICT,
      );

    if (data.employeeIds) {
      const employeeInRoute: Route[] =
        await this.routeRepository.findByEmployeeIds(data.employeeIds);

      const employeesPins = await this.employeeService.listAllEmployeesPins(
        data.employeeIds,
      );

      const _employee = [];
      employeesPins.forEach((employee: Employee) => {
        employee.pins.forEach((pin: any) => {
          if (pin.type === route.type) {
            _employee.push(employee.name);
          }
        });
        if (_employee.length < 1) employeeArrayPins.push(employee.name);
      });

      employeeInRoute
        .filter((_r) => _r.id != id && route.type === _r.type)
        .forEach((routeItem: Route) => {
          routeItem.path.forEach((path) => {
            const employeeInPath = path.employeesOnPath.filter((item) =>
              data.employeeIds.includes(item.employee.id),
            );

            employeeInPath.forEach((__r) => {
              __r.routeName = routeItem.description;
            });
            if (employeeInPath) {
              employeeArray.push(employeeInPath);
            }
          });
        });
      if (employeeArray.length > 0) {
        throw new HttpException(
          `Um ou mais coloboradores já estão em outra rota do tipo ${route.type.toLocaleLowerCase()}.  ${employeeArray.map(
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

      if (employeeArrayPins.length > 0) {
        throw new HttpException(
          `O(s) funcionário(s) ${employeeArrayPins} não pode(m) não possui(em) ponto em rota do tipo ${route.type.toLocaleLowerCase()}!`,
          HttpStatus.CONFLICT,
        );
      }

      for await (const path of route.paths) {
        await this.pathService.delete(path.id);
      }

      await this.pathService.generate({
        routeId: id,
        employeeIds: data.employeeIds,
        details: {
          type: route.paths[0].type as ETypePath,
          startsAt: route.paths[0].startsAt,
          duration: route.paths[0].duration,
          isAutoRoute: true,
        },
      });
    }

    return await this.routeRepository.update(
      Object.assign(route, { ...route, ...data }),
    );
  }

  async updateWebsocket(payload: StatusRouteDTO): Promise<any> {
    if (payload.path.startedAt) {
      const data = await this.listByIdWebsocket(payload.routeId);

      if (data.path[0].employeesOnPath.length === 0) {
        throw new HttpException(
          'Não é possível iniciar uma rota sem colaboradores!',
          HttpStatus.CONFLICT,
        );
      }
    }

    await this.update(payload.routeId, payload.route);

    await this.pathService.update(payload.pathId, payload.path);

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

    return dataFilterWebsocket;
  }

  async softDelete(id: string): Promise<Route> {
    const route = await this.listById(id);
    if (!route)
      throw new HttpException(
        `Não foi encontrada uma rota com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );

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
    return routes.map(route => {
      const { driver, vehicle } = route;

    return {
      id : route.id,
      description : route.description,
      distance : route.description,
      type : route.type,
      driver : {
        id : driver.id,
        name : driver.name
      },
      vehicle : {
        id : vehicle.id,
        plate : vehicle.plate
      }}  
    })
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
