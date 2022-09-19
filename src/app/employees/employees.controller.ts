import { Controller, Post, Body, Get } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';
import { EmployeeData } from './dto/type';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post()
  async create(@Body() createEmployee: EmployeeData) {
   
    return await this.employeesService.create(createEmployee);
  }
  @Get()
  async findAll() {
    return await this.employeesService.findAll();
  }
}
