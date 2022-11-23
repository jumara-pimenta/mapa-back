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
import { addHours, addMinutes } from 'date-fns'
import { convertTimeToDate } from "src/utils/date.service";
import { EmployeeService } from "./employee.service";
import { Employee } from "src/entities/employee.entity";
import { RouteWebsocket } from "src/entities/routeWebsocket.entity";
import { UpdatePathDTO } from "src/dtos/path/updatePath.dto";

@Injectable()
export class RouteService {
  constructor(
    @Inject("IRouteRepository")
    private readonly routeRepository: IRouteRepository,
    private readonly driverService: DriverService,
    private readonly vehicleService: VehicleService,
    private readonly employeeService: EmployeeService,
    @Inject(forwardRef(() => PathService))
    private readonly pathService: PathService
  ) { }


  async create(payload: CreateRouteDTO): Promise<Route> {
    let employeeArray = [];
    let employeeArrayPins = [];
    const initRouteDate = convertTimeToDate(payload.pathDetails.startsAt);
    const endRouteDate = convertTimeToDate(payload.pathDetails.duration);


    const driver = await this.driverService.listById(payload.driverId); // Busca o motorista pelo id
    const vehicle = await this.vehicleService.listById(payload.vehicleId); // Busca o veículo pelo id

    const employeesPins = await this.employeeService.listAllEmployeesPins(payload.employeeIds); // Busca os pins dos funcionários
    console.log(employeesPins);
    employeesPins.map((employee: Employee) => {
      if (!employee.pins) {
        console.log("TESTE =>"+employee);
        
        employeeArrayPins.push(employee.name)
      } 
        employee.pins.filter((pin: any) => {
          if (pin.type !== payload.type) {
            console.log("TESTE =>",[pin]);
            
            return employeeArrayPins.push(employee.name);
          }
        })
      
    })

    if (employeeArrayPins.length > 0) {
      throw new HttpException(`O(s) funcionário(s) ${employeeArrayPins} não pode(m) não possui(em) ponto em rota do tipo ${payload.type.toLocaleLowerCase()}!`, HttpStatus.CONFLICT);
    }

    const driverInRoute = await this.routeRepository.findByDriverId(driver.id);

    const employeeInRoute = await this.routeRepository.findByEmployeeIds(payload.employeeIds);

    driverInRoute.map(route => {
      route.path.map(path => {
        const startedAtDate = convertTimeToDate(path.startsAt);
        const durationTime = convertTimeToDate(path.duration);

        const finishedAtTime = addHours(addMinutes(startedAtDate, durationTime.getMinutes()), durationTime.getHours());

        if (initRouteDate >= startedAtDate && initRouteDate <= finishedAtTime) {
          throw new HttpException(`O motorista já está em uma rota neste horário!`, HttpStatus.CONFLICT);
        }
        if (endRouteDate >= startedAtDate && endRouteDate <= finishedAtTime) {
          throw new HttpException(`O motorista já está em uma rota neste horário!`, HttpStatus.CONFLICT);
        }
      })
    });


    if (payload.type === 'CONVENCIONAL' || payload.type === 'ESPECIAL') {
    }

    employeeInRoute.map((route: Route) => {
      route.path.map(path => {
        const employeeInPath = path.employeesOnPath.filter(item => {

          if (payload.type === route.type) {
            return payload.employeeIds.includes(item.employee.id);
          }
        });

        employeeArray.push(employeeInPath);
      })
    });



    if (employeeArray.length > 0) {
      throw new HttpException(`O(s) colaborador(es)${employeeArray.map(item => item.map(employee => " " + employee.employee.name))} já está(ão) em uma rota do tipo ${payload.type.toLocaleLowerCase()}!`, HttpStatus.CONFLICT);

    }

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

  async listByIdWebsocket(id: string): Promise<any> {
    const route = await this.routeRepository.findByIdWebsocket(id);

    if (!route) throw new HttpException(`Não foi encontrada uma rota com o id: ${id}!`, HttpStatus.NOT_FOUND);

    // return this.mapperOne(route);
    return route;
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

    return await this.routeRepository.update(Object.assign(route, { ...route, ...data }));
  }

  async updateWebsocket(id: string, route: UpdateRouteDTO, path?: UpdatePathDTO): Promise<any> {

    const routeData = await this.listByIdWebsocket(id);

    await this.routeRepository.updateWebsocket(Object.assign(routeData, { ...routeData, ...route }));

    

    const pathData = await this.pathService.update(routeData.path[0].id, path );
console.log("==>",pathData);

    const dataFilter = await this.listByIdWebsocket(id);

    const dataFilterWebsocket = {
      id: dataFilter.id,
      description: dataFilter.description,
      distance: dataFilter.distance,
      status: dataFilter.status,
      type: dataFilter.type,
      driver: dataFilter.driver.name,
      vehicle: dataFilter.vehicle.plate,
      path: dataFilter.path
    }
    

    return dataFilterWebsocket;

  }

  // get by id with path
  async listByIdWithPaths(id: string): Promise<MappedRouteDTO> {
    const route = await this.routeRepository.findById(id);
    
    const path = await this.pathService.listById(route.path[0].id);

    return this.mapperOne(route);
  
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
                details: {
                  name: employee.name,
                  address: employee.address,
                  shift: employee.shift,
                  registration: employee.registration,
                  location: {
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
              details: {
                name: employee.name,
                address: employee.address,
                shift: employee.shift,
                registration: employee.registration,
                location: {
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
