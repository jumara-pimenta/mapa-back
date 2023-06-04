import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { UpdateEmployeesOnPathDTO } from '../dtos/employeesOnPath/updateEmployeesOnPath.dto';
import {
  GetEmmployeesOnPathByRoute,
  GetEmployeesOnPath,
  UpdateConfirmationEmployeesOnPathById,
  UpdateEmployeesOnPathById,
} from '../utils/examples.swagger';
import { MappedEmployeesOnPathDTO } from '../dtos/employeesOnPath/mappedEmployeesOnPath.dto';
import { EmployeesOnPathService } from '../services/employeesOnPath.service';
import { UpdateEmployeePresenceOnPathDTO } from '../dtos/employeesOnPath/updateEmployeePresenceOnPath.dto';
import { IdUpdateDTO } from '../dtos/employeesOnPath/idUpdateWebsocket';

@Controller('/api/routes/paths/employees')
@ApiTags('EmployeesOnPath')
export class EmployeesOnPathController {
  constructor(private readonly employeeOnPathService: EmployeesOnPathService) {}

  @Get('/:id')
  @Roles('list-employeeOnPath')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get a Employee On Path by id.',
    schema: {
      type: 'object',
      example: GetEmployeesOnPath,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getByRoute(@Param('id') id: string): Promise<MappedEmployeesOnPathDTO> {
    return await this.employeeOnPathService.listById(id);
  }

  @Get()
  @Roles('list-employeeOnPath')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get a Employee On Path by Route.',
    schema: {
      type: 'object',
      example: GetEmmployeesOnPathByRoute,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getManyByRoute(
    @Query('route') route: string,
  ): Promise<MappedEmployeesOnPathDTO[]> {
    return await this.employeeOnPathService.listManyByRoute(route);
  }

  @Put('/onboard')
  @Roles('edit-employeeOnPath')
  @ApiCreatedResponse({
    description: 'Update Confirmation a Employee On Path.',
    schema: {
      type: 'object',
      example: IdUpdateDTO,
    },
  })
  @HttpCode(HttpStatus.OK)
  async updateEmployeeConfirmation(
    @Body() payload: IdUpdateDTO,
  ): Promise<MappedEmployeesOnPathDTO> {
    return await this.employeeOnPathService.onboardEmployee(
      payload,
    );
  }

  @Put(':id')
  @Roles('edit-employeeOnPath')
  @ApiCreatedResponse({
    description: 'Update a Employee On Path by id.',
    schema: {
      type: 'object',
      example: UpdateEmployeesOnPathById,
    },
  })
  @HttpCode(HttpStatus.OK)
  async updateEmployeeConfirmationById(
    @Param('id') id: string,
    @Body() payload: UpdateEmployeesOnPathDTO,
  ): Promise<MappedEmployeesOnPathDTO> {
    return await this.employeeOnPathService.update(id, payload);
  }

  @Put('/confirm/:id')
  @Roles('edit-employeeOnPath')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Update Confirmation a Employee On Path by id.',
    schema: {
      type: 'object',
      example: UpdateConfirmationEmployeesOnPathById,
    },
  })
  async updateManyEmployeeConfirmation(
    @Param('id') id: string,
    @Body() payload: UpdateEmployeePresenceOnPathDTO,
  ): Promise<MappedEmployeesOnPathDTO> {
    return await this.employeeOnPathService.updateEmployeeParticipationOnPath(
      id,
      payload,
    );
  }
}
