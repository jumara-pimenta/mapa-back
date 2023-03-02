import { RouteHistoryService } from './routeHistory.service';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Path } from '../entities/path.entity';
import IPathRepository from '../repositories/path/path.repository.contract';
import {
  EmployeesByPin,
  MappedPathDTO,
  MappedPathPinsDTO,
} from '../dtos/path/mappedPath.dto';
import { CreatePathDTO } from '../dtos/path/createPath.dto';
import { UpdatePathDTO } from '../dtos/path/updatePath.dto';
import { RouteService } from './route.service';
import { EStatusPath, EStatusRoute, ETypePath } from '../utils/ETypes';
import { EmployeesOnPathService } from './employeesOnPath.service';
import { getDateInLocaleTime } from '../utils/date.service';
import { RouteHistory } from '../entities/routeHistory.entity';
import { DriverService } from './driver.service';
import { VehicleService } from './vehicle.service';
import { SinisterService } from './sinister.service';
import { RouteMobile } from 'src/utils/Utils';

@Injectable()
export class PathService {
  constructor(
    @Inject('IPathRepository')
    private readonly pathRepository: IPathRepository,
    @Inject(forwardRef(() => RouteService))
    private readonly routeService: RouteService,
    @Inject(forwardRef(() => EmployeesOnPathService))
    private readonly employeesOnPathService: EmployeesOnPathService,
    @Inject(forwardRef(() => DriverService))
    private readonly driverService: DriverService,
    @Inject(forwardRef(() => VehicleService))
    private readonly vehicleService: VehicleService,
    @Inject(forwardRef(() => RouteHistoryService))
    private readonly routeHistoryService: RouteHistoryService,
    @Inject(forwardRef(() => SinisterService))
    private readonly sinisterService: SinisterService,
  ) {}

  async finishPath(id: string): Promise<any> {
    const path = await this.getPathById(id);
    const route = await this.listEmployeesByPathAndPin(id);
    const vehicle = await this.vehicleService.listById(route.vehicle);
    const employeesOnPath = await this.employeesOnPathService.listByPath(path.id)
    let driverId = path.substituteId;
    const driver = await this.driverService.listById(
      driverId ? driverId : route.driver,
    );

    const sinister = await this.sinisterService.listByPathId(path.id);
    if (path.finishedAt !== null)
      throw new HttpException(
        'Não é possível alterar uma rota que já foi finalizada!',
        HttpStatus.CONFLICT,
      );

    if (path.startedAt === null)
      throw new HttpException(
        'Não é possível finalizar uma rota que não foi iniciada!',
        HttpStatus.CONFLICT,
      );
    const totalInEachPin = route.employeesOnPins.map((item) => {
      return item.employees.length;
    });
    const employeeArray = [] as string[];
    const itinerariesArray = [];
    const totalEmployees = totalInEachPin.reduce((a, b) => a + b, 0);
    let totalConfirmed = 0;

   /*  for await (const employeesPins of route.employeesOnPins) {
      itinerariesArray.push([`${employeesPins.lat},${employeesPins.lng}`]);
      for await (const employee of employeesPins.employees) {
        if (employee.confirmation === true) totalConfirmed++;

        if (employee.confirmation === true && employee.present === true) {
          employeeArray.push(employee.employeeId);
          if (path.type === ETypePath.ONE_WAY) {
            await this.employeesOnPathService.update(employee.id, {
              disembarkAt: getDateInLocaleTime(new Date()),
            });
          }
        }
      }
    } */

    for await(const employee of employeesOnPath){
      if (employee.confirmation === true) totalConfirmed++;
      itinerariesArray.push([`${employee.employee.pins[0].pin.lat},${employee.employee.pins[0].pin.lng}`]);
      if (employee.confirmation === true && employee.present === true) {
        employeeArray.push(employee.employee.id);
        if (path.type === ETypePath.ONE_WAY) {
          await this.employeesOnPathService.update(employee.id, {
            disembarkAt: getDateInLocaleTime(new Date()),
          });
        }
      }
    }

    path.type === ETypePath.RETURN ? itinerariesArray.unshift(['-3.110944,-59.962604']) : itinerariesArray.push(['-3.110944,-59.962604']);

    if (employeeArray.length === 0)
      throw new HttpException(
        'Nenhum colaborador confirmado foi pego no seu ponto de embarque.',
        HttpStatus.BAD_REQUEST,
      );

    const finishAt = {
      routeId: path.route.id,
      pathId: path.id,
      route: {
        status: EStatusRoute.PENDING,
      },
      path: {
        finishedAt: getDateInLocaleTime(new Date()),
        status: EStatusPath.PENDING,
        substituteId: null,
      },
    };
    path.status = EStatusPath.FINISHED;

    const props = new RouteHistory(
      {
        typeRoute: path.type,
        nameRoute: route.routeDescription,
        employeeIds: employeeArray.join(),
        itinerary: itinerariesArray.join(),
        totalEmployees: totalEmployees,
        totalConfirmed: totalConfirmed,
        startedAt: getDateInLocaleTime(new Date(path.startedAt)),
        finishedAt: new Date(),
      },
      path,
      driver,
      vehicle,
      sinister,
    );

    if (path.status === EStatusPath.FINISHED) {
      await this.routeHistoryService.create(props);
      await this.employeesOnPathService.clearEmployeesOnPath(path.id);
    }

    return await this.routeService.updateWebsocket(finishAt);
  }
  async startPath(id: string): Promise<any> {
    const path = await this.listById(id);
    /* if (path.finishedAt !== null)
      throw new HttpException(
        'Não é possível alterar uma rota que já foi finalizada!',
        HttpStatus.CONFLICT,
      ); */
    const hasHistoric = await this.routeHistoryService.listByPathId(id);

    if (hasHistoric.length > 0)
      throw new HttpException(
        'Não é possível iniciar uma rota que já foi iniciada hoje!',
        HttpStatus.CONFLICT,
      );

    let confirmationCount = 0;
    path.employeesOnPath.forEach((employee) => {
      if (employee.confirmation == true) confirmationCount++;
    });

    if (confirmationCount === 0)
      throw new HttpException(
        'Não é possível iniciar uma rota sem nenhum colaborador no trajeto confirmado!',
        HttpStatus.CONFLICT,
      );

    if (path.type === ETypePath.RETURN) {
      for await (const employee of path.employeesOnPath) {
        if (employee.confirmation === true)
          await this.employeesOnPathService.update(employee.id, {
            boardingAt: getDateInLocaleTime(new Date()),
          });
      }
    }

    const route = await this.routeService.routeIdByPathId(id);

    const startAt = {
      routeId: route,
      pathId: id,
      route: {
        status: EStatusRoute.IN_PROGRESS,
      },
      path: {
        startedAt: getDateInLocaleTime(new Date()),
        status: EStatusPath.IN_PROGRESS,
        finishedAt: null,
      },
    };

    return await this.routeService.updateWebsocket(startAt);
  }

  async getPathidByEmployeeOnPathId(id: string): Promise<Partial<Path>> {
    const employeeOnPath = await this.pathRepository.findByEmployeeOnPath(id);

    if (!employeeOnPath) {
      throw new HttpException(
        'Não foi possível encontrar o trajeto do colaborador!',
        HttpStatus.NOT_FOUND,
      );
    }

    return employeeOnPath;
  }

