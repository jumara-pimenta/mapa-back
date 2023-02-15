import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AssociateEmployeeOnPinDTO } from '../dtos/employeesOnPin/associateEmployeeOnPin.dto';
import { PinService } from './pin.service';
import { EmployeesOnPin } from '../entities/employeesOnPin.entity';
import IEmployeesOnPinRepository from '../repositories/employeesOnPin/employeesOnPin.repository.contract';
import { EmployeeService } from './employee.service';
import { ETypePin } from '../utils/ETypes';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';
import { Employee } from '../entities/employee.entity';
import { Pin } from '../entities/pin.entity';

@Injectable()
export class EmployeesOnPinService {
  constructor(
    @Inject('IEmployeesOnPinRepository')
    private readonly employeesOnPinRepository: IEmployeesOnPinRepository,
    @Inject(forwardRef(() => EmployeeService))
    private readonly employeeService: EmployeeService,
    @Inject(forwardRef(() => PinService))
    private readonly pinService: PinService,
  ) {}

  async associateEmployee(
    props: AssociateEmployeeOnPinDTO,
  ): Promise<EmployeesOnPin> {
    const employee = await this.employeeService.listById(props.employeeId);
    const pin = await this.pinService.listById(props.pinId);

    if (employee.pins.length > 0) {
      for await (const _pin of employee.pins) {
        if (_pin.id === pin.id) {
          return await this.employeesOnPinRepository.find(
            props.employeeId,
            props.pinId,
          );
        }

        if (_pin.type === props.type) {
          await this.employeesOnPinRepository.delete(props.employeeId, _pin.id);
          return await this.employeesOnPinRepository.create(
            new EmployeesOnPin({ type: props.type }, employee, pin),
          );
        }
      }
    }

    return await this.employeesOnPinRepository.create(
      new EmployeesOnPin({ type: props.type }, employee, pin),
    );
  }

  async associateEmployeeByService(
    pinId: string,
    employee: Employee,
  ): Promise<EmployeesOnPin> {
    const pin = await this.pinService.listById(pinId);
    const { pins } = employee;
    let pinAlreadyAssociated: any;

    const employeeOnPin = await this.employeesOnPinRepository.find(
      employee.id,
      pinId,
    );
    if (employeeOnPin)
      await this.employeesOnPinRepository.delete(employee.id, pinId);

    return await this.employeesOnPinRepository.create(
      new EmployeesOnPin({ type: ETypePin.CONVENTIONAL }, employee, pin),
    );
  }

  async delete(employeeId: string, pinId: string): Promise<void> {
    return await this.employeesOnPinRepository.delete(employeeId, pinId);
  }
}
