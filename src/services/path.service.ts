import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Path } from '../entities/path.entity';
import IPathRepository from '../repositories/path/path.repository.contract';
import { MappedPathDTO } from '../dtos/path/mappedPath.dto';
import { CreatePathDTO } from '../dtos/path/createPath.dto';
import { UpdatePathDTO } from '../dtos/path/updatePath.dto';
import { RouteService } from './route.service';
import { EStatusPath, ETypePath } from '../utils/ETypes';
import { EmployeesOnPathService } from './employeesOnPath.service';

@Injectable()
export class PathService {
  constructor(
    @Inject('IPathRepository')
    private readonly pathRepository: IPathRepository,
    @Inject(forwardRef(() => RouteService))
    private readonly routeService: RouteService,
    @Inject(forwardRef(() => EmployeesOnPathService))
    private readonly employeesOnPathService: EmployeesOnPathService,
  ) {}

  async generate(props: CreatePathDTO): Promise<void> {
    const { type, duration, isAutoRoute, startsAt } = props.details;

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
      });

      await this.employeesOnPathService.create({
        employeeIds: props.employeeIds,
        pathId: pathReturn.id,
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
        `Não foi encontrado um path com o id: ${id}`,
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(path);
  }

  async listManyByRoute(routeId: string): Promise<MappedPathDTO[]> {
    const path = await this.pathRepository.findByRoute(routeId);

    if (!path.length)
      throw new HttpException(
        `Não foram encontrados trajetos para a rota com o id: ${routeId}!`,
        HttpStatus.NOT_FOUND,
      );

    return this.mapperMany(path);
  }

  async listManyByDriver(driverId: string): Promise<MappedPathDTO[]> {
    const path = await this.pathRepository.findByDriver(driverId);

    if (!path.length)
      throw new HttpException(
        `Não foram encontrados trajetos para este motorista!`,
        HttpStatus.NOT_FOUND,
      );

    return this.mapperMany(path);
  }

  async update(id: string, data: UpdatePathDTO): Promise<Path> {
    const path = await this.listById(id);

    if (data.status) {

      if (data.status === EStatusPath.PENDING && path.status === EStatusPath.PENDING) {
        throw new HttpException('O status do trajeto já está pendente!', HttpStatus.CONFLICT);
      }

      if (data.status === EStatusPath.IN_PROGRESS && path.status === EStatusPath.IN_PROGRESS) {
        throw new HttpException('O trajeto já se encontra em andamento!', HttpStatus.CONFLICT);
      }

      if (data.status === EStatusPath.FINISHED && path.status === EStatusPath.FINISHED) {
        throw new HttpException(
          'Não é possível atualizar o status de um trajeto que já foi finalizado!', 
          HttpStatus.METHOD_NOT_ALLOWED);
      }
    }

    return await this.pathRepository.update(
      Object.assign(path, { ...path, ...data }),
    );
  }

  private mapperOne(path: Path): MappedPathDTO {
    const { employeesOnPath } = path;

    return {
      id: path.id,
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
            registration: employee.registration,
            location: {
              lat: pins.at(0).pin.lat,
              long: pins.at(0).pin.long,
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
              registration: employee.registration,
              location: {
                lat: pins.at(0).pin.lat,
                long: pins.at(0).pin.long,
              },
            },
          };
        }),
      };
    });
  }
}
