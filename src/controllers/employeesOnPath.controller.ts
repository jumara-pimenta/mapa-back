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
import { UpdateEmployeesOnPathDTO } from 'src/dtos/employeesOnPath/updateEmployeesOnPath.dto';
import { UpdateEmployeesStatusOnPathDTO } from 'src/dtos/employeesOnPath/updateEmployeesStatusOnPath.dto';
import {
  GetEmmployeesOnPathByRoute,
  GetEmployeesOnPath,
  UpdateConfirmationEmployeesOnPath,
  UpdateConfirmationEmployeesOnPathById,
  UpdateEmployeeOffBoard,
  UpdateEmployeeOnBoard,
  UpdateEmployeeOnPathNotComming,
  UpdateEmployeesOnPathById,
} from 'src/utils/examples.swagger';
import { MappedEmployeesOnPathDTO } from '../dtos/employeesOnPath/mappedEmployeesOnPath.dto';
import { EmployeesOnPathService } from '../services/employeesOnPath.service';

@Controller('/api/routes/paths/employees')
@ApiTags('EmployeesOnPath')
export class EmployeesOnPathController {
  constructor(private readonly employeeOnPathService: EmployeesOnPathService) {}

  @Get('/:id')
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

  @Put()
  @ApiCreatedResponse({
    description: 'Update Confirmation a Employee On Path.',
    schema: {
      type: 'object',
      example: UpdateConfirmationEmployeesOnPath,
    },
  })
  @HttpCode(HttpStatus.OK)
  async updateEmployeeConfirmation(
    @Body() payload: UpdateEmployeesStatusOnPathDTO,
  ): Promise<MappedEmployeesOnPathDTO[]> {
    return await this.employeeOnPathService.updateStatus(payload);
  }

  @Put(':id')
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
    @Body() payload: UpdateEmployeesOnPathDTO,
  ): Promise<MappedEmployeesOnPathDTO> {
    return await this.employeeOnPathService.update(id, payload);
  }

  @Put('/onboard/:id')
  @ApiCreatedResponse({
    description: 'Update Onboard a Employee On Path by id.',
    schema: {
      type: 'object',
      example: UpdateEmployeeOnBoard,
    },
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async onboard(@Param('id') id: string): Promise<any> {
    return await this.employeeOnPathService.onboardEmployee(id);
  }

  @Put('/offboard/:id')
  @ApiCreatedResponse({
    description: 'Update Offboard a Employee On Path by id.',
    schema: {
      type: 'object',
      example: UpdateEmployeeOffBoard,
    },
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async offboard(@Param('id') id: string): Promise<any> {
    return await this.employeeOnPathService.offboardEmployee(id);
  }

  @Put('/notComming/:id')
  @ApiCreatedResponse({
    description: 'Update Not Comming a Employee On Path by id.',
    schema: {
      type: 'object',
      example: UpdateEmployeeOnPathNotComming,
    },
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async notComming(@Param('id') id: string): Promise<any> {
    return await this.employeeOnPathService.employeeNotConfirmed(id);
  }
}
