import { Injectable } from '@nestjs/common';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { Path } from '../../entities/path.entity';
import IPathRepository from './path.repository.contract';
import { ERoutePathStatus, EStatusPath } from '../../utils/ETypes';
import { generateQueryByFiltersForPaths } from '../../configs/database/Queries';
import { getDateInLocaleTimeManaus } from '../../utils/Date';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class PathRepository extends Pageable<Path> implements IPathRepository {
  constructor(private readonly repository: PrismaService) {
    super();
  }

  findByStatusAndDriver(
    status: EStatusPath,
    driverId: string,
  ): Promise<Path[]> {
    return this.repository.path.findMany({
      where: {
        deletedAt: null,
        status,
        route: {
          driverId,
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        route: {
          select: {
            description: true,
          },
        },
        employeesOnPath: {
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
    });
  }

  findManyPathsNotStartedByEmployee(employeeId: string): Promise<Path[]> {
    return this.repository.path.findMany({
      where: {
        deletedAt: null,
        status: EStatusPath.PENDING,
        employeesOnPath: {
          some: {
            employeeId,
          },
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        route: {
          select: {
            description: true,
            type: true,
          },
        },
        employeesOnPath: {
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
    });
  }

  findByDriverIdAndStatus(
    driverId: string,
    status: EStatusPath,
  ): Promise<Path> {
    return this.repository.path.findFirst({
      where: {
        status,
        deletedAt: null,
        route: {
          driver: {
            id: driverId,
          },
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        route: {
          select: {
            description: true,
          },
        },
        employeesOnPath: {
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
    });
  }

  findByEmployeeAndStatus(
    employeeId: string,
    status: EStatusPath,
  ): Promise<Path> {
    return this.repository.path.findFirst({
      where: {
        deletedAt: null,
        status,
        employeesOnPath: {
          some: {
            employeeId,
          },
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        route: {
          select: {
            description: true,
          },
        },
        employeesOnPath: {
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
    });
  }

  delete(id: string): Promise<Path> {
    return this.repository.path.delete({
      where: { id },
    });
  }

  update(data: Path): Promise<Path> {
    return this.repository.path.update({
      data: {
        id: data.id,
        duration: data.duration,
        finishedAt: data.finishedAt,
        startedAt: data.startedAt,
        startsAt: data.startsAt,
        status: data.status,
        type: data.type,
        substituteId: data.substituteId,
        updatedAt: getDateInLocaleTimeManaus(new Date()),
      },
      where: { id: data.id },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        substituteId: true,
        route: {
          select: {
            id: true,
            description: true,
            vehicle: true,
            driver: true,
          },
        },
        employeesOnPath: {
          select: {
            employeeId: true,
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            present: true,
            position: true,
            description: true,
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
                        details: true,
                        id: true,
                        lat: true,
                        lng: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  findById(id: string): Promise<Path | null> {
    return this.repository.path.findFirst({
      where: {
        id: id,
        deletedAt: null,
        route: {
          deletedAt: null,
          path: {
            some: {
              deletedAt: null,
            },
          },
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        scheduleDate: true,
        createdAt: true,
        substituteId: true,
        route: {
          select: {
            id: true,
            description: true,
            vehicle: true,
            driver: true,
          },
        },
        employeesOnPath: {
          where: {
            employee: {
              deletedAt: null,
            },
          },
          select: {
            employeeId: true,
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            present: true,
            position: true,
            description: true,
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
                        details: true,
                        id: true,
                        lat: true,
                        lng: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  findByEmployeeOnPathMobile(id: string): Promise<Path | null> {
    return this.repository.path.findFirst({
      where: {
        employeesOnPath: {
          some: {
            id,
          },
        },
        deletedAt: null,
        route: {
          deletedAt: null,
          path: {
            some: {
              deletedAt: null,
            },
          },
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        substituteId: true,
        route: {
          select: {
            id: true,
            description: true,
            vehicle: true,
            driver: true,
          },
        },
        employeesOnPath: {
          where: {
            employee: {
              deletedAt: null,
            },
          },
          select: {
            employeeId: true,
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            present: true,
            position: true,
            description: true,
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
                        details: true,
                        id: true,
                        lat: true,
                        lng: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  findByIdToDelete(id: string): Promise<Path | null> {
    return this.repository.path.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        substituteId: true,
        scheduleDate: true,
        route: {
          select: {
            id: true,
            description: true,
            vehicle: true,
            driver: true,
          },
        },
        employeesOnPath: {
          where: {
            employee: {
              deletedAt: null,
            },
          },
          select: {
            employeeId: true,
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            present: true,
            position: true,
            description: true,
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
                        details: true,
                        id: true,
                        lat: true,
                        lng: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  findByDriver(driverId: string): Promise<Path[]> {
    return this.repository.path.findMany({
      where: {
        // find by driver id in route or substitute in path
        deletedAt: null,
        OR: [
          {
            route: {
              driver: {
                id: driverId,
              },
              deletedAt: null,
            },
            substituteId: {
              equals: null,
            },
          },
          {
            substituteId: driverId,
          },
        ],
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        scheduleDate: true,
        createdAt: true,
        route: {
          select: {
            type: true,
            description: true,
          },
        },
        employeesOnPath: {
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
      orderBy: {
        status: 'asc',
      },
    });
  }

  findByEmployee(employeeId: string): Promise<Path[]> {
    return this.repository.path.findMany({
      where: {
        deletedAt: null,
        employeesOnPath: {
          some: {
            employeeId: employeeId,
          },
        },
        route: {
          deletedAt: null,
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        route: {
          select: {
            type: true,
            description: true,
          },
        },
        employeesOnPath: {
          select: {
            id: true,
            employeeId: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
      orderBy: {
        status: 'asc',
      },
    });
  }

  findByRoute(routeId: string): Promise<Path[]> {
    return this.repository.path.findMany({
      where: {
        route: {
          id: routeId,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        route: {
          select: {
            type: true,
            description: true,
          },
        },
        employeesOnPath: {
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
    });
  }

  create(data: Path): Promise<Path> {
    return this.repository.path.create({
      data: {
        id: data.id,
        duration: data.duration,
        finishedAt: data.finishedAt,
        startedAt: data.startedAt,
        startsAt: data.startsAt,
        status: data.status,
        type: data.type,
        routeId: data.route.id,
        scheduleDate: data.scheduleDate,
      },
    });
  }

  async findByEmployeeOnPath(employeeOnPathId: string): Promise<Partial<Path>> {
    return await this.repository.path.findFirst({
      where: {
        deletedAt: null,
        employeesOnPath: {
          some: {
            id: employeeOnPathId,
          },
        },
        route: {
          deletedAt: null,
        },
      },
    });
  }

  async findManyByStatus(status: ERoutePathStatus): Promise<Path[]> {
    return await this.repository.path.findMany({
      where: {
        deletedAt: null,
        status,
        AND: {
          route: {
            deletedAt: null,
          },
          OR: [
            {
              employeesOnPath: {
                some: {
                  present: true,
                },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        route: {
          select: {
            type: true,
            id: true,
            description: true,
            driver: {
              select: {
                id: true,
                name: true,
                cpf: true,
                cnh: true,
                createdAt: true,
                validation: true,
                updatedAt: false,
                category: true,
                deletedAt: false,
                password: false,
                RouteHistory: false,
              },
            },
            vehicle: {
              select: {
                plate: true,
                id: true,
                capacity: true,
                company: true,
                createdAt: true,
                expiration: true,
                updatedAt: false,
                isAccessibility: true,
                lastMaintenance: true,
                lastSurvey: true,
                note: true,
                renavam: true,
                RouteHistory: false,
                routes: false,
                type: true,
              },
            },
          },
        },

        employeesOnPath: {
          where: {
            employee: {
              deletedAt: null,
            },
          },
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
      orderBy: {
        status: 'asc',
      },
    });
  }

  async findAll(filter?: any): Promise<Path[]> {
    const condition = generateQueryByFiltersForPaths(filter);
    return await this.repository.path.findMany({
      where: {
        deletedAt: null,
        ...filter,
        ...condition,
        AND: {
          route: {
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        scheduleDate: true,
        createdAt: true,
        route: {
          select: {
            type: true,
            id: true,
            description: true,
            driver: {
              select: {
                id: true,
                name: true,
                cpf: true,
                cnh: true,
                createdAt: true,
                validation: true,
                updatedAt: false,
                category: true,
                deletedAt: false,
                password: false,
                RouteHistory: false,
              },
            },
            vehicle: {
              select: {
                plate: true,
                id: true,
                capacity: true,
                company: true,
                createdAt: true,
                expiration: true,
                updatedAt: false,
                isAccessibility: true,
                lastMaintenance: true,
                lastSurvey: true,
                note: true,
                renavam: true,
                RouteHistory: false,
                routes: false,
                type: true,
              },
            },
          },
        },

        employeesOnPath: {
          where: {
            employee: {
              deletedAt: null,
            },
          },
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
      orderBy: {
        status: 'asc',
      },
    });
  }

  async findAllToday(filter?: any): Promise<Path[]> {
    const condition = generateQueryByFiltersForPaths(filter);

    const startOfToday = startOfDay(new Date());

  // Obtém a data de fim do dia atual
    const endOfToday = endOfDay(new Date());

    return await this.repository.path.findMany({
      where: {
        deletedAt: null,
        scheduleDate: {
          gte: startOfToday,
          lte: endOfToday
        },
        ...filter,
        ...condition,
        AND: {
          route: {
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        scheduleDate: true,
        createdAt: true,
        route: {
          select: {
            type: true,
            id: true,
            description: true,
            driver: {
              select: {
                id: true,
                name: true,
                cpf: true,
                cnh: true,
                createdAt: true,
                validation: true,
                updatedAt: false,
                category: true,
                deletedAt: false,
                password: false,
                RouteHistory: false,
              },
            },
            vehicle: {
              select: {
                plate: true,
                id: true,
                capacity: true,
                company: true,
                createdAt: true,
                expiration: true,
                updatedAt: false,
                isAccessibility: true,
                lastMaintenance: true,
                lastSurvey: true,
                note: true,
                renavam: true,
                RouteHistory: false,
                routes: false,
                type: true,
              },
            },
          },
        },

        employeesOnPath: {
          where: {
            employee: {
              deletedAt: null,
            },
          },
          select: {
            id: true,
            boardingAt: true,
            confirmation: true,
            disembarkAt: true,
            position: true,
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
        },
      },
      orderBy: {
        status: 'asc',
      },
    });
  }

  async softDelete(id: string): Promise<Path> {
    return await this.repository.path.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
