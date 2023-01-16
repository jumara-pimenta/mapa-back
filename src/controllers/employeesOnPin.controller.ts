import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateEmployeesOnPin } from 'src/utils/examples.swagger';
import { AssociateEmployeeOnPinDTO } from '../dtos/employeesOnPin/associateEmployeeOnPin.dto';
import { EmployeesOnPin } from '../entities/employeesOnPin.entity';
import { EmployeesOnPinService } from '../services/employeesOnPin.service';

@Controller('/api/employees/pins')
@ApiTags('EmployeesOnPin')
export class EmployeesOnPinController {
  constructor(private readonly employeeOnPinService: EmployeesOnPinService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Associate a Driver with a pin.',
    schema: {
      type: 'object',
      example: CreateEmployeesOnPin,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async associateEmployeeWithPin(
    @Body() payload: AssociateEmployeeOnPinDTO,
  ): Promise<EmployeesOnPin> {
    return await this.employeeOnPinService.associateEmployee(payload);
  }
}
