import { Injectable } from '@nestjs/common';
import { FiltersEmployeeDTO } from '../../dtos/employee/filtersEmployee.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { Employee } from '../../entities/employee.entity';
import IEmployeeRepository from './employee.repository.contract';
import { getDateInLocaleTime } from '../../utils/date.service';
import { generateQueryForEmployee } from '../../utils/QueriesEmployee';
import { ETypePath, ETypePin, ETypeRoute } from '../../utils/ETypes';
import { getDateStartToEndOfDay } from 'src/utils/Date';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeRepository
  extends Pageable<Employee>
  implements IEmployeeRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }

  delete(id: string): Promise<Employee> {
    return this.repository.employee.update({
      where: { id },
      data: {
        deletedAt: getDateInLocaleTime(new Date()),
      },
    });
  }

  update(data: Employee): Promise<any> {
    const dataAdmission = data.admission
      ? getDateInLocaleTime(new Date(data.admission))
      : undefined;
    return this.repository.employee.update({
      data: {
        id: data.id!,
        address: data.address!,
        admission: dataAdmission!,
        costCenter: data.costCenter!,
        name: data.name!,
        registration: data.registration!,
        role: data.role!,
        shift: data.shift!,
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
    return this.repository.employee.findFirst({
      where: {
        registration: registration,
        deletedAt: null,
      },
    });
  }

  findByRegistrationDeleted(registration: string): Promise<Employee> {
    return this.repository.employee.findFirst({
      where: {
        registration: registration,
        deletedAt: { not: null },
      },
    });
  }

  findByRegistrationByImport(registration: string): Promise<Employee> {
    return this.repository.employee.findFirst({
      where: {
        registration: registration,
        // deletedAt: null,
      },
    });
  }

  listAllEmployeesDeleted(ids: string[]): Promise<Employee[]> {
    return this.repository.employee.findMany({
      where: {
        deletedAt: { not: null },
        id: {
          in: ids,
        },
      },
    });
  }

  async checkExtraEmployee(ids: string[], date: string): Promise<Employee[]> {
    const data = date ? new Date(date) : getDateInLocaleTime(new Date());
    const { start, end } = getDateStartToEndOfDay(data.toISOString());
    return this.repository.employee.findMany({
      where: {
        deletedAt: null,
        id: {
          in: ids,
        },
        employeeOnPath: {
          some: {
            path: {
              deletedAt: null,
              type: ETypePath.RETURN,
              route: {
                deletedAt: null,
                type: ETypeRoute.EXTRA,
              },
              scheduleDate: {
                gte: start,
                lte: end,
              },
            },
          },
        },
      },
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
          where: {
            ...condition,
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
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
                    district: true,
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
          where: {
            deletedAt: null,
            pins: {
              some: {
                NOT: {
                  pinId: process.env.DENSO_ID,
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
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
                    district: true,
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
            deletedAt: null,
          },
        })
      : await this.repository.employee.count({
          where: {
            deletedAt: null,
          },
        });

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  async findAllExport(): Promise<Employee[]> {
    const items = await this.repository.employee.findMany({
      where: { deletedAt: null },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        pins: {
          select: {
            type: true,
            pin: {
              select: {
                details: true,
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

    return items;
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
        firstAccess: true,
        role: data.role,
        shift: data.shift,
        createdAt: data.createdAt,
        pins: data.pin
          ? {
              connectOrCreate: {
                create: {
                  type: ETypePin.CONVENTIONAL,
                  pinId: data.pin.id,
                },
                where: {
                  employeeId_pinId: {
                    pinId: data.pin.id,
                    employeeId: data.id,
                  },
                },
              },
            }
          : undefined,
      },
      include: {
        pins: true,
      },
    });
  }

  findByIds(ids: string[]): Promise<any> {
    return this.repository.employee.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
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

  async findJokerPin(ids: string[]): Promise<Partial<Employee>[]> {
    return await this.repository.employee.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
        pins: {
          some: {
            pinId: process.env.DENSO_ID,
          },
        },
      },
      select: {
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  updateEmployeePassword(registration: string, password: string): Promise<Employee>{
    return  this.repository.employee.update({
      where: {
        registration: registration
      },
      data: {
        password: password,
        firstAccess: false,
        updatedAt: new Date()
      }
    })
  }

  async resetEmployeePassword(registration: string): Promise<Employee>{
    return  this.repository.employee.update({
      where: {
        registration: registration
      },
      data: {
        password: await bcrypt.hash(registration, 10),
        firstAccess: true,
        updatedAt: new Date()
      }
    })
  }
}
