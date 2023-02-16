import { Injectable } from '@nestjs/common';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { Path } from '../../entities/path.entity';
import IPathRepository from './path.repository.contract';
import { getDateInLocaleTime } from '../../utils/date.service';
import { EStatusPath } from '../../utils/ETypes';

@Injectable()
export class PathRepository extends Pageable<Path> implements IPathRepository {
  constructor(private readonly repository: PrismaService) {
    super();
  }

  findByDriverIdAndStatus(
    driverId: string,
    status: EStatusPath,
  ): Promise<Path> {
    return this.repository.path.findFirst({
      where: {
        status,
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
        updatedAt: getDateInLocaleTime(new Date()),
      },
      where: { id: data.id },
    });
  }

  findById(id: string): Promise<Path | null> {
    return this.repository.path.findFirst({
      where: { id: id },
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
        },
      },
    });
  }

  findByDriver(driverId: string): Promise<Path[]> {
    return this.repository.path.findMany({
      where: {
        route: {
          driver: {
            id: driverId,
          },
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
  findByEmployee(employeeId: string): Promise<Path[]> {
    return this.repository.path.findMany({
      where: {
        finishedAt: null,
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
    });
  }

  findByRoute(routeId: string): Promise<Path[]> {
    return this.repository.path.findMany({
      where: {
        route: {
          id: routeId,
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
    console.log(data)
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
      },
    });
  }

  async findByEmployeeOnPath(employeeOnPathId: string): Promise<Partial<Path>> {
    return await this.repository.path.findFirst({
      where: {
        employeesOnPath: {
          some: {
            id: employeeOnPathId,
          },
        },
        route: {
          deletedAt: null,
        },
      },
      select: {
        id: true,
      },
    });
  }

  async findAll(filter?: any): Promise<Path[]> {
    return await this.repository.path.findMany({
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
}
