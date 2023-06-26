import { EmployeesOnPath } from './../entities/employeesOnPath.entity';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateEmployeesOnPathDTO } from '../dtos/employeesOnPath/createEmployeesOnPath.dto';
import { MappedEmployeesOnPathDTO } from '../dtos/employeesOnPath/mappedEmployeesOnPath.dto';
import { UpdateEmployeesOnPathDTO } from '../dtos/employeesOnPath/updateEmployeesOnPath.dto';
import IEmployeesOnPathRepository from '../repositories/employeesOnPath/employeesOnPath.repository.contract';
import { EmployeeService } from './employee.service';
import { PathService } from './path.service';
import { OnboardEmployeeDTO } from '../dtos/employeesOnPath/onboardEmployee.dto';
import { EStatusPath, ETypePath } from '../utils/ETypes';
import { UpdateEmployeePresenceOnPathDTO } from '../dtos/employeesOnPath/updateEmployeePresenceOnPath.dto';
import { RouteService } from './route.service';
import { DisembarkEmployeeDTO } from '../dtos/employeesOnPath/disembarkEmployee.dto';
import { getDateInLocaleTime } from '../utils/Date';

@Injectable()
export class EmployeesOnPathService {
  constructor(
    @Inject('IEmployeesOnPathRepository')
    private readonly employeesOnPathRepository: IEmployeesOnPathRepository,
    @Inject(forwardRef(() => EmployeeService))
    private readonly employeeService: EmployeeService,
    @Inject(forwardRef(() => PathService))
    private readonly pathService: PathService,
    @Inject(forwardRef(() => RouteService))
    private readonly routeService: RouteService,
  ) {}

  async create(props: CreateEmployeesOnPathDTO): Promise<EmployeesOnPath> {
    let position = 1;

    const path = await this.pathService.listById(props.pathId);

    for await (const id of props.employeeIds) {
      const employee = await this.employeeService.listById(id);

      await this.employeesOnPathRepository.create(
        new EmployeesOnPath(
          { position, confirmation: props.confirmation },
          employee,
          path,
        ),
      );
      position++;
    }

    return;
  }

  async delete(id: string): Promise<EmployeesOnPath> {
    const employeesOnPath = await this.listById(id);

    return await this.employeesOnPathRepository.delete(employeesOnPath.id);
  }

  async listById(id: string): Promise<MappedEmployeesOnPathDTO> {
    const employeesOnPath = await this.employeesOnPathRepository.findById(id);

    if (!employeesOnPath)
      throw new HttpException(
        'Não foi encontrado um colaboradores no trajeto!',
        HttpStatus.NOT_FOUND,
      );

    return this.mappedOne(employeesOnPath);
  }

  async findById(id: string): Promise<EmployeesOnPath> {
    const employeesOnPath = await this.employeesOnPathRepository.findById(id);

    if (!employeesOnPath)
      throw new HttpException(
        'Não foi encontrado um colaboradores no trajeto!',
        HttpStatus.NOT_FOUND,
      );

    return employeesOnPath;
  }

