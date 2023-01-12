import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Path } from '../entities/path.entity';
import IPathRepository from '../repositories/path/path.repository.contract';
import { EmployeesByPin, IEmployeesOnPathDTO, MappedPathDTO, MappedPathPinsDTO } from '../dtos/path/mappedPath.dto';
import { CreatePathDTO } from '../dtos/path/createPath.dto';
import { UpdatePathDTO } from '../dtos/path/updatePath.dto';
import { RouteService } from './route.service';
import { EStatusPath, EStatusRoute, ETypePath } from '../utils/ETypes';
import { EmployeesOnPathService } from './employeesOnPath.service';
import { getDateInLocaleTime } from 'src/utils/date.service';

@Injectable()
export class PathService {

  constructor(
    @Inject('IPathRepository')
    private readonly pathRepository: IPathRepository,
    @Inject(forwardRef(() => RouteService))
    private readonly routeService: RouteService,
    @Inject(forwardRef(() => EmployeesOnPathService))
    private readonly employeesOnPathService: EmployeesOnPathService,
  ) { }

  async finishPath(id: string): Promise<any> {
    const path = await this.listById(id);
    if (path.finishedAt !== null)
      throw new HttpException(
        'Não é possível alterar uma rota que já foi finalizada!',
        HttpStatus.CONFLICT,
      );

    if (path.startedAt === null) throw new HttpException('Não é possível finalizar uma rota que não foi iniciada!', HttpStatus.CONFLICT)


    const route = await this.routeService.routeIdByPathId(id)

    if (path.type === ETypePath.ONE_WAY) {

      for await (const employee of path.employeesOnPath) {
        if (employee.confirmation === true) await this.employeesOnPathService.update(employee.id, { disembarkAt: getDateInLocaleTime(new Date()) })
      }
    }

    const finishAt = {
      routeId: route,
      pathId: id,
      route: {
        status: EStatusRoute.PENDING,
      },
      path: {
        finishedAt: getDateInLocaleTime(new Date()),
        status: EStatusPath.FINISHED,
      },
    };

    return await this.routeService.updateWebsocket(finishAt);

  }
  async startPath(id: string): Promise<any> {
    const path = await this.listById(id);
    if (path.finishedAt !== null)
      throw new HttpException(
        'Não é possível alterar uma rota que já foi finalizada!',
        HttpStatus.CONFLICT,
      );
    let confirmationCount = 0;
    path.employeesOnPath.forEach((employee) => { if (employee.confirmation == true) confirmationCount++ });

    if (confirmationCount === 0) throw new HttpException('Não é possível iniciar uma rota sem nenhum colaborador no trajeto confirmado!', HttpStatus.CONFLICT);

    if (path.type === ETypePath.RETURN) {

      for await (const employee of path.employeesOnPath) {
        if (employee.confirmation === true) await this.employeesOnPathService.update(employee.id, { boardingAt: getDateInLocaleTime(new Date()) })
      }
    }



    const route = await this.routeService.routeIdByPathId(id)

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

    return employeeOnPath;
  }

  async generate(props: CreatePathDTO): Promise<void> {
    const { type, duration, startsAt } = props.details;

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
            startsAt: startsAt,
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
        employeeIds: props.employeeIds,
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

  async listById(id: string): Promise<MappedPathDTO> {
    const path = await this.pathRepository.findById(id);

    if (!path)
      throw new HttpException(
        `Não foi encontrado trajeto com o id: ${id}!`,
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(path);
  }

  async listEmployeesByPathAndPin(pathId: string): Promise<MappedPathPinsDTO> {


    const path = await this.listById(pathId);

    const routeId = await this.routeService.routeIdByPathId(pathId);

    const { employeesOnPath, ...data } = path;

    const agroupedEmployees = [] as string[];

    const employeesByPin = [] as EmployeesByPin[];

    for await (const employee of employeesOnPath) {
      const { id: pinId, lat, lng } = employee.details.location;

      const employeesOnSamePin = await this.employeesOnPathService.listByPathAndPin(pathId, pinId);
      let data = {} as EmployeesByPin;

      employeesOnSamePin.forEach(employeeOnPath => {
        const { name, registration, id: employeeId } = employeeOnPath.employee;

        if (agroupedEmployees.includes(employeeOnPath.id)) return;
        if (employeeOnPath.confirmation === false) return;

        agroupedEmployees.push(employeeOnPath.id);
        data = {
          position: employeeOnPath.position,
          lat,
          lng,
          employees: data.employees?.length ? data.employees : []
        };
        data.employees.push({
          id: employeeOnPath.id,
          name,
          registration,
          employeeId: employeeOnPath.employee.id,
          disembarkAt: employeeOnPath.disembarkAt,
          boardingAt: employeeOnPath.boardingAt,
          confirmation: employeeOnPath.confirmation,
        });
      });

      if (Object.keys(data).length === 0 && data.constructor === Object) continue;


      employeesByPin.push(data as EmployeesByPin);

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
  ): Promise<Path> {
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
          details: {
            employeeId: employee.id,
            name: employee.name,
            address: employee.address,
            shift: employee.shift,
            registration: employee.registration,
            location: {
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
