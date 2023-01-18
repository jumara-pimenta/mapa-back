import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { Employee } from '../entities/employee.entity';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDTO } from '../dtos/employee/createEmployee.dto';
import { UpdateEmployeeDTO } from '../dtos/employee/updateEmployee.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateEmployee,
  DeleteEmployee,
  GetAllEmployee,
  GetEmployee,
  UpdateEmployee,
} from 'src/utils/examples.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/roles.decorator';
import { Express } from 'express';

@Controller('/api/employees')
@ApiTags('Employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.employeeService.parseExcelFile(file);
  }

  @ApiCreatedResponse({
    description: 'Creates a new Employee.',
    schema: {
      type: 'object',
      example: CreateEmployee,
    },
  })
  @Post()
  @Roles('create-employee')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateEmployeeDTO): Promise<Employee> {
    return await this.employeeService.create(payload);
  }

  @Delete('/:id')
  @ApiCreatedResponse({
    description: 'Delete a Employees.',
    schema: {
      type: 'object',
      example: DeleteEmployee,
    },
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.delete(id);
  }

  @Put('/:id')
  @ApiCreatedResponse({
    description: 'Update a Employee.',
    schema: {
      type: 'object',
      example: UpdateEmployee,
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateEmployeeDTO,
  ): Promise<Employee> {
    return await this.employeeService.update(id, data);
  }

  @Get()
  @ApiCreatedResponse({
    description: 'Get all Employees.',
    schema: {
      type: 'object',
      example: GetAllEmployee,
    },
  })
  @Roles('list-employee')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersEmployeeDTO,
  ): Promise<PageResponse<MappedEmployeeDTO>> {
    return await this.employeeService.listAll(page, filters);
  }

  @Get('/:id')
  @ApiCreatedResponse({
    description: 'Get a Employee by id.',
    schema: {
      type: 'object',
      example: GetEmployee,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.listById(id);
  }
}
