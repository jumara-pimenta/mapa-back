import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Employee } from '../entities/employee.entity';
import IEmployeeRepository from '../repositories/employee/employee.repository.contract';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';
import { CreateEmployeeDTO } from '../dtos/employee/createEmployee.dto';
import { UpdateEmployeeDTO } from '../dtos/employee/updateEmployee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async create(payload: CreateEmployeeDTO): Promise<Employee> {
    const CpfExists = await this.employeeRepository.findByCpf(payload.cpf);
    const RgExists = await this.employeeRepository.findByRg(payload.rg);
    const RegistrationExists = await this.employeeRepository.findByRegistration(
      payload.registration,
    );

    if (CpfExists)
      throw new HttpException(
        'CPF cadastrado para outro(a) colaborador(a)',
        HttpStatus.CONFLICT,
      );

    if (RgExists)
      throw new HttpException(
        'RG cadastrado para outro(a) colaborador(a)',
        HttpStatus.CONFLICT,
      );

    if (RegistrationExists)
      throw new HttpException(
        'Matrícula cadastrada para outro(a) colaborador(a)',
        HttpStatus.CONFLICT,
      );

    return this.employeeRepository.create(new Employee(payload));
  }

  async delete(id: string): Promise<Employee> {
    const employee = await this.listById(id);

    return await this.employeeRepository.delete(employee.id);
  }

  async listById(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee)
      throw new HttpException(
        `Não foi encontrado um(a) colaborador(a) com o id: ${id}`,
        HttpStatus.NOT_FOUND,
      );

    return employee;
  }

  async listAll(
    page: Page,
    filters?: FiltersEmployeeDTO,
  ): Promise<PageResponse<MappedEmployeeDTO>> {
    const employees = await this.employeeRepository.findAll(page, filters);

    if (employees.total === 0) {
      throw new HttpException(
        'Não existe colaborador(a) para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = this.toDTO(employees.items);

    return {
      total: employees.total,
      items,
    };
  }

  async update(id: string, data: UpdateEmployeeDTO): Promise<Employee> {
    const employee = await this.listById(id);

    if (data.cpf) {
      const CpfExists = await this.employeeRepository.findByCpf(data.cpf);
      if (CpfExists && CpfExists.cpf !== employee.cpf) {
        throw new HttpException(
          'CPF cadastrado para outro(a) colaborador(a)',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (data.rg) {
      const RgExists = await this.employeeRepository.findByRg(data.rg);

      if (RgExists && RgExists.rg !== employee.rg) {
        throw new HttpException(
          'RG cadastrado para outro(a) colaborador(a)',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (data.registration) {
      const RegistrationExists =
        await this.employeeRepository.findByRegistration(data.registration);

      if (
        RegistrationExists &&
        RegistrationExists.registration !== employee.registration
      ) {
        throw new HttpException(
          'Matrícula cadastrada para outro(a) colaborador(a)',
          HttpStatus.CONFLICT,
        );
      }
    }

    return await this.employeeRepository.update(
      Object.assign(employee, { ...employee, ...data }),
    );
  }

  async listAllEmployeesPins(ids: string[]): Promise<Employee[]> {
    return await this.employeeRepository.findByIds(ids);
  }

  private toDTO(employees: Employee[]): MappedEmployeeDTO[] {
    return employees.map((employee) => {
      return {
        id: employee.id,
        name: employee.name,
        address: employee.address,
        admission: employee.admission,
        costCenter: employee.costCenter,
        cpf: employee.cpf,
        registration: employee.registration,
        rg: employee.rg,
        role: employee.role,
        shift: employee.shift,
        createdAt: employee.createdAt,
      };
    });
  }
}
