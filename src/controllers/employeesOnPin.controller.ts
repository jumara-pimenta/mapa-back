import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
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
      example: {
        employeeId: '2e2b8886-5d93-4304-b00f-aa08e895865d',
        pinId: 'c0294d1c-5629-4969-90cb-36cc859685ae',
        type: 'CONVENCIONAL',
        createdAt: new Date(),
        updatedAt: null
      }  
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async associateEmployeeWithPin(
    @Body() payload: AssociateEmployeeOnPinDTO,
  ): Promise<EmployeesOnPin> {
    return await this.employeeOnPinService.associateEmployee(payload);
  }
}
