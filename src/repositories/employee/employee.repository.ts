import { Injectable } from '@nestjs/common';
import { FiltersEmployeeDTO } from '../../dtos/employee/filtersEmployee.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { Employee } from '../../entities/employee.entity';
import IEmployeeRepository from './employee.repository.contract';
import { getDateInLocaleTime } from '../../utils/date.service';
import { generateQueryForEmployee } from '../../utils/QueriesEmployee';
import { ETypeCreationPin } from 'src/utils/ETypes';

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
        name: data.name,
        registration: data.registration,
        role: data.role,
        shift: data.shift,
        updatedAt: getDateInLocaleTime(new Date()),
      },
      where: { id: data.id },
      include: {
        pins: {
          select: {
            type: true,
            pin: {
              select: {
                id: true,
                details: true,
                lat: true,
                lng: true,
                local: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  findById(id: string): Promise<Employee> {
    return this.repository.employee.findUnique({
      where: { id },
      include: {
        pins: {
          select: {
            type: true,
            pin: {
              select: {
                id: true,
                details: true,
                lat: true,
                lng: true,
                local: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  findByRegistration(registration: string): Promise<Employee> {
    return this.repository.employee.findUnique({
      where: { registration },
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
          include: {
            pins: {
              select: {
                type: true,
                pin: {
                  select: {
                    id: true,
                    details: true,
                    lat: true,
                    lng: true,
                    local: true,
                    title: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        })
      : await this.repository.employee.findMany({
          ...this.buildPage(page),
          include: {
            pins: {
              select: {
                type: true,
                pin: {
                  select: {
                    id: true,
                    details: true,
                    lat: true,
                    lng: true,
                    local: true,
                    title: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
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
        name: data.name,
        registration: data.registration,
        password: data.password,
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
          in: ids,
        },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
