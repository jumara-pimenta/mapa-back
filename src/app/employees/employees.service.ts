import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { Address, Employee, Prisma } from '@prisma/client';
import { AppMessageError, PrismaCodeError, PrismaMessageError } from 'src/constants/exceptions';
import { PrismaService } from 'src/database/prisma.service';
import { domainToASCII } from 'url';
import { AddressesService } from '../addresses/addresses.service';
import { createEmployeeRelation } from './createRelationService';
import { EmployeeData } from '../dtos/employee/createEmployeeRelation.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createEmployee: EmployeeData): Promise<Employee> {
    try {
      const employ = await createEmployeeRelation(createEmployee,this.prismaService)
     return employ
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaCodeError.UNIQUE_CONSTRAINT
      ) {
        throw new BadGatewayException(
          PrismaMessageError.UNIQUE_CONSTRAINT_VIOLATION,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Employee[]> {
    const employee = await this.prismaService.employee.findMany();

    if (employee.length === 0) {
      throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
    }

    return employee;
  }


  async findMany(id : string): Promise<Address[]> {
    const addresses = await this.prismaService.address.findMany({where: {employeeId  :id}})
    if (addresses.length === 0) {
      throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
    }
    return addresses
  }
  
}
