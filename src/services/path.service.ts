import { RouteHistoryService } from './routeHistory.service';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Path } from '../entities/path.entity';
import IPathRepository from '../repositories/path/path.repository.contract';
import {
  EmployeesByPin,
  IEmployeesOnPathDTO,
  MappedPathDTO,
  MappedPathPinsDTO,
} from '../dtos/path/mappedPath.dto';
import { CreatePathDTO } from '../dtos/path/createPath.dto';
import { UpdatePathDTO } from '../dtos/path/updatePath.dto';
import { RouteService } from './route.service';
import {
  ERoutePathStatus,
  ERoutePathType,
  EStatusPath,
  ETypePath,
  ETypeRoute,
} from '../utils/ETypes';
import { EmployeesOnPathService } from './employeesOnPath.service';
import { RouteHistory } from '../entities/routeHistory.entity';
import { DriverService } from './driver.service';
import { VehicleService } from './vehicle.service';
import { SinisterService } from './sinister.service';
import { RouteMobile } from '../utils/Utils';
import { FiltersPathDTO } from '../dtos/path/filtersPath.dto';
import { DENSO_LOCATION } from '../utils/Constants';
import { MappedRouteDTO } from '../dtos/route/mappedRoute.dto';
import { getDateInLocaleTime, getDateInLocaleTimeManaus } from '../utils/Date';
import { getNextBusinessDay, isDateAfterToday } from '../utils/date.service';
// import { FEATURE_ENABLED_LIST_ONLY_DAY_PATHS } from '../settings';

