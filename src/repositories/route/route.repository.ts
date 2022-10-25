import { Injectable } from "@nestjs/common";
import { Page, PageResponse } from "../../configs/database/page.model";
import { Pageable } from "../../configs/database/pageable.service";
import { PrismaService } from "../../configs/database/prisma.service";
import IRouteRepository from "./route.repository.contract";
import { getDateInLocaleTime } from "../../utils/date.service";
import { FiltersRouteDTO } from "../../dtos/route/filtersRoute.dto";
import { generateQueryByFiltersForRoute } from "../../configs/database/Queries";
import { Route } from "../../entities/route.entity";

@Injectable()
export class RouteRepository extends Pageable<Route> implements IRouteRepository {
  constructor(
    private readonly repository: PrismaService
  ) {
    super()
  }

  delete(id: string): Promise<Route> {
    return this.repository.route.delete({
      where: { id }
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
        updatedAt: getDateInLocaleTime(new Date())
      },
      where: { id: data.id }
    })
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
                            long: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        vehicle: true
      }   
    })
  }

  async findAll(page: Page, filters: FiltersRouteDTO): Promise<PageResponse<Route>> {

    const condition = generateQueryByFiltersForRoute(filters);

    const items = condition ? await this.repository.route.findMany({
      ...this.buildPage(page),
      where: condition,
      include: {
        driver: true,
        path: {
          include: {
            employeesOnPath: true
          }
        },
        vehicle: true,
      }
    }) : await this.repository.route.findMany({
      ...this.buildPage(page),
      include: {
        driver: true,
        path: {
          include: {
            employeesOnPath: {
              include: {
                employee: {
                  select: {
                    pins: {
                      include: {
                        pin: {
                          select: {
                            lat: true,
                            long: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        vehicle: true,
      }
    });

    const total = condition ? await this.repository.route.findMany({
      where: {
        ...condition
      }
    }) : await this.repository.route.count();

    return this.buildPageResponse(items, Array.isArray(total) ? total.length : total);
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
        vehicleId: data.vehicle.id
      }
    });
  }
}