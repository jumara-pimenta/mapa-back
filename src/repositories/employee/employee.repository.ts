import { Injectable } from '@nestjs/common';
import { FiltersEmployeeDTO } from '../../dtos/employee/filtersEmployee.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { Employee } from '../../entities/employee.entity';
import IEmployeeRepository from './employee.repository.contract';
import { getDateInLocaleTime } from '../../utils/date.service';
import { generateQueryByFiltersForEmployee } from '../../configs/database/Queries';

@Injectable()
export class EmployeeRepository
  extends Pageable<Employee>
  implements IEmployeeRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }

  delete(id: string): Promise<Employee> {
    return this.repository.employee.delete({
      where: { id },
    });
  }

  update(data: Employee): Promise<any> {
    return this.repository.employee.update({
      data: {
        id: data.id,
        address: data.address,
        // admission: data.admission,
        admission: getDateInLocaleTime(new Date(data.admission)),

        costCenter: data.costCenter,
        cpf: data.cpf,
        name: data.name,
        registration: data.registration,
        rg: data.rg,
        role: data.role,
        shift: data.shift,
        createdAt: getDateInLocaleTime(new Date()),
        updatedAt: getDateInLocaleTime(new Date()),
      },
      where: { id: data.id },
    });
  }

  findById(id: string): Promise<Employee> {
    return this.repository.employee.findUnique({
      where: { id },
    });
  }

  async findAll(
    page: Page,
    filters: FiltersEmployeeDTO,
  ): Promise<PageResponse<Employee>> {
    const condition = generateQueryByFiltersForEmployee(filters);

    const items = condition
      ? await this.repository.employee.findMany({
          ...this.buildPage(page),
          where: condition,
        })
      : await this.repository.employee.findMany({
          ...this.buildPage(page),
        });

    const total = condition
      ? await this.repository.employee.findMany({
          where: {
            ...condition,
          },
        })
      : await this.repository.employee.count();

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  create(data: Employee): Promise<Employee> {
    return this.repository.employee.create({
      data: {
        id: data.id,
        address: data.address,
        // admission: data.admission,
        admission: getDateInLocaleTime(new Date(data.admission)),
        costCenter: data.costCenter,
        cpf: data.cpf,
        name: data.name,
        registration: data.registration,
        rg: data.rg,
        role: data.role,
        shift: data.shift,
      },
    });
  }

  // create(data: Employee): Promise<Employee> {
  //   return this.repository.employee.create({
  //     data: {
  //       id: data.id,
  //       address: data.address,
  //       // admission: data.admission,
  //       admission: getDateInLocaleTime(new Date(data.admission)),

  //       costCenter: data.costCenter,
  //       cpf: data.cpf,
  //       name: data.name,
  //       registration: data.registration,
  //       rg: data.rg,
  //       role: data.role,
  //       shift: data.shift,
  //     },
  //   });
  // }
}