import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AssociateEmployeeOnPinDTO } from '../dtos/employeesOnPin/associateEmployeeOnPin.dto';
import { PinService } from './pin.service';
import { EmployeesOnPin } from '../entities/employeesOnPin.entity';
import IEmployeesOnPinRepository from '../repositories/employeesOnPin/employeesOnPin.repository.contract';
import { EmployeeService } from './employee.service';
import { ETypePin } from '../utils/ETypes';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';

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
          await this.employeesOnPinRepository.delete(
            props.employeeId,
            props.pinId,
          );
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
    employee: MappedEmployeeDTO,
  ): Promise<EmployeesOnPin> {
    const pin = await this.pinService.listById(pinId);
    const { pins } = employee;
    let pinAlreadyAssociated: any;

    if (pins.length > 0) {
      pinAlreadyAssociated = pins.filter((_pin) => {
        if (_pin.id === pin.id) {
          return _pin;
        }
      });
    }

    if (pinAlreadyAssociated.length) return;

    return await this.employeesOnPinRepository.create(
      new EmployeesOnPin({ type: ETypePin.CONVENTIONAL }, employee, pin),
    );
  }
}
