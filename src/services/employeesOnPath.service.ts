import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateEmployeesOnPathDTO } from "../dtos/employeesOnPath/createEmployeesOnPath.dto";
import { MappedEmployeesOnPathDTO } from "../dtos/employeesOnPath/mappedEmployeesOnPath.dto";
import { UpdateEmployeesOnPathDTO } from "../dtos/employeesOnPath/updateEmployeesOnPath.dto";
import { EmployeesOnPath } from "../entities/employeesOnPath.entity";
import IEmployeesOnPathRepository from "../repositories/employeesOnPath/employeesOnPath.repository.contract";
import { EmployeeService } from "./employee.service";
import { PathService } from "./path.service";

@Injectable()
export class EmployeesOnPathService {
  constructor(
    @Inject("IEmployeesOnPathRepository")
    private readonly employeesOnPathRepository: IEmployeesOnPathRepository,
    private readonly employeeService: EmployeeService,
    @Inject(forwardRef(() => PathService))
    private readonly pathService: PathService
  ) { }

  async create(props: CreateEmployeesOnPathDTO): Promise<EmployeesOnPath> {

    let position: number = 1;

    const path = await this.pathService.listById(props.pathId);

    for await (const id of props.employeeIds) {
      const employee = await this.employeeService.listById(id);

      await this.employeesOnPathRepository.create(new EmployeesOnPath({ position }, employee, path));

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

    if (!employeesOnPath) throw new HttpException(
      `Não foi encontrado um colaboradores no trajeto com o id: ${id}!`, 
      HttpStatus.NOT_FOUND
    );

    return this.mappedOne(employeesOnPath);
  }

  async listByRoute(routeId: string): Promise<EmployeesOnPath> {
    const employeesOnPath = await this.employeesOnPathRepository.findByRoute(routeId);

    if (!employeesOnPath) throw new HttpException(
      `Não foi encontrado um trajeto para a rota: ${routeId}`, 
      HttpStatus.NOT_FOUND
    );

    return employeesOnPath;
  }

  async listManyByRoute(routeId: string): Promise<MappedEmployeesOnPathDTO[]> {
    const employeesOnPath = await this.employeesOnPathRepository.findManyByRoute(routeId);

    if (!employeesOnPath.length) throw new HttpException(
      `Não foi encontrado um trajeto para a rota: ${routeId}`, 
      HttpStatus.NOT_FOUND
    );

    return this.mappedMany(employeesOnPath);
  }   

  async update(id: string, data: UpdateEmployeesOnPathDTO): Promise<MappedEmployeesOnPathDTO> {

    const employeesOnPath = await this.listById(id);

    const updatedEmployeeOnPath = await this.employeesOnPathRepository.update(
      Object.assign(
        employeesOnPath, 
        {...employeesOnPath, ...data}
    ));

    return this.mappedOne(updatedEmployeeOnPath);
  }

  private mappedOne(employeesOnPath: EmployeesOnPath): MappedEmployeesOnPathDTO {
    const { employee } = employeesOnPath;
    const { pins } = employee;

    return {
      id: employeesOnPath.id,
      boardingAt: employeesOnPath.boardingAt,
      confirmation: employeesOnPath.confirmation,
      disembarkAt: employeesOnPath.disembarkAt,
      position: employeesOnPath.position,
      createdAt: employeesOnPath.createdAt,
      locations: {
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
    };
  }

  private mappedMany(employeesOnPaths: EmployeesOnPath[]): MappedEmployeesOnPathDTO[] {
    return employeesOnPaths.map(employeesOnPath => {
      const { employee } = employeesOnPath;
      const { pins } = employee;

      return {
        id: employeesOnPath.id,
        boardingAt: employeesOnPath.boardingAt,
        confirmation: employeesOnPath.confirmation,
        disembarkAt: employeesOnPath.disembarkAt,
        position: employeesOnPath.position,
        createdAt: employeesOnPath.createdAt,
        locations: {
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
    });
  }
}
