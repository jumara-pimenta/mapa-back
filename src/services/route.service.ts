import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Route } from "../entities/route.entity";
import IRouteRepository from "../repositories/route/route.repository.contract";
import { Page, PageResponse } from "../configs/database/page.model";
import { FiltersRouteDTO } from "../dtos/route/filtersRoute.dto";
import { MappedRouteDTO } from "../dtos/route/mappedRoute.dto";
import { CreateRouteDTO } from "../dtos/route/createRoute.dto";
import { UpdateRouteDTO } from "../dtos/route/updateRoute.dto";
import { DriverService } from "./driver.service";
import { VehicleService } from "./vehicle.service";
import { PathService } from "./path.service";
import { EStatusRoute } from "../utils/ETypes";

@Injectable()
export class RouteService {
  constructor(
    @Inject("IRouteRepository")
    private readonly routeRepository: IRouteRepository,
    private readonly driverService: DriverService,
    private readonly vehicleService: VehicleService,
    @Inject(forwardRef(() => PathService))
    private readonly pathService: PathService
  ) { }

  async create(payload: CreateRouteDTO): Promise<Route> {

    const driver = await this.driverService.listById(payload.driverId);

    const vehicle = await this.vehicleService.listById(payload.vehicleId);

    const props = new Route({
      description: payload.description,
      distance: 'EM PROCESSAMENTO',
      status: EStatusRoute.PENDING,
      type: payload.type
    }, driver, vehicle);

    const route = await this.routeRepository.create(props);

    await this.pathService.generate({
      routeId: route.id,
      employeeIds: payload.employeeIds,
      details: { ...payload.pathDetails }
    });

    return route;
  }

  async delete(id: string): Promise<Route> {
    const route = await this.listById(id);

    return await this.routeRepository.delete(route.id);
  }

  async listById(id: string): Promise<MappedRouteDTO> {
    const route = await this.routeRepository.findById(id);

    if (!route) throw new HttpException(`Não foi encontrada uma rota com o id: ${id}!`, HttpStatus.NOT_FOUND);

    return this.mapperOne(route);
  }

  async listAll(page: Page, filters?: FiltersRouteDTO): Promise<PageResponse<MappedRouteDTO>> {

    const routes = await this.routeRepository.findAll(page, filters);

    if (routes.total === 0) {
      throw new HttpException("Não existe routes para esta pesquisa!", HttpStatus.NOT_FOUND);
    }

    const items = this.mapperMany(routes.items);

    return {
      total: routes.total,
      items
    }
  }

  async update(id: string, data: UpdateRouteDTO): Promise<Route> {

    const route = await this.listById(id);

    return await this.routeRepository.update(Object.assign(route, {...route, ...data}));
  }

  private mapperMany(routes: Route[]): MappedRouteDTO[] {
    return routes.map(route => {
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
          updatedAt: driver.updatedAt
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
          updatedAt: vehicle.updatedAt
        },
        paths: path.map(item => {
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
            employeesOnPath: employeesOnPath.map(item => {
              const { employee } = item;
              const { pins } = employee;
  
              return {
                id: item.id,
                boardingAt: item.boardingAt,
                confirmation: item.confirmation,
                disembarkAt: item.disembarkAt,
                position: item.position,
                location: {
                  name: employee.name,
                  address: employee.address,
                  shift: employee.shift,
                  registration: employee.registration,
                  pin: {
                    type: pins.at(0).type,
                    lat: pins.at(0).pin.lat,
                    long: pins.at(0).pin.long
                  }
                }
              }
            })
          }
        })
      }
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
          updatedAt: driver.updatedAt
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
          updatedAt: vehicle.updatedAt
        },
        paths: path.map(item => {
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
            employeesOnPath: employeesOnPath.map(item => {
              const { employee } = item;
              const { pins } = employee;
  
              return {
                id: item.id,
                boardingAt: item.boardingAt,
                confirmation: item.confirmation,
                disembarkAt: item.disembarkAt,
                position: item.position,
                location: {
                  name: employee.name,
                  address: employee.address,
                  shift: employee.shift,
                  registration: employee.registration,
                  pin: {
                    type: pins.at(0).type,
                    lat: pins.at(0).pin.lat,
                    long: pins.at(0).pin.long
                  }
                }
              }
            })
          }
        })
      }
  }
}
