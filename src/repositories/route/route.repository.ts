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

import { ETypeRouteExport } from '../../utils/ETypes';
import { TTypeRoute } from '../../utils/TTypes';

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

  async findRouteWithPaths(id: string): Promise<Partial<Route>> { 
    return await this.repository.route.findUnique({
      where: {
        id
      },
      select: {
        description: true,
        path: {
          select: {
            type: true
          }
        }
      }
    })
  }

  async updateTotalDistance(id: string, totalDistance: string): Promise<Route> {
    return await this.repository.route.update({
      data: {
        distance: totalDistance,
      },
      where: { id },
    });
  }

  async findEmployeeOnRouteByType(
    employeeId: string,
    type: TTypeRoute,
  ): Promise<Route> {
    return await this.repository.route.findFirst({
      where: {
        type,
        NOT: {
          status: 'deleted',
        },
        path: {
          some: {
            employeesOnPath: {
              some: {
                employee: {
                  id: employeeId,
                },
              },
            },
          },
        },
      },
    });
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
          where: {
            deletedAt: null,
          },
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
        path: {
          some: {
            deletedAt: null,
          },
        },
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
          where: {
            deletedAt: null,
          },
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

  async update(data: Route): Promise<Route> {
    return await this.repository.route.update({
      data: {
        id: data.id,
        driverId: data.driver.id,
        vehicleId: data.vehicle.id,
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
    return this.repository.route.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        description: true,
        distance: true,
        driver: true,
        status: true,
        type: true,
        createdAt: true,
        path: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            duration: true,
            finishedAt: true,
            startedAt: true,
            startsAt: true,
            status: true,
            type: true,
            createdAt: true,
            route: {
              select: {
                id: true
              }
            },
            employeesOnPath: {
              orderBy: {
                position: 'asc',
              },
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
          // not show where employe is deletedAt: null

          where: {
            ...condition,
            deletedAt: null,

            path: {
              some: {
                deletedAt: null,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },

          include: {
            driver: true,
            path: {
              where: {
                deletedAt: null,
              },
              include: {
                employeesOnPath: {
                  orderBy: {
                    position: 'asc',
                  },
                  where: {
                    employee: {
                      deletedAt: null,
                    },
                  },
                  include: {
                    employee: {
                      select: {
                        name: true,
                        id: true,
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
        })
      : await this.repository.route.findMany({
          ...this.buildPage(page),
          where: {
            deletedAt: null,
            path: {
              some: {
                deletedAt: null,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            driver: true,
            path: {
              where: {
                deletedAt: null,
              },
              include: {
                employeesOnPath: {
                  orderBy: {
                    position: 'asc',
                  },
                  where: {
                    employee: {
                      deletedAt: null,
                    },
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
              orderBy: {
                createdAt: 'desc',
              },
            },
            vehicle: true,
          },
        });

    const total = condition
      ? await this.repository.route.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            ...condition,
            deletedAt: null,
            path: {
              some: {
                deletedAt: null,
              },
            },
          },
        })
      : await this.repository.route.count({
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            deletedAt: null,
            path: {
              some: {
                deletedAt: null,
              },
            },
          },
        });

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  async findAllToExport(
    page: Page,
    type: ETypeRouteExport,
  ): Promise<PageResponse<Route>> {
    const items = await this.repository.route.findMany({
      ...this.buildPage(page),
      where: {
        type: type,
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
              where: {
                employee: {
                  deletedAt: null,
                },
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

    const total = await this.repository.route.findMany({
      where: {
        type: type,
        deletedAt: null,
      },
    });

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  async listByDriverId(
    driverId: string,
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
            driverId,
            path: {
              some: {
                deletedAt: null,
              },
            },
          },
          include: {
            driver: true,
            path: {
              where: {
                deletedAt: null,
              },
              include: {
                employeesOnPath: {
                  orderBy: {
                    position: 'desc',
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
              orderBy: {
                createdAt: 'desc',
              },
            },
            vehicle: true,
          },
        })
      : await this.repository.route.findMany({
          ...this.buildPage(page),
          where: {
            deletedAt: null,
            driverId,
            path: {
              some: {
                deletedAt: null,
              },
            },
          },
          include: {
            driver: true,
            path: {
              include: {
                employeesOnPath: {
                  orderBy: {
                    position: 'desc',
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
              orderBy: {
                createdAt: 'desc',
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
            driverId,
            path: {
              some: {
                deletedAt: null,
              },
            },
          },
        })
      : await this.repository.route.count({
          where: {
            deletedAt: null,
            driverId,
            path: {
              some: {
                deletedAt: null,
              },
            },
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
          some: {
            deletedAt: null,
          },
        },
      },

      select: {
        id: true,
        status: true,
        path: {
          where: {
            deletedAt: null,
          },
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
            deletedAt: null,
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
          where: {
            deletedAt: null,
          },
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
            type: true,
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

  async findRouteIdByPathId(pathid: string): Promise<string> {
    const data = await this.repository.route.findFirst({
      where: {
        path: {
          some: {
            id: pathid,
            deletedAt: null,
          },
          // if all paths are deleted, the route is deleted
        },
      },
      select: {
        id: true,
        type: true,
      },
    });

    return data.id;
  }

  async findRouteDataByPathId(pathId: string): Promise<any> {
    const data = await this.repository.route.findFirst({
      where: {
        path: {
          some: {
            id: pathId,
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
        vehicleId: true,
        driverId: true,
      },
    });

    return data.id;
  }
}
