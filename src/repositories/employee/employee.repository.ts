import { Injectable } from '@nestjs/common';
import { FiltersEmployeeDTO } from '../../dtos/employee/filtersEmployee.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { Employee } from '../../entities/employee.entity';
import IEmployeeRepository from './employee.repository.contract';
import { getDateInLocaleTime } from '../../utils/date.service';
import { generateQueryForEmployee } from 'src/utils/QueriesEmployeer';

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
        admission: getDateInLocaleTime(new Date(data.admission)),
        costCenter: data.costCenter,
        cpf: data.cpf,
        name: data.name,
        registration: data.registration,
        rg: data.rg,
        role: data.role,
        shift: data.shift,
      },
      where: { id: data.id },
    });
  }

  findById(id: string): Promise<Employee> {
    return this.repository.employee.findUnique({
      where: { id },
      include: {
        pins: true,
      }
    });
  }

  findByCpf(cpf: string): Promise<Employee> {
    return this.repository.employee.findUnique({
      where: { cpf },
    });
  }

  findByRegistration(registration: string): Promise<Employee> {
    return this.repository.employee.findUnique({
      where: { registration },
    });
  }

  findByRg(rg: string): Promise<Employee> {
    return this.repository.employee.findUnique({
      where: { rg },
    });
  }

  async findAll(
    page: Page,
    filters: FiltersEmployeeDTO,
  ): Promise<PageResponse<Employee>> {
    const condition = generateQueryForEmployee(filters);

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
        admission: data.admission,
        costCenter: data.costCenter,
        cpf: data.cpf,
        name: data.name,
        registration: data.registration,
        rg: data.rg,
        role: data.role,
        shift: data.shift,
        createdAt: data.createdAt,
      },
    });
  }

  findByIds(ids: string[]): Promise<any> {
    return this.repository.employee.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true,
        name: true,
        pins: {
          select: {
            type: true,
            pin: true,
          },
        },
      },
    });
  }


}
