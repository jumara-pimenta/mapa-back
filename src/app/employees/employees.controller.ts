import { Controller, Post, Body } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(@Body() createEmployee: Prisma.EmployeeCreateInput) {
    return await this.employeesService.create(createEmployee);
  }
}
