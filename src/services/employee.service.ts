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
import { ETypeCreationPin, ETypeEditionPin, ETypePin } from '../utils/ETypes';
import { Pin } from '../entities/pin.entity';

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
    let pin: Pin;

    const registrationExists = await this.employeeRepository.findByRegistration(
      props.registration,
    );

    if (registrationExists) {
      throw new HttpException(
        'Matrícula já cadastrada para outro(a) colaborador(a)!',
        HttpStatus.CONFLICT,
      );
    }

    if (props.pin.typeCreation === ETypeCreationPin.IS_EXISTENT) {
      if (!props.pin.id)
        throw new HttpException(
          'O id do ponto de embarque precisa ser enviado para associar ao ponto de embarque existente!',
          HttpStatus.BAD_REQUEST,
        );
    } else if (props.pin.typeCreation === ETypeCreationPin.IS_NEW) {
      const { title, local, details, lat, lng } = props.pin;

      if (!title || !local || !details || !lat || !lng) {
        throw new HttpException(
          'Todas as informações são obrigatórias para cadastrar um colaborador a um ponto de embarque inexistente: title, local, details, lat, lng',
          HttpStatus.BAD_REQUEST,
        );
      }

      pin = await this.pinService.create({
        title,
        local,
        details,
        lat,
        lng,
      });
    }
    let { address, ...employeeData } = props;
    address = JSON.stringify(address);

    const employee = await this.employeeRepository.create(
      new Employee({ address, ...employeeData }),
    );

    await this.employeeOnPinService.associateEmployee({
      employeeId: employee.id,
      pinId:
        props.pin.typeCreation === ETypeCreationPin.IS_EXISTENT
          ? props.pin.id
          : pin.id,
      type: ETypePin.CONVENTIONAL,
    });

    return {...employee, address: JSON.parse(employee.address)};
  }

  async delete(id: string): Promise<Employee> {
    const employee = await this.listById(id);

    return await this.employeeRepository.delete(employee.id);
  }

  async listById(id: string): Promise<MappedEmployeeDTO> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee)
      throw new HttpException(
        'Colaborador(a) não foi encontrado(a)!',
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(employee);
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

    const items = this.mapperMany(employees.items);

    return {
      total: employees.total,
      items,
    };
  }

  async update(
    id: string,
    data: UpdateEmployeeDTO,
  ): Promise<MappedEmployeeDTO> {
    let employee = await this.listById(id);
    employee.address = JSON.stringify(employee.address);
    let pin: Pin;

    if (data.registration) {
      const registrationExists =
        await this.employeeRepository.findByRegistration(data.registration);

      if (
        registrationExists &&
        registrationExists.registration !== employee.registration
      ) {
        throw new HttpException(
          'Matrícula já cadastrada para outro(a) colaborador(a)!',
          HttpStatus.CONFLICT,
        );
      }
    }
    if (data.pin) {
      if (data.pin.typeEdition === ETypeEditionPin.IS_EXISTENT) {
        if (!data.pin.id)
          throw new HttpException(
            'O id do ponto de embarque precisa ser enviado para associar ao ponto de embarque existente!',
            HttpStatus.BAD_REQUEST,
          );

        await this.employeeOnPinService.associateEmployeeByService(
          data.pin.id,
          employee,
        );
      } else if (data.pin.typeEdition === ETypeEditionPin.IS_NEW) {
        const { title, local, details, lat, lng } = data.pin;

        if (!title || !local || !details || !lat || !lng) {
          throw new HttpException(
            'Todas as informações são obrigatórias para editar um colaborador a um ponto de embarque inexistente: title, local, details, lat, lng',
            HttpStatus.BAD_REQUEST,
          );
        }

        pin = await this.pinService.create({
          title,
          local,
          details,
          lat,
          lng,
        });
      }
      
      pin = await this.pinService.create({
        title,
        local,
        details,
        lat,
        lng,
      });
      
      await this.employeeOnPinService.associateEmployeeByService(
        pin.id,
        employee,
      );
    }


    data.address = JSON.stringify(data?.address);

    const updatedEmployee = await this.employeeRepository.update(
      Object.assign(employee, { ...employee, ...data }),
    );

    return this.mapperOne(updatedEmployee);
  }

  async listAllEmployeesPins(ids: string[]): Promise<Employee[]> {
    return await this.employeeRepository.findByIds(ids);
  }

  private mapperMany(employees: Employee[]): MappedEmployeeDTO[] {
    return employees.map((employee) => {
      return {
        id: employee.id,
        name: employee.name,
        address: JSON.parse(employee.address),
        admission: employee.admission,
        costCenter: employee.costCenter,
        registration: employee.registration,
        role: employee.role,
        shift: employee.shift,
        createdAt: employee.createdAt,
        pins: employee.pins?.map((employeesOnPin) => {
          return {
            id: employeesOnPin.pin.id,
            title: employeesOnPin.pin.title,
            local: employeesOnPin.pin.local,
            details: employeesOnPin.pin.details,
            lat: employeesOnPin.pin.lat,
            lng: employeesOnPin.pin.lng,
            type: employeesOnPin.type as ETypePin,
          };
        }),
      };
    });
  }

  private mapperOne(employee: Employee): MappedEmployeeDTO {
    return {
      id: employee.id,
      name: employee.name,
      address: JSON.parse(employee.address),
      admission: employee.admission,
      costCenter: employee.costCenter,
      registration: employee.registration,
      role: employee.role,
      shift: employee.shift,
      createdAt: employee.createdAt,
      pins: employee.pins.map((employeesOnPin) => {
        return {
          id: employeesOnPin.pin.id,
          title: employeesOnPin.pin.title,
          local: employeesOnPin.pin.local,
          details: employeesOnPin.pin.details,
          lat: employeesOnPin.pin.lat,
          lng: employeesOnPin.pin.lng,
          type: employeesOnPin.type as ETypePin,
        };
      }),
    };
  }
}
