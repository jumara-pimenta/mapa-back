import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UpdateEmployeesStatusOnPathDTO } from '../dtos/employeesOnPath/updateEmployeesStatusOnPath.dto';
import { CreateEmployeesOnPathDTO } from '../dtos/employeesOnPath/createEmployeesOnPath.dto';
import { MappedEmployeesOnPathDTO } from '../dtos/employeesOnPath/mappedEmployeesOnPath.dto';
import { UpdateEmployeesOnPathDTO } from '../dtos/employeesOnPath/updateEmployeesOnPath.dto';
import { EmployeesOnPath } from '../entities/employeesOnPath.entity';
import IEmployeesOnPathRepository from '../repositories/employeesOnPath/employeesOnPath.repository.contract';
import { EmployeeService } from './employee.service';
import { PathService } from './path.service';
import { IdUpdateDTO } from '../dtos/employeesOnPath/idUpdateWebsocket';
import { ETypePath } from 'src/utils/ETypes';

@Injectable()
export class EmployeesOnPathService {
  constructor(
    @Inject('IEmployeesOnPathRepository')
    private readonly employeesOnPathRepository: IEmployeesOnPathRepository,
    private readonly employeeService: EmployeeService,
    @Inject(forwardRef(() => PathService))
    private readonly pathService: PathService,
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

  async onboardEmployee(payload: IdUpdateDTO): Promise<any> {
    await this.listById(payload.id);
    const path = await this.pathService.getPathidByEmployeeOnPathId(payload.id);

    if (payload.present === false) {
      await this.updateWebsocket(payload.id, {
        present: payload.present,
        boardingAt: null,
      });
    }
    if (payload.present === true) {
      await this.updateWebsocket(payload.id, {
        confirmation: true,
        present: payload.present,
        boardingAt: new Date(),
      });
    }

    const data = await this.pathService.listEmployeesByPathAndPin(path.id);

    return data;
  }

  async offboardEmployee(payload: IdUpdateDTO): Promise<any> {
    await this.listById(payload.id);
    const path = await this.pathService.getPathidByEmployeeOnPathId(payload.id);

    if (payload.present === false) {
      await this.updateWebsocket(payload.id, {
        present: payload.present,
        disembarkAt: null,
      });
    }
    if (payload.present === true) {
      await this.updateWebsocket(payload.id, {
        confirmation: true,
        present: payload.present,
        disembarkAt: new Date(),
      });
    }

    const data = await this.pathService.listEmployeesByPathAndPin(path.id);

    return data;
  }

  async employeeNotConfirmed(payload: IdUpdateDTO): Promise<any> {
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

    const updatedEmployeeOnPath = await this.employeesOnPathRepository.update(
      Object.assign(employeesOnPath, { ...employeesOnPath, ...data }),
    );

    return updatedEmployeeOnPath;
  }

  async updateWebsocket(
    id: string,
    data: UpdateEmployeesOnPathDTO,
  ): Promise<void> {
    const employeesOnPath = await this.listById(id);

    await this.employeesOnPathRepository.update(
      Object.assign(employeesOnPath, { ...employeesOnPath, ...data }),
    );
  }

  async updateStatus(payload: UpdateEmployeesStatusOnPathDTO): Promise<any> {
    const employeesOnPath = await this.findById(payload.id);

    const updatedEmployeeOnPath = await this.employeesOnPathRepository.update(
      Object.assign(employeesOnPath, {
        ...employeesOnPath,
        confirmation: payload.status,
      }),
    );
    return updatedEmployeeOnPath;
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

  private mappedOne(
    employeesOnPath: EmployeesOnPath,
  ): MappedEmployeesOnPathDTO {
    const { employee } = employeesOnPath;
    const { pins } = employee;

    return {
      id: employeesOnPath.id,
      boardingAt: employeesOnPath.boardingAt,
      confirmation: employeesOnPath.confirmation,
      disembarkAt: employeesOnPath.disembarkAt,
      position: employeesOnPath.position,
      createdAt: employeesOnPath.createdAt,
      details: {
        name: employee.name,
        address: employee.address,
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
        boardingAt: employeesOnPath.boardingAt,
        confirmation: employeesOnPath.confirmation,
        disembarkAt: employeesOnPath.disembarkAt,
        position: employeesOnPath.position,
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
