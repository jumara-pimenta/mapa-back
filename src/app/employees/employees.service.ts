import { BadGatewayException, Injectable } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';
import { PrismaCodeError, PrismaMessageError } from 'src/constants/exceptions';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEmployee: Prisma.EmployeeCreateInput): Promise<Employee> {
    try {
      const employee = await this.prismaService.employee.create({
        data: createEmployee,
      });
      return employee;
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
}
