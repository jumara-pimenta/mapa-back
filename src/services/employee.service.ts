import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Employee } from '../entities/employee.entity';
import IEmployeeRepository from '../repositories/employee/employee.repository.contract';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';
import { CreateEmployeeDTO } from '../dtos/employee/createEmployee.dto';
import { UpdateEmployeeDTO } from '../dtos/employee/updateEmployee.dto';
import { PinService } from './pin.service';
import { EmployeesOnPinService } from './employeesOnPin.service';
import { AssociateEmployeeOnPinDTO } from '../dtos/employeesOnPin/associateEmployeeOnPin.dto';
import { ECreatePin } from '../utils/ETypes';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository,
    @Inject(forwardRef(() => EmployeesOnPinService))
    private readonly employeeOnPinService: EmployeesOnPinService,
    @Inject(forwardRef(() => PinService))
    private readonly pinService: PinService,
  ) {}

  async create(props: CreateEmployeeDTO): Promise<Employee> {
    const cpfAlredyExist = await this.employeeRepository.findByCpf(props.cpf);
    const rgAlredyExist = await this.employeeRepository.findByRg(props.rg);
    const registrationAlredyExist =
      await this.employeeRepository.findByRegistration(props.registration);

    if (registrationAlredyExist) {
      throw new HttpException(
        `Matrícula já cadastrada: ${props.registration}!`,
        HttpStatus.CONFLICT,
      );
    }

    if (cpfAlredyExist) {
      throw new HttpException(
        `CPF jé cadastrado: ${props.cpf}!`,
        HttpStatus.CONFLICT,
      );
    }

    if (rgAlredyExist) {
      throw new HttpException(
        `RG ja cadastrado: ${props.rg}`,
        HttpStatus.CONFLICT,
      );
    }

    const employee = await this.employeeRepository.create(new Employee(props));

    if (props.pin.typeCreation === ECreatePin.IS_EXISTENT) {
      if (!props.pin.id)
        throw new HttpException(
          'Id do ponto de embarque precisa ser enviado para associar ao ponto existente!',
          HttpStatus.BAD_REQUEST,
        );

      await this.employeeOnPinService.associateEmployee({
        employeeId: employee.id,
        pinId: props.pin.id,
        type: 'CONVENCIONAL',
      } as AssociateEmployeeOnPinDTO);
    } else if (props.pin.typeCreation === ECreatePin.IS_NEW) {
      const { title, local, details, lat, lng } = props.pin;

      const pin = await this.pinService.create({
        title,
        local,
        details,
        lat,
        lng,
      });

      await this.employeeOnPinService.associateEmployee({
        employeeId: employee.id,
        pinId: pin.id,
        type: 'CONVENCIONAL',
      } as AssociateEmployeeOnPinDTO);
    }

    return employee;
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
    const employee = await this.employeeRepository.findById(id);

    function isValidCPF(cpf) {
      if (typeof cpf !== 'string') return false;
      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
      cpf = cpf.split('').map((el) => +el);
      const rest = (count) =>
        ((cpf
          .slice(0, count - 12)
          .reduce((soma, el, index) => soma + el * (count - index), 0) *
          10) %
          11) %
        10;
      return rest(10) === cpf[9] && rest(11) === cpf[10];
    }

    if (
      data.cpf.length !== 11 ||
      (!Array.from(data.cpf).filter((e) => e !== data.cpf[0]).length &&
        isValidCPF)
    ) {
      throw new HttpException(`CPF INVALIDO: ${data.cpf}`, HttpStatus.CONFLICT);
    } else {
      return await this.employeeRepository.update(
        Object.assign(employee, { ...employee, ...data }),
      );
    }
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
