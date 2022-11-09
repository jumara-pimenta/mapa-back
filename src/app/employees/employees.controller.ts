import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';
import { EmployeeData } from '../dtos/employee/createEmployeeRelation.dto';
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

  @Get(':id')
  async findAllAddresses(@Param('id') id : string){
    console.log(id)
    return await this.employeesService.findMany(id);
  }
}
