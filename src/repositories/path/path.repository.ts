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

  findByDriverIdAndStatus(driverId: string, status: EStatusPath): Promise<Path> {
    return this.repository.path.findFirst({
      where: {
        status,
        route: {
          driver: {
            id: driverId,
          }
        }
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
                        long: true,
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

  findById(id: string): Promise<Path> {
    return this.repository.path.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        duration: true,
        status: true,
        startsAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
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
                        long: true,
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
            id: driverId
          }
        }
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
                        long: true,
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
          id: routeId
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
                        long: true,
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
      },
    });
  }
}