  async generate(props: CreatePathDTO): Promise<void> {
    const { type, duration, startsAt, startsReturnAt } = props.details;
    const route = await this.routeService.listById(props.routeId);
    if (type === ETypePath.ONE_WAY || type === ETypePath.RETURN) {
      const path = await this.pathRepository.create(
        new Path(
          {
            duration: duration,
            startsAt: startsAt,
            type: type,
            status: EStatusPath.PENDING,
          },
          route,
        ),
      );

      await this.employeesOnPathService.create({
        employeeIds: props.employeeIds,
        pathId: path.id,
        confirmation: type === ETypePath.ONE_WAY ? true : false,
      });
    } else if (type === ETypePath.ROUND_TRIP) {
      const pathOneWay = await this.pathRepository.create(
        new Path(
          {
            duration: duration,
            startsAt: startsAt,
            type: ETypePath.ONE_WAY,
            status: EStatusPath.PENDING,
          },
          route,
        ),
      );
      const pathReturn = await this.pathRepository.create(
        new Path(
          {
            duration: duration,
            startsAt: startsReturnAt ?? startsAt,
            type: ETypePath.RETURN,
            status: EStatusPath.PENDING,
          },
          route,
        ),
      );

      await this.employeesOnPathService.create({
        employeeIds: props.employeeIds,
        pathId: pathOneWay.id,
        confirmation: true,
      });

      await this.employeesOnPathService.create({
        employeeIds: props.employeeIds.reverse(),
        pathId: pathReturn.id,
        confirmation: false,
      });
    }

    return;
  }

  async delete(id: string): Promise<Path> {
    const path = await this.listById(id);

    return await this.pathRepository.delete(path.id);
  }

