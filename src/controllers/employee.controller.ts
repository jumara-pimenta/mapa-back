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
  Query
} from "@nestjs/common";
import { FiltersEmployeeDTO } from "../dtos/employee/filtersEmployee.dto";
import { MappedEmployeeDTO } from "../dtos/employee/mappedEmployee.dto";
import { Page, PageResponse } from "../configs/database/page.model";
import { Employee } from "../entities/employee.entity";
import { EmployeeService } from "../services/employee.service";
import { CreateEmployeeDTO } from "../dtos/employee/createEmployee.dto";
import { UpdateEmployeeDTO } from "../dtos/employee/updateEmployee.dto";

@Controller("/api/employees")
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService
  ) { }

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
  async update(@Param('id') id: string, @Body() data: UpdateEmployeeDTO): Promise<Employee> {
    return await this.employeeService.update(id, data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() page: Page, @Query() filters: FiltersEmployeeDTO): Promise<PageResponse<MappedEmployeeDTO>> {
    return await this.employeeService.listAll(page, filters);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.listById(id);
  }
}
