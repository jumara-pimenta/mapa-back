import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AssociateEmployeeOnPinDTO } from "../dtos/employeesOnPin/associateEmployeeOnPin.dto";
import { PinService } from "./pin.service";
import { EmployeesOnPin } from "../entities/employeesOnPin.entity";
import IEmployeesOnPinRepository from "../repositories/employeesOnPin/employeesOnPin.repository.contract";
import { EmployeeService } from "./employee.service";

@Injectable()
export class EmployeesOnPinService {
  constructor(
    @Inject("IEmployeesOnPinRepository")
    private readonly employeesOnPinRepository: IEmployeesOnPinRepository,
    @Inject(forwardRef(() => EmployeeService))
    private readonly employeeService: EmployeeService,
    @Inject(forwardRef(() => PinService))
    private readonly pinService: PinService
  ) { }

  async associateEmployee(props: AssociateEmployeeOnPinDTO): Promise<EmployeesOnPin> {

    const employee = await this.employeeService.listById(props.employeeId);

    const pin = await this.pinService.listById(props.pinId);

    return await this.employeesOnPinRepository.create(new EmployeesOnPin({ type: props.type }, employee, pin));
  }
}
