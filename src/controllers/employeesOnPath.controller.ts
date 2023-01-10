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
import { ApiTags } from '@nestjs/swagger';
import { UpdateEmployeesOnPathDTO } from 'src/dtos/employeesOnPath/updateEmployeesOnPath.dto';
import { UpdateEmployeesStatusOnPathDTO } from 'src/dtos/employeesOnPath/updateEmployeesStatusOnPath.dto';
import { MappedEmployeesOnPathDTO } from '../dtos/employeesOnPath/mappedEmployeesOnPath.dto';
import { EmployeesOnPathService } from '../services/employeesOnPath.service';

@Controller('/api/routes/paths/employees')
@ApiTags('EmployeesOnPath')
export class EmployeesOnPathController {
  constructor(private readonly employeeOnPathService: EmployeesOnPathService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getByRoute(@Param('id') id: string): Promise<MappedEmployeesOnPathDTO> {
    return await this.employeeOnPathService.listById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getManyByRoute(
    @Query('route') route: string,
  ): Promise<MappedEmployeesOnPathDTO[]> {
    return await this.employeeOnPathService.listManyByRoute(route);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateEmployeeConfirmation(
    @Body() payload: UpdateEmployeesStatusOnPathDTO,
  ): Promise<MappedEmployeesOnPathDTO[]> {
    return await this.employeeOnPathService.updateStatus(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateEmployeeConfirmationById(
    @Param('id') id: string,
    @Body() payload: UpdateEmployeesOnPathDTO,
  ): Promise<MappedEmployeesOnPathDTO> {
    return await this.employeeOnPathService.update(id, payload);
  }

  @Put('/confirm/:id')
  @HttpCode(HttpStatus.OK)
  async updateManyEmployeeConfirmation(
    @Param('id') id: string,
    @Body() payload: UpdateEmployeesOnPathDTO,
  ): Promise<MappedEmployeesOnPathDTO> {
    return await this.employeeOnPathService.update(id, payload);
  }



  @Put('/onboard/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async onboard(@Param('id') id: string): Promise<any> {
    return await this.employeeOnPathService.onboardEmployee(id);
  }

  @Put('/offboard/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async offboard(@Param('id') id: string): Promise<any> {
    return await this.employeeOnPathService.offboardEmployee(id);
  }

  @Put('/notComming/:id')
  @HttpCode(HttpStatus.ACCEPTED)  
  async notComming(@Param('id') id: string): Promise<any> {
    return await this.employeeOnPathService.employeeNotConfirmed(id);
  }
}