interface IEmployeeNotPresent {
  name: string;
  registration: string;
  present: boolean;
  confirmed: boolean;
}

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
    const typeRoute = await this.routeService.getRouteType(path.route.id);

    const vehicle = await this.vehicleService.listById(route.vehicle);
    const employeesOnPath = await this.employeesOnPathService.listByPath(
      path.id,
    );
    const driverId = path.substituteId;
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

    const confirmedAndPresentedEmployees = [] as string[];

    const itinerariesArray = [];

    const employeeNotPresents: IEmployeeNotPresent[] = [];

    const totalEmployees = totalInEachPin.reduce((a, b) => a + b, 0);

    let totalConfirmed = 0;

    for await (const employee of employeesOnPath) {
      if (employee.confirmation === true) totalConfirmed++;

      itinerariesArray.push([
        `${employee.employee.pins[0].pin.lat},${employee.employee.pins[0].pin.lng}`,
      ]);

      if (employee.confirmation === true && employee.present === true) {
        confirmedAndPresentedEmployees.push(employee.employee.id);

        if (path.type === ETypePath.ONE_WAY) {
          await this.employeesOnPathService.update(employee.id, {
            disembarkAt: getDateInLocaleTimeManaus(new Date()),
          });
        }
      }

      if (employee.present === (false || null)) {
        employeeNotPresents.push({
          name: employee.employee.name,
          registration: employee.employee.registration,
          confirmed: employee.confirmation,
          present: employee.present,
        });
      }
    }

    path.type === ETypePath.RETURN
      ? itinerariesArray.unshift([DENSO_LOCATION])
      : itinerariesArray.push([DENSO_LOCATION]);

    if (confirmedAndPresentedEmployees.length === 0)
      throw new HttpException(
        'Nenhum colaborador confirmado foi pego no seu ponto de embarque.',
        HttpStatus.BAD_REQUEST,
      );

    const statusRoute = this.getStatusThatTheRouteShouldHave(
      typeRoute,
      path.type as ETypePath,
    );

    const finishAt = {
      routeId: path.route.id,
      pathId: path.id,
      route: {
        status: statusRoute,
        type: route.routeType as ETypeRoute,
      },
      path: {
        finishedAt: getDateInLocaleTimeManaus(new Date()),
        status: EStatusPath.FINISHED,
        substituteId: null,
      },
    };

    path.status = EStatusPath.FINISHED;

    const props = new RouteHistory(
      {
        typeRoute: path.type,
        nameRoute: route.routeDescription,
        employeeIds: confirmedAndPresentedEmployees.join(),
        itinerary: itinerariesArray.join(),
        employeesNotPresent: JSON.stringify(employeeNotPresents),
        totalEmployees: totalEmployees,
        totalConfirmed: totalConfirmed,
        startedAt: path.startedAt,
        finishedAt: getDateInLocaleTimeManaus(new Date()),
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

    return await this.routeService.finishRoute(finishAt);
  }

  async startPath(id: string): Promise<any> {
    const path = await this.listById(id);

    const driverAlreadyInAnotherRoute =
      await this.pathRepository.findByStatusAndDriver(
        EStatusPath.IN_PROGRESS,
        path.driver,
      );

    driverAlreadyInAnotherRoute.forEach((_path) => {
      if (_path.id === path.id) {
        throw new HttpException('A rota já foi iniciada!', HttpStatus.CONFLICT);
      }

      if (_path.id !== path.id) {
        throw new HttpException(
          'Não é possível iniciar uma rota com o motorista em outra rota em andamento!',
          HttpStatus.CONFLICT,
        );
      }
    });

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
            boardingAt: getDateInLocaleTimeManaus(new Date()),
          });
      }
    }

    if (path.scheduledDate) {
      if (isDateAfterToday(path.scheduledDate)) {
        throw new HttpException(
          'Não é possível iniciar uma rota agendada para uma data posterior à atual!',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    }

    const route = await this.routeService.routeIdByPathId(id);

    const startAt = {
      routeId: route,
      pathId: id,
      route: {
        status: ERoutePathStatus.IN_PROGRESS,
      },
      path: {
        startedAt: getDateInLocaleTime(new Date()),
        status: EStatusPath.IN_PROGRESS,
        finishedAt: null,
      },
    };

    return await this.routeService.startRoute(startAt);
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
    const { type, duration, startsAt, startsReturnAt, returnScheduleDate } =
      props.details;

    const route = await this.routeService.listById(props.routeId);

    if (type === ETypePath.ONE_WAY || type === ETypePath.RETURN) {
      const path = await this.pathRepository.create(
        new Path(
          {
            duration: duration,
            startsAt: startsAt,
            type: type,
            status: EStatusPath.PENDING,
            scheduleDate: props.details.scheduleDate,
          },
          route,
        ),
      );

      await this.employeesOnPathService.create({
        employeeIds: props.employeeIds,
        pathId: path.id,
        confirmation: true,
      });
    } else if (type === ETypePath.ROUND_TRIP) {
      const pathOneWay = await this.pathRepository.create(
        new Path(
          {
            duration: duration,
            startsAt: startsAt,
            type: ETypePath.ONE_WAY,
            status: EStatusPath.PENDING,
            scheduleDate: props.details.scheduleDate,
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
            scheduleDate: returnScheduleDate,
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
        confirmation: true,
      });
    }

    return;
  }

  async regeneratePaths(
    route: MappedRouteDTO,
    scheduledDate?: Date[],
  ): Promise<void> {
    let i: number;

    for await (const _path of route.paths) {
      i == null ? 0 : i++;

      const { duration, startsAt, type } = _path;

      const props = new Path(
        {
          duration,
          startsAt,
          type,
          status: EStatusPath.PENDING,
          scheduleDate: scheduledDate[i] ?? getNextBusinessDay(startsAt),
        },
        route,
      );

      const createdPath = await this.pathRepository.create(props);

      for await (const employeeOnPath of _path.employeesOnPath) {
        await this.employeesOnPathService.recreateEmployeesOnPath(
          createdPath,
          employeeOnPath as IEmployeesOnPathDTO,
        );
      }
    }

    return;
  }

  async delete(id: string): Promise<Path> {
    const path = await this.listById(id);

    return await this.pathRepository.delete(path.id);
  }

  async deleteExtra(id: string): Promise<Path> {
    const path = await this.listById(id);

    return await this.pathRepository.delete(path.id);
  }

  async softDelete(id: string): Promise<Path> {
    const path = await this.pathRepository.findByIdToDelete(id);

    if (!path)
      throw new HttpException(
        `Não foi encontrado trajeto com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );

    const deleted = await this.pathRepository.softDelete(path.id);

    return deleted;
  }

  async listByIdMobile(id: string): Promise<any> {
    const path = await this.pathRepository.findById(id);

    if (!path) {
      throw new HttpException(
        `Não foi encontrado trajeto com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (path.type === ETypePath.ONE_WAY) {
      const pathData = this.mapperOne(path) as any;

      const { employeesOnPath } = pathData;

      const confirmedEmployees = employeesOnPath.filter(
        (employee) => employee.confirmation,
      );

      pathData.employeesOnPath = confirmedEmployees;

      const denso = {
        id: process.env.DENSO_ID,
        position: 99,
        boardingAt: null,
        confirmation: true,
        disembarkAt: null,
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

      const { employeesOnPath } = pathData;

      const confirmedEmployees = employeesOnPath.filter(
        (employee) => employee.confirmation,
      );

      pathData.employeesOnPath = confirmedEmployees;

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
  }

  async listById(id: string): Promise<MappedPathDTO> {
    const path = await this.pathRepository.findByIdToDelete(id);

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

  async listAll(filters?: FiltersPathDTO): Promise<any[]> {
    const paths = process.env.FEATURE_ENABLED_LIST_ONLY_DAY_PATHS
      ? await this.pathRepository.findAllToday(filters)
      : await this.pathRepository.findAll(filters);

    return paths.map((path: Path) => {
      const { driver, vehicle } = path.route;
      const { name, id } = driver;
      const { plate } = vehicle;

      const path1 = this.mapperOne(path);

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
    const route = await this.routeService.listById(routeId);

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
          const { name, registration } = employeeOnPath.employee;

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

    return {
      ...data,
      routeId: routeId,
      employeesOnPins: employeesByPin,
      routeType: route.type,
    };
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

  async listPathsNotStartedByEmployee(employeeId: string): Promise<Path[]> {
    const paths = await this.pathRepository.findManyPathsNotStartedByEmployee(
      employeeId,
    );

    return paths;
  }

  async addSubstituteDriver(driverId: string, pathId: string): Promise<Path> {
    const path = await this.listById(pathId);

    await this.driverService.listById(driverId);

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

  async listByEmployeeOnPath(employeeOnPathId: string): Promise<Partial<Path>> {
    const path = await this.pathRepository.findByEmployeeOnPath(
      employeeOnPathId,
    );

    if (!path)
      throw new HttpException(
        'Colaborador não encontrado no trajeto!',
        HttpStatus.NOT_FOUND,
      );

    return path;
  }

  async listByEmployeeOnPathFromMobile(
    employeeOnPathId: string,
  ): Promise<Partial<Path>> {
    const path = await this.pathRepository.findByEmployeeOnPathMobile(
      employeeOnPathId,
    );

    if (!path)
      throw new HttpException(
        'Colaborador não encontrado no trajeto!',
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(path);
  }

  async listByIdNotMapped(id: string): Promise<Path> {
    const path = await this.pathRepository.findById(id);

    if (!path)
      throw new HttpException(
        `Não foi encontrado trajeto com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );

    return path;
  }

  async updateEmployeePositionOnPath(pathId: string): Promise<void> {
    const path = await this.listByIdNotMapped(pathId);

    let newPosition = 1;

    for await (const employeeOnPath of path.employeesOnPath) {
      await this.employeesOnPathService.updateEmployeePositionByEmployeeAndPath(
        employeeOnPath.employee.id,
        path.id,
        newPosition,
      );

      newPosition++;
    }

    await this.routeService.updateTotalDistanceRoute(path);
  }

  private getStatusThatTheRouteShouldHave(
    typeRoute: ERoutePathType,
    typePath: ETypePath,
  ): ERoutePathStatus {
    // se a rota for só ida e o trajeto for ida
    if (
      typeRoute === ERoutePathType.ONE_WAY &&
      typePath === ETypePath.ONE_WAY
    ) {
      return ERoutePathStatus.FINISHED;
    }

    // se a rota só volta e o trajeto for volta
    if (typeRoute === ERoutePathType.RETURN && typePath === ETypePath.RETURN) {
      return ERoutePathStatus.FINISHED;
    }

    // se a rota for ida/volta e o trajeto for ida
    if (
      typeRoute === ERoutePathType.ROUND_TRIP &&
      typePath === ETypePath.ONE_WAY
    ) {
      return ERoutePathStatus.PENDING;
    }

    // se a rota for ida/volta e o trajeto for volta
    if (
      typeRoute === ERoutePathType.ROUND_TRIP &&
      typePath === ETypePath.RETURN
    ) {
      return ERoutePathStatus.FINISHED;
    }

    new Logger('path service').error('get status that the route should have');
  }

  async listAllByStatus(status: ERoutePathStatus): Promise<MappedPathDTO[]> {
    const paths = await this.pathRepository.findManyByStatus(status);

    return this.mapperMany(paths);
  }

  public mapperOne(path: Path): MappedPathDTO {
    const { employeesOnPath } = path;

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
      id: path.id,
      routeDescription: path?.route.description,
      duration: path.duration,
      finishedAt: path.finishedAt,
      startedAt: new Date(path.startedAt),
      startsAt: path.startsAt,
      status: path.status,
      vehicle: path.route.vehicle!.id,
      driver: path.route.driver!.id,
      type: path.type,
      createdAt: path.createdAt,
      scheduledDate: path.scheduleDate,
      employeesOnPath: employeesOnPath.map((item) => {
        const { employee } = item;
        const { pins } = employee;

        return {
          id: item.id,
          position: item.position,
          confirmation: item.confirmation,
          present: item.present,
          boardingAt: item.boardingAt,
          disembarkAt: item.disembarkAt,
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
      const today = new Date();
      const date = new Date(path?.finishedAt ?? new Date('2000-01-01'));

      if (
        today.getDay() === date.getDay() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
      ) {
        path.status = EStatusPath.FINISHED;
      }

      const { employeesOnPath } = path;
      return {
        id: path.id,
        routeDescription: path?.route.description,
        routeType: path?.route.type as ETypeRoute,
        duration: path.duration,
        finishedAt: path.finishedAt,
        startedAt: new Date(path.startedAt),
        startsAt: path.startsAt,
        status: path.status,
        type: path.type,
        scheduledDate: path.scheduleDate,
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
