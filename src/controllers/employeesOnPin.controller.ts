import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssociateEmployeeOnPinDTO } from '../dtos/employeesOnPin/associateEmployeeOnPin.dto';
import { EmployeesOnPin } from '../entities/employeesOnPin.entity';
import { EmployeesOnPinService } from '../services/employeesOnPin.service';

@Controller('/api/employees/pins')
@ApiTags('EmployeesOnPin')

export class EmployeesOnPinController {
  constructor(private readonly employeeOnPinService: EmployeesOnPinService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async associateEmployeeWithPin(
    @Body() payload: AssociateEmployeeOnPinDTO,
  ): Promise<EmployeesOnPin> {
    return await this.employeeOnPinService.associateEmployee(payload);
  }
}