  async listByIdMobile(id: string): Promise<any> {
    const path = await this.pathRepository.findById(id);
    if (!path)
      throw new HttpException(
        `Não foi encontrado trajeto com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );
    if (path.type === ETypePath.ONE_WAY) {
      const pathData = this.mapperOne(path) as any;
      const denso = {
        id: process.env.DENSO_ID,
        boardingAt: null,
        confirmation: true,
        disembarkAt: null,
        position: 99,
        details: {
          name: 'DENSO',
          address: 'null',
          shift: 'DENSO',
          registration: 'DENSO',
          location: {
            details:
              'Av. Buriti, 3600 - Distrito Industrial I, Manaus - AM, 69057-000',
            id: process.env.DENSO_ID,
            lat: '-3.111024790307586',
            lng: '-59.96232450142952',
          },
        },
      };
      pathData.employeesOnPath.push(denso);

      return pathData;
    }

    if (path.type === ETypePath.RETURN) {
      const pathData = this.mapperOne(path) as any;
      const denso = {
        id: path.employeesOnPath[0]?.id,
        boardingAt: null,
        confirmation: true,
        disembarkAt: null,
        present: true,
        position: 0,
        details: {
          name: 'DENSO',
          address: 'null',
          shift: 'DENSO',
          registration: 'DENSO',
          location: {
            details:
              'Av. Buriti, 3600 - Distrito Industrial I, Manaus - AM, 69057-000',
            id: process.env.DENSO_ID,
            lat: '-3.111024790307586',
            lng: '-59.96232450142952',
          },
        },
      };
      pathData.employeesOnPath.unshift(denso);

      return pathData;
    }

    // return this.mapperOne(path);
  }

  async listById(id: string): Promise<MappedPathDTO> {
    const path = await this.pathRepository.findById(id);
    if (!path)
      throw new HttpException(
        `Não foi encontrado trajeto com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(path);
  }

  async getPathById(id: string): Promise<Path> {
    const path = await this.pathRepository.findById(id);

    if (!path)
      throw new HttpException(
        `Não foi encontrado trajeto com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );

    return path;
  }

  async listAll(): Promise<any[]> {
    const paths = await this.pathRepository.findAll();

    // const manyPath = await this.mapperMany(paths);
    // add driver name and plate of vehicle
    return paths.map((path: Path) => {
      const { driver, vehicle } = path.route;
      const { name, id } = driver;
      const { plate } = vehicle;
      let path1 = this.mapperOne(path);

      return {
        ...path1,
        driver: {
          id,
          name,
          plate,
        },
        route: {
          id: path.route.id,
          name: path.route.description,
          type: path.route.type,
        },
      };
    });
  }

  async listEmployeesByPathAndPin(pathId: string): Promise<MappedPathPinsDTO> {
    const path = await this.listById(pathId);
    const routeId = await this.routeService.routeIdByPathId(pathId);

    const { employeesOnPath, ...data } = path;

    const agroupedEmployees = [] as string[];

    const employeesByPin = [] as EmployeesByPin[];

    for await (const employee of employeesOnPath) {
      const { id: pinId, lat, lng } = employee.details.location;
      if (pinId !== process.env.DENSO_ID) {
        const employeesOnSamePin =
          await this.employeesOnPathService.listByPathAndPin(pathId, pinId);
        let data = {} as EmployeesByPin;

        employeesOnSamePin.forEach((employeeOnPath) => {
          const {
            name,
            registration,
            id: employeeId,
          } = employeeOnPath.employee;

          if (agroupedEmployees.includes(employeeOnPath.id)) return;

          agroupedEmployees.push(employeeOnPath.id);
          data = {
            position: employeeOnPath.position,
            lat,
            lng,
            employees: data.employees?.length ? data.employees : [],
          };
          data.employees.push({
            id: employeeOnPath.id,
            name,
            registration,
            employeeId: employeeOnPath.employee.id,
            disembarkAt: employeeOnPath.disembarkAt,
            boardingAt: employeeOnPath.boardingAt,
            confirmation: employeeOnPath.confirmation,
            present: employeeOnPath.present,
          });
        });

        if (Object.keys(data).length === 0 && data.constructor === Object)
          continue;

        employeesByPin.push(data as EmployeesByPin);
      }
      if (pinId === process.env.DENSO_ID) {
        let data = {} as EmployeesByPin;
        data = {
          position: employee.position,
          lat,
          lng,
          employees: data.employees?.length ? data.employees : [],
        };
        data.employees.push({
          id: employee.id,
          name: 'Denso',
          registration: 'Denso',
          employeeId: employee.id,
          disembarkAt: employee.disembarkAt,
          boardingAt: employee.boardingAt,
          confirmation: employee.confirmation,
          present: employee.present,
        });
        if (path.type === ETypePath.ONE_WAY) {
          employeesByPin.unshift(data);
        }
        if (path.type === ETypePath.RETURN) {
          employeesByPin.push(data);
        }
      }
    }
    // change position base on length of employees
    employeesByPin.forEach((employeeByPin, index) => {
      employeeByPin.position = index + 1;
    });

    return { ...data, routeId: routeId, employeesOnPins: employeesByPin };
  }

  async listManyByRoute(routeId: string): Promise<MappedPathDTO[]> {
    const path = await this.pathRepository.findByRoute(routeId);

    if (!path.length)
      throw new HttpException(
        'Não foram encontrados trajetos para essa rota',
        HttpStatus.NOT_FOUND,
      );

    return this.mapperMany(path);
  }

  async listManyByDriver(driverId: string): Promise<MappedPathDTO[]> {
    const path = await this.pathRepository.findByDriver(driverId);

    if (!path.length)
      throw new HttpException(
        'Não foram encontrados trajetos para este motorista!',
        HttpStatus.NOT_FOUND,
      );

    return this.mapperMany(path);
  }

  async listManyByEmployee(employeeId: string): Promise<MappedPathDTO[]> {
    const path = await this.pathRepository.findByEmployee(employeeId);
    if (!path.length)
      throw new HttpException(
        'Não foram encontrados trajetos para este colaborador!',
        HttpStatus.NOT_FOUND,
      );
    return this.mapperMany(path);
  }

  async listOneByDriverAndStatus(
    driverId: string,
    status: EStatusPath,
  ): Promise<any> {
    const path = await this.pathRepository.findByDriverIdAndStatus(
      driverId,
      status,
    );
    if (!path)
      throw new HttpException(
        `Não existe trajeto com status ${status} para este motorista!`,
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(path);
  }

  async update(id: string, data: UpdatePathDTO): Promise<Path> {
    const path = await this.listById(id);

    if (data.status) {
      if (
        data.status === EStatusPath.PENDING &&
        path.status === EStatusPath.PENDING
      ) {
        throw new HttpException(
          'O status do trajeto já está pendente!',
          HttpStatus.CONFLICT,
        );
      }

      if (
        data.status === EStatusPath.IN_PROGRESS &&
        path.status === EStatusPath.IN_PROGRESS
      ) {
        throw new HttpException(
          'O trajeto já se encontra em andamento!',
          HttpStatus.CONFLICT,
        );
      }

      if (
        data.status === EStatusPath.FINISHED &&
        path.status === EStatusPath.FINISHED
      ) {
        throw new HttpException(
          'Não é possível atualizar o status de um trajeto que já foi finalizado!',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }
    }

    return await this.pathRepository.update(
      Object.assign(path, { ...path, ...data }),
    );
  }

  async listByEmployeeAndStatus(
    employeeId: string,
    status: EStatusPath,
  ): Promise<MappedPathDTO> {
    const path = await this.pathRepository.findByEmployeeAndStatus(
      employeeId,
      status,
    );

    if (!path)
      throw new HttpException(
        'O colaborador não possui trajetos em andamento!',
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(path);
  }

  async addSubstituteDriver(driverId: string, pathId: string): Promise<Path> {
    const path = await this.listById(pathId);

    const driver = await this.driverService.listById(driverId);

    if (path.status === EStatusPath.IN_PROGRESS)
      throw new HttpException(
        'Não é possível adicionar um motorista substituto para um trajeto que já está em andamento!',
        HttpStatus.METHOD_NOT_ALLOWED,
      );

    return await this.update(pathId, { substituteId: driverId });
  }

  async getRouteMobileById(pathId: string): Promise<RouteMobile> {
    const path = await this.pathRepository.findById(pathId);

    if (!path)
      throw new HttpException('Trajeto não encontrado!', HttpStatus.NOT_FOUND);

    const route = await this.routeService.listById(path.route.id);

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
      vehicle: route.vehicle.plate,
      driver: route.driver.name,
      status: route.status,
      type: route.type,
      pathType,
      time: time(),
      duration: path.duration,
    };
  }

  private mapperOne(path: Path): MappedPathDTO {
    const { employeesOnPath } = path;

    return {
      id: path.id,
      routeDescription: path?.route.description,
      duration: path.duration,
      finishedAt: path.finishedAt,
      startedAt: path.startedAt,
      startsAt: path.startsAt,
      status: path.status,
      vehicle: path.route.vehicle!.id,
      driver: path.route.driver!.id,
      type: path.type,
      createdAt: path.createdAt,
      employeesOnPath: employeesOnPath.map((item) => {
        const { employee } = item;
        const { pins } = employee;

        return {
          id: item.id,
          boardingAt: item.boardingAt,
          confirmation: item.confirmation,
          disembarkAt: item.disembarkAt,
          position: item.position,
          present: item.present,
          details: {
            employeeId: employee.id,
            name: employee.name,
            address: employee.address,
            shift: employee.shift,
            registration: employee.registration,
            location: {
              details: pins.at(0).pin.details,
              id: pins.at(0).pin.id || 'n deu',
              lat: pins.at(0).pin.lat,
              lng: pins.at(0).pin.lng,
            },
          },
        };
      }),
    };
  }

  private mapperMany(paths: Path[]): MappedPathDTO[] {
    return paths.map((path) => {
      const { employeesOnPath } = path;
      return {
        id: path.id,
        routeDescription: path?.route.description,
        routeType: path?.route.type,
        duration: path.duration,
        finishedAt: path.finishedAt,
        startedAt: path.startedAt,
        startsAt: path.startsAt,
        status: path.status,
        type: path.type,
        createdAt: path.createdAt,
        employeesOnPath: employeesOnPath.map((item) => {
          const { employee } = item;
          const { pins } = employee;

          return {
            id: item.id,
            boardingAt: item.boardingAt,
            confirmation: item.confirmation,
            disembarkAt: item.disembarkAt,
            position: item.position,
            present: item.present,
            details: {
              name: employee.name,
              address: employee.address,
              shift: employee.shift,
              employeeId: employee.id,
              registration: employee.registration,
              location: {
                id: pins.at(0).pinId,
                lat: pins.at(0).pin.lat,
                lng: pins.at(0).pin.lng,
              },
            },
          };
        }),
      };
    });
  }
}
