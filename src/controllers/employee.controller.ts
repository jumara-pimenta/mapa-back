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
} from '@nestjs/common';
import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { Employee } from '../entities/employee.entity';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDTO } from '../dtos/employee/createEmployee.dto';
import { UpdateEmployeeDTO } from '../dtos/employee/updateEmployee.dto';
import {
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('/api/employees')
@ApiTags('Employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiCreatedResponse({
    description: 'Creates a new Employee.',
    schema: {
      type: 'object',
      example: {
        id: '2fce27dd-e7c4-496f-be0e-3aac0db2f82d',
        registration: '123456789',
        name: 'Marcus Vinicius',
        admission: '2023-01-02T14:27:56.507Z',
        role: 'Auxiliar de produção',
        shift: '1º Turno',
        costCenter: 'Almoxarife',
        address: 'Av. Paulista, 1000',
        createdAt: '2023-01-02T10:28:31.580Z',
        updatedAt: null,
      },      
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateEmployeeDTO): Promise<Employee> {
    return await this.employeeService.create(payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.delete(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateEmployeeDTO,
  ): Promise<Employee> {
    return await this.employeeService.update(id, data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersEmployeeDTO,
  ): Promise<PageResponse<MappedEmployeeDTO>> {
    return await this.employeeService.listAll(page, filters);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.listById(id);
  }
}
