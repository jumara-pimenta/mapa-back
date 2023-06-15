import { Injectable } from '@nestjs/common';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import IEmployeesOnPathRepository from './employeesOnPath.repository.contract';
import { getDateInLocaleTime } from '../../utils/date.service';
import { EmployeesOnPath } from '../../entities/employeesOnPath.entity';
import { Page, PageResponse } from '../../configs/database/page.model';
import { generateQueryByFiltersForEmployeesOnPath } from '../../configs/database/Queries';

@Injectable()
export class EmployeesOnPathRepository
  extends Pageable<EmployeesOnPath>
  implements IEmployeesOnPathRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }
  updatePosition(id: string, newPosition: number): Promise<EmployeesOnPath> {
    return this.repository.employeesOnPath.update({
      where: { id },
      data: {
        position: newPosition
      }
    });
  }

  findManyByEmployeeAndPath(employeeId: string, pathId: string): Promise<EmployeesOnPath[]> {
    return this.repository.employeesOnPath.findMany({
      where: { pathId, employeeId },
      select: {
        id: true,
        description: true,
        boardingAt: true,
        confirmation: true,
        disembarkAt: true,
        position: true,
        createdAt: true,
        present: true,
        employee: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        position: 'asc'
      }
    });
  }

  create(data: EmployeesOnPath): Promise<EmployeesOnPath> {
    return this.repository.employeesOnPath.create({
      data: {
        id: data.id,
        position: data.position,
        boardingAt: data.boardingAt,
        confirmation: data.confirmation,
        disembarkAt: data.disembarkAt,
        employeeId: data.employee.id,
        pathId: data.path.id,
      },
    });
  }

  delete(id: string): Promise<EmployeesOnPath> {
    return this.repository.employeesOnPath.delete({
      where: { id },
    });
  }

  findById(id: string): Promise<EmployeesOnPath> {
    return this.repository.employeesOnPath.findUnique({
      where: { id },
      select: {
        id: true,
        description: true,
        boardingAt: true,
        confirmation: true,
        disembarkAt: true,
        position: true,
        createdAt: true,
        present: true,
        employee: {
          select: {
            name: true,
            address: true,
            shift: true,
            registration: true,
            pins: {
              select: {
                type: true,
                pin: {
                  select: {
                    lat: true,
                    lng: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findByIds(id: string): Promise<EmployeesOnPath[]> {
    return this.repository.employeesOnPath.findMany({
      where: { employeeId: id },

      select: {
        id: true,
        confirmation: true,
        position: true,
        createdAt: true,
        present: true,
        employee: {
          select: {
            name: true,
            address: true,
            shift: true,
            registration: true,
            pins: {
              select: {
                type: true,
                pin: {
                  select: {
                    lat: true,
                    lng: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findByPath(pathId: string): Promise<EmployeesOnPath[]> {
    return this.repository.employeesOnPath.findMany({
      where: {
        pathId,
      },
      orderBy: {
        position: 'asc',
      },
      select: {
        id: true,
        boardingAt: true,
        confirmation: true,
        disembarkAt: true,
        position: true,
        createdAt: true,
        present: true,
        employee: {
          select: {
            id: true,
            name: true,
            address: true,
            shift: true,
            registration: true,
            pins: {
              select: {
                type: true,
                pin: {
                  select: {
                    lat: true,
                    lng: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findByRoute(routeId: string): Promise<EmployeesOnPath> {
    return this.repository.employeesOnPath.findFirst({
      where: {
        path: {
          routeId,
        },
      },
    });
  }

  findManyByRoute(routeId: string): Promise<EmployeesOnPath[]> {
    return this.repository.employeesOnPath.findMany({
      where: {
        path: {
          routeId,
        },
      },
      select: {
        id: true,
        boardingAt: true,
        confirmation: true,
        disembarkAt: true,
        position: true,
        createdAt: true,
        present: true,
        employee: {
          select: {
            name: true,
            address: true,
            shift: true,
            registration: true,
            pins: {
              select: {
                type: true,
                pin: {
                  select: {
                    lat: true,
                    lng: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findAll(
    page: Page,
    filters?: any,
  ): Promise<PageResponse<EmployeesOnPath>> {
    const condition = generateQueryByFiltersForEmployeesOnPath(filters);

    const items = condition
      ? await this.repository.employeesOnPath.findMany({
          ...this.buildPage(page),
          where: condition,
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
            createdAt: true,
            present: true,
            employee: {
              select: {
                name: true,
                address: true,
                shift: true,
                registration: true,
                pins: {
                  select: {
                    type: true,
                    pin: {
                      select: {
                        lat: true,
                        lng: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
      : await this.repository.employeesOnPath.findMany({
          ...this.buildPage(page),
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
            createdAt: true,
            present: true,
            employee: {
              select: {
                name: true,
                address: true,
                shift: true,
                registration: true,
                pins: {
                  select: {
                    type: true,
                    pin: {
                      select: {
                        lat: true,
                        lng: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

    const total = condition
      ? await this.repository.employeesOnPath.findMany({
          where: {
            ...condition,
          },
        })
      : await this.repository.employeesOnPath.count();

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  update(data: EmployeesOnPath): Promise<EmployeesOnPath> {
    return this.repository.employeesOnPath.update({
      data: {
        id: data.id,
        position: data.position,
        confirmation: data.confirmation,
        description: data.description,
        present: data.present,
        disembarkAt: getDateInLocaleTime(data.disembarkAt),
        boardingAt: getDateInLocaleTime(data.boardingAt),
        updatedAt: getDateInLocaleTime(new Date()),
      },
      where: { id: data.id },
      include: {
        employee: {
          include: {
            pins: {
              include: {
                pin: true,
              },
            },
          },
        },
      },
    });
  }

  findByPathAndPin(
    pathId: string,
    pinId: string,
  ): Promise<Partial<EmployeesOnPath[]>> {
    return this.repository.employeesOnPath.findMany({
      where: {
        pathId,
        employee: {
          pins: {
            some: {
              pinId,
            },
          },
        },
      },
      select: {
        id: true,
        position: true,
        createdAt: true,
        boardingAt: true,
        disembarkAt: true,
        confirmation: true,
        description: true,
        present: true,
        employee: {
          select: {
            id: true,
            name: true,
            registration: true,
            pins: true,
          },
        },
      },
    });
  }

  updateMany(
    data: EmployeesOnPath[],
    confirmation: boolean,
  ): Promise<EmployeesOnPath[]> {
    const promises = data.map((item) =>
      this.repository.employeesOnPath.update({
        data: {
          confirmation: confirmation,
          description: null,
          present: null,
          disembarkAt: null,
          boardingAt: null,
          updatedAt: null,
        },
        where: { id: item.id },
      }),
    );
    return Promise.all(promises);
  }
}