  async onboardEmployee(
    payload: OnboardEmployeeDTO,
  ): Promise<MappedEmployeesOnPathDTO> {
    const employeeOnPath = await this.listById(payload.id);
    const path = await this.pathService.listByEmployeeOnPath(employeeOnPath.id);

    const {
      confirmPresence,
      disconfirmPresence,
      employeeIsAlreadyAusentOnTheRoute,
      employeeIsAlreadyPresentOnTheRoute,
    } = this.getParamsToValidateOnboardingEmployee(
      employeeOnPath.present,
      payload.present,
      );
    
    if (path.type === ETypePath.RETURN) {
      throw new HttpException(
        'Não é permitido realizar embarque em trajetos de volta!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (path.status === EStatusPath.FINISHED) {
      throw new HttpException(
        'Não é possível alterar a presença do colaborador em um trajeto finalizado!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (confirmPresence && employeeIsAlreadyPresentOnTheRoute) {
      throw new HttpException(
        'Colaborador já está presente na rota.',
        HttpStatus.CONFLICT,
      );
    }

    if (disconfirmPresence && employeeIsAlreadyAusentOnTheRoute) {
      throw new HttpException(
        'Ausência do colaborador na rota já foi informada.',
        HttpStatus.CONFLICT,
      );
    }

    if (confirmPresence) {
      employeeOnPath.boardingAt = getDateInLocaleTime(new Date());
    } else {
      Object.assign(employeeOnPath, { ...employeeOnPath, boardingAt: null });
    }

    employeeOnPath.present = payload.present;

    const updatedEmployeeOnPath = await this.employeesOnPathRepository.update(
      employeeOnPath,
    );

    return this.mappedOne(updatedEmployeeOnPath);
  }

  async offboardEmployee(
    payload: DisembarkEmployeeDTO,
  ): Promise<MappedEmployeesOnPathDTO> {
    const employeeOnPath = await this.listById(payload.id);
    const path = await this.pathService.getPathidByEmployeeOnPathId(payload.id);

    if (path.type === ETypePath.ONE_WAY) {
      throw new HttpException(
        'Não é permitido realizar desembarque em trajetos de ida!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (path.status === EStatusPath.FINISHED) {
      throw new HttpException(
        'Não é possível desembarcar colaborador em um trajeto finalizado!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const employeeIsAlreadyDisembarked = employeeOnPath.disembarkAt
      ? true
      : false;

    if (employeeIsAlreadyDisembarked) {
      throw new HttpException(
        'Colaborador já desembarcou da rota!',
        HttpStatus.CONFLICT,
      );
    }

    employeeOnPath.disembarkAt = getDateInLocaleTime(new Date());
    employeeOnPath.present = true;

    const updatedEmployee = await this.employeesOnPathRepository.update(
      employeeOnPath,
    );

    return this.mappedOne(updatedEmployee);
  }

  async employeeNotConfirmed(payload: OnboardEmployeeDTO): Promise<any> {
    await this.listById(payload.id);
    const path = await this.pathService.getPathidByEmployeeOnPathId(payload.id);

    await this.updateWebsocket(payload.id, {
      confirmation: false,
      present: false,
      boardingAt: null,
      disembarkAt: null,
    });

    const data = await this.pathService.listEmployeesByPathAndPin(path.id);

    return data;
  }

  async listByIds(id: string): Promise<EmployeesOnPath[]> {
    const employeesOnPath = await this.employeesOnPathRepository.findByIds(id);

    if (!employeesOnPath)
      throw new HttpException(
        'Não foi encontrado um colaboradores no trajeto!',
        HttpStatus.NOT_FOUND,
      );

    return employeesOnPath;
  }

  async listByRoute(routeId: string): Promise<EmployeesOnPath> {
    const employeesOnPath = await this.employeesOnPathRepository.findByRoute(
      routeId,
    );

    if (!employeesOnPath)
      throw new HttpException(
        `Não foi encontrado um trajeto para a rota: ${routeId}`,
        HttpStatus.NOT_FOUND,
      );

    return employeesOnPath;
  }

  async listManyByRoute(routeId: string): Promise<MappedEmployeesOnPathDTO[]> {
    const employeesOnPath =
      await this.employeesOnPathRepository.findManyByRoute(routeId);

    if (!employeesOnPath.length)
      throw new HttpException(
        'Não foi encontrado um trajeto para essa rota',
        HttpStatus.NOT_FOUND,
      );

    return this.mappedMany(employeesOnPath);
  }

  async update(id: string, data: UpdateEmployeesOnPathDTO): Promise<any> {
    const employeesOnPath = await this.listById(id);

    const { confirmation } = data;

    if (typeof confirmation === 'boolean') {
      const path = await this.pathService.listByEmployeeOnPath(
        employeesOnPath.id,
      );

      const employeeIsAlreadyConfirmedOnTheRoute =
        employeesOnPath.confirmation === true ? true : false;

      if (path.status === EStatusPath.FINISHED) {
        throw new HttpException(
          'Não é possível alterar a presença do colaborador em um trajeto finalizado!',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      if (path.status === EStatusPath.IN_PROGRESS) {
        if (employeeIsAlreadyConfirmedOnTheRoute) {
          throw new HttpException(
            'Não é possível alterar a presença do colaborador em um trajeto em andamento!',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
      }
    }

    const updatedEmployeeOnPath = await this.employeesOnPathRepository.update(
      Object.assign(employeesOnPath, { ...employeesOnPath, ...data }),
    );

    return updatedEmployeeOnPath;
  }

  async updateWebsocket(
    id: string,
    data: UpdateEmployeesOnPathDTO,
  ): Promise<void> {
    const employeeOnPath = await this.listById(id);
    const path = await this.pathService.listByEmployeeOnPath(employeeOnPath.id);

    const employeeIsAlreadyConfirmedOnTheRoute =
      employeeOnPath.confirmation === true ? true : false;

    if (path.status === EStatusPath.FINISHED) {
      throw new HttpException(
        'Não é possível alterar a presença do colaborador em um trajeto finalizado!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (path.status === EStatusPath.IN_PROGRESS) {
      if (employeeIsAlreadyConfirmedOnTheRoute) {
        throw new HttpException(
          'Não é possível alterar a presença do colaborador em um trajeto em andamento!',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    }

    await this.employeesOnPathRepository.update(
      Object.assign(employeeOnPath, { ...employeeOnPath, ...data }),
    );
  }

  async updateEmployeeParticipationOnPath(
    id: string,
    payload: UpdateEmployeePresenceOnPathDTO,
  ): Promise<MappedEmployeesOnPathDTO> {
    const employeeOnPath = await this.findById(id);

    const path = await this.pathService.listByEmployeeOnPath(employeeOnPath.id);

    const employeeIsAlreadyConfirmedOnTheRoute =
      employeeOnPath.confirmation === true ? true : false;

    const updateEmployeePresence =
      async (): Promise<MappedEmployeesOnPathDTO> => {
        const updatedEmployeeOnPath =
          await this.employeesOnPathRepository.update(
            Object.assign(employeeOnPath, {
              ...employeeOnPath,
              confirmation: payload.confirmation,
            }),
          );

        return this.mappedOne(updatedEmployeeOnPath);
      };

    // Se a rota já finalizou, colaborador não pode fazer nada
    if (path.status === EStatusPath.FINISHED) {
      throw new HttpException(
        'Não é possível alterar a presença do colaborador em um trajeto finalizado!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    // Se a rota ainda não iniciou, colaborador pode confirmar e desconfirmar
    if (path.status === EStatusPath.PENDING) {
      return await updateEmployeePresence();
    }

    // Se o trajeto está em andamento, colaborador pode confirmar presença
    if (path.status === EStatusPath.IN_PROGRESS) {
      if (employeeIsAlreadyConfirmedOnTheRoute) {
        throw new HttpException(
          'Não é possível alterar a presença do colaborador em um trajeto em andamento!',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      return await updateEmployeePresence();
    }
  }

  async listByPathAndPin(
    pathId: string,
    pinId: string,
  ): Promise<EmployeesOnPath[]> {
    const data = await this.employeesOnPathRepository.findByPathAndPin(
      pathId,
      pinId,
    );

    if (!data.length)
      throw new HttpException(
        `Não foi encontrado um colaborador no trajeto com este trajeto: ${pathId} e neste ponto de embarque: ${pinId}`,
        HttpStatus.NOT_FOUND,
      );

    return data;
  }

  async listByPath(pathId: string): Promise<EmployeesOnPath[]> {
    const data = await this.employeesOnPathRepository.findByPath(pathId);

    if (!data.length)
      throw new HttpException(
        `Não foi encontrado um colaborador no trajeto com este trajeto: ${pathId}`,
        HttpStatus.NOT_FOUND,
      );
    return data;
  }

  async clearEmployeesOnPath(pathId: string): Promise<void> {
    const path = await this.pathService.listById(pathId);

    const employeesOnPath = await this.employeesOnPathRepository.findByPath(
      pathId,
    );
    if (path.type === ETypePath.ONE_WAY) {
      await this.employeesOnPathRepository.updateMany(employeesOnPath, true);
    }

    if (path.type === ETypePath.RETURN) {
      await this.employeesOnPathRepository.updateMany(employeesOnPath, true);
    }
  }

  private async listByEmployeeAndPath(
    employeeId: string,
    pathId: string,
  ): Promise<EmployeesOnPath> {
    const employeeOnPath =
      await this.employeesOnPathRepository.findByEmployeeAndPath(
        employeeId,
        pathId,
      );

    if (!employeeOnPath)
      throw new HttpException(
        'Não foi encontrado um colaborador no trajeto!',
        HttpStatus.NOT_FOUND,
      );

    return employeeOnPath;
  }

  private async listByEmployeeAndRoute(
    employeeId: string,
    routeId: string,
  ): Promise<EmployeesOnPath[]> {
    const employeesOnPath =
      await this.employeesOnPathRepository.findManyByEmployeeAndRoute(
        employeeId,
        routeId,
      );

    if (!employeesOnPath)
      throw new HttpException(
        'Não foi encontrado um colaborador no trajeto!',
        HttpStatus.NOT_FOUND,
      );

    return employeesOnPath;
  }

  async updateEmployeePositionByEmployeeAndPath(
    employeeId: string,
    pathId: string,
    newPosition: number,
  ): Promise<void> {
    const employeeOnPath = await this.listByEmployeeAndPath(employeeId, pathId);

    await this.employeesOnPathRepository.updatePosition(
      employeeOnPath.id,
      newPosition,
    );

    return;
  }

  async removeEmployeeOnPath(employeeId: string, routeId: string) {
    const employee = await this.employeeService.listById(employeeId);

    const employeesOnPath = await this.listByEmployeeAndRoute(
      employee.id,
      routeId,
    );

    for await (const employeeOnPath of employeesOnPath) {
      await this.delete(employeeOnPath.id);
    }

    await this.routeService.updateEmployeePositionOnPath(routeId);

    return;
  }

  private checksIfPathCanBeUpdated(pathStatus: EStatusPath): void {
    if (pathStatus === EStatusPath.FINISHED) {
      throw new HttpException(
        'Não é possível alterar a presença do colaborador em um trajeto finalizado!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (pathStatus === EStatusPath.IN_PROGRESS) {
      // if (employeeIsAlreadyConfirmedOnTheRoute) {
      throw new HttpException(
        'Não é possível alterar a presença do colaborador em um trajeto em andamento!',
        HttpStatus.NOT_ACCEPTABLE,
      );
      // }
    }
  }

  private getParamsToValidateOnboardingEmployee(
    employeePresence: boolean,
    isToConfirm: boolean,
  ) {
    const employeeIsAlreadyPresentOnTheRoute =
      employeePresence === true ? true : false;

    const employeeIsAlreadyAusentOnTheRoute =
      employeePresence === false ? true : false;

    const confirmPresence = isToConfirm === true ? true : false;

    const disconfirmPresence = isToConfirm === false ? true : false;

    return {
      employeeIsAlreadyAusentOnTheRoute,
      employeeIsAlreadyPresentOnTheRoute,
      confirmPresence,
      disconfirmPresence,
    };
  }

  private mappedOne(
    employeesOnPath: EmployeesOnPath,
  ): MappedEmployeesOnPathDTO {
    const { employee } = employeesOnPath;
    const { pins } = employee;

    return {
      id: employeesOnPath.id,
      position: employeesOnPath.position,
      confirmation: employeesOnPath.confirmation,
      present: employeesOnPath.present,
      boardingAt: employeesOnPath.boardingAt,
      disembarkAt: employeesOnPath.disembarkAt,
      createdAt: employeesOnPath.createdAt,
      details: {
        name: employee.name,
        address: JSON.parse(employee.address),
        shift: employee.shift,
        registration: employee.registration,
        location: {
          lat: pins?.at(0)?.pin?.lat,
          lng: pins?.at(0)?.pin?.lng,
        },
      },
    };
  }

  private mappedMany(
    employeesOnPaths: EmployeesOnPath[],
  ): MappedEmployeesOnPathDTO[] {
    return employeesOnPaths.map((employeesOnPath) => {
      const { employee } = employeesOnPath;
      const { pins } = employee;

      return {
        id: employeesOnPath.id,
        position: employeesOnPath.position,
        confirmation: employeesOnPath.confirmation,
        present: employeesOnPath.present,
        boardingAt: employeesOnPath.boardingAt,
        disembarkAt: employeesOnPath.disembarkAt,
        createdAt: employeesOnPath.createdAt,
        details: {
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
    });
  }
}
