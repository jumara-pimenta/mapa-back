
import { Injectable } from '@nestjs/common';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import IRouteRepository from './route.repository.contract';
import { getDateInLocaleTime } from '../../utils/date.service';
import { FiltersRouteDTO } from '../../dtos/route/filtersRoute.dto';
import { generateQueryByFiltersForRoute } from '../../configs/database/Queries';
import { Route } from '../../entities/route.entity';
import { DriverService } from '../../services/driver.service';
import { RouteWebsocket } from '../../entities/routeWebsocket.entity';

@Injectable()
export class RouteRepository
  extends Pageable<Route>
  implements IRouteRepository
{
  constructor(
    private readonly repository: PrismaService,
    private readonly driverService: DriverService,
  ) {
    super();
  }

  async findByIdWebsocket(id: string): Promise<any> {
    const data = await this.repository.route.findUnique({
      where: { id },
      select: {
        id: true,
        description: true,
        distance: true,
        driver: { select: { name: true } },
        status: true,
        type: true,
        createdAt: true,
        path: {
          select: {
            id: true,
            duration: true,
            finishedAt: true,
            startedAt: true,
            startsAt: true,
            status: true,
            type: true,
            createdAt: true,
            employeesOnPath: {
              orderBy: {
                position: 'asc',
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
        },
        vehicle: { select: { plate: true } },
      },
    });

    return data;
  }

  findByVehicleId(vehicleId: string): Promise<Route[]> {
    return this.repository.route.findMany({
      where: {
        vehicleId,
        deletedAt: null,
      },
      select: {
        id: true,
        description: true,
        distance: true,
        driver: true,
        status: true,
        type: true,
        createdAt: true,
        path: {
          select: {
            id: true,
            duration: true,
            finishedAt: true,
            startedAt: true,
            startsAt: true,
            status: true,
            type: true,
            createdAt: true,
            employeesOnPath: {
              orderBy: {
                position: 'asc',
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
        },
        vehicle: true,
      },
    });
  }

  async updateWebsocket(data: Route): Promise<RouteWebsocket> {
    return await this.repository.route.update({
      data: {
        id: data.id,
        description: data.description,
        distance: data.distance,
        status: data.status,
        type: data.type,
        updatedAt: getDateInLocaleTime(new Date()),
      },
      where: { id: data.id },
    });
  }

  delete(id: string): Promise<Route> {
    return this.repository.route.delete({
      where: { id },
    });
  }

  update(data: Route): Promise<Route> {
    return this.repository.route.update({
      data: {
        id: data.id,
        description: data.description,
        distance: data.distance,
        status: data.status,
        type: data.type,
        updatedAt: getDateInLocaleTime(new Date()),
      },
      where: { id: data.id },
    });
  }

  findById(id: string): Promise<Route> {
    return this.repository.route.findUnique({
      where: { id },
      select: {
        id: true,
        description: true,
        distance: true,
        driver: true,
        status: true,
        type: true,
        createdAt: true,
        path: {
          select: {
            id: true,
            duration: true,
            finishedAt: true,
            startedAt: true,
            startsAt: true,
            status: true,
            type: true,
            createdAt: true,
            employeesOnPath: {
              orderBy: {
                position: 'asc',
              },
              select: {
                id: true,
                boardingAt: true,
                confirmation: true,
                disembarkAt: true,
                position: true,
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
            },
          },
        },
        vehicle: true,
      },
    });
  }

  async findAll(
    page: Page,
    filters: FiltersRouteDTO,
  ): Promise<PageResponse<Route>> {
    const condition = generateQueryByFiltersForRoute(filters);

    const items = condition
      ? await this.repository.route.findMany({
          ...this.buildPage(page),
          where: {
            ...condition,
            deletedAt: null,
          },
          include: {
            driver: true,
            path: {
              include: {
                employeesOnPath: true,
              },
            },
            vehicle: true,
          },
        })
      : await this.repository.route.findMany({
          ...this.buildPage(page),
          where: {
            deletedAt: null,
          },
          include: {
            driver: true,
            path: {
              include: {
                employeesOnPath: {
                  orderBy: {
                    position: 'asc',
                  },
                  include: {
                    employee: {
                      select: {
                        name: true,
                        pins: {
                          include: {
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
            },
            vehicle: true,
          },
        });

    const total = condition
      ? await this.repository.route.findMany({
          where: {
            ...condition,
            deletedAt: null,
          },
        })
      : await this.repository.route.count({
          where: {
            deletedAt: null,
          },
        });

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  create(data: Route): Promise<Route> {
    return this.repository.route.create({
      data: {
        id: data.id,
        description: data.description,
        distance: data.distance,
        status: data.status,
        type: data.type,
        driverId: data.driver.id,
        vehicleId: data.vehicle.id,
      },
    });
  }

  findByDriverId(id: string): Promise<any> {
    return this.repository.route.findMany({
      where: {
        driverId: id,
        deletedAt: null,
        path: {
          every: {
            finishedAt: null,
          },
        },
      },
      select: {
        id: true,
        status: true,
        path: {
          select: {
            startedAt: true,
            finishedAt: true,
            status: true,
            startsAt: true,
            duration: true,
          },
        },
      },
    });
  }

  findByEmployeeIds(id: string[]): Promise<any> {
    return this.repository.route.findMany({
      where: {
        deletedAt: null,
        path: {
          every: {
            finishedAt: null,
          },
          some: {
            employeesOnPath: {
              some: {
                employeeId: {
                  in: id,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        type: true,
        description: true,
        path: {
          select: {
            employeesOnPath: {
              select: {
                employee: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
            startedAt: true,
            finishedAt: true,
            status: true,
            startsAt: true,
            duration: true,
          },
        },
      },
    });
  }

  async softDelete(id: string): Promise<Route> {
    return this.repository.route.update({
      where: { id },
      data: {
        status: 'deleted',
        deletedAt: getDateInLocaleTime(new Date()),
      },
    });
  }
}

