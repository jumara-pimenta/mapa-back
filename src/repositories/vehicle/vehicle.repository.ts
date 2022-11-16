import { Injectable } from "@nestjs/common";
import { Page, PageResponse } from "../../configs/database/page.model";
import { Pageable } from "../../configs/database/pageable.service";
import { PrismaService } from "../../configs/database/prisma.service";
import IVehicleRepository from "./vehicle.repository.contract";
import { getDateInLocaleTime } from "../../utils/date.service";
import { generateQueryByFiltersForVehicle } from "../../configs/database/Queries";
import { FiltersVehicleDTO } from "../../dtos/vehicle/filtersVehicle.dto";
import { Vehicle } from "../../entities/vehicle.entity";

@Injectable()
export class VehicleRepository extends Pageable<Vehicle> implements IVehicleRepository {
  constructor(
    private readonly repository: PrismaService
  ) {
    super()
  }

  delete(id: string): Promise<Vehicle> {
    return this.repository.vehicle.delete({
      where: { id }
    });
  }

  update(data: Vehicle): Promise<Vehicle> {
    return this.repository.vehicle.update({
      data: {
        id: data.id,
        capacity: data.capacity,
        company: data.company,
        expiration: data.expiration,
        lastMaintenance: data.lastMaintenance,
        lastSurvey: data.lastSurvey,
        note: data.note,
        plate: data.plate,
        renavam: data.renavam,
        type: data.type,
        isAccessibility: data.isAccessibility,
        updatedAt: getDateInLocaleTime(new Date())
      },
      where: { id: data.id }
    })
  }

  findById(id: string): Promise<Vehicle> {
    return this.repository.vehicle.findUnique({
      where: { id }
    })
  }

  async findAll(page: Page, filters: FiltersVehicleDTO): Promise<PageResponse<Vehicle>> {

    const condition = generateQueryByFiltersForVehicle(filters);

    const items = condition ? await this.repository.vehicle.findMany({
      ...this.buildPage(page),
      where: condition
    }) : await this.repository.vehicle.findMany({
      ...this.buildPage(page)
    });

    const total = condition ? await this.repository.vehicle.findMany({
      where: {
        ...condition
      }
    }) : await this.repository.vehicle.count();

    return this.buildPageResponse(items, Array.isArray(total) ? total.length : total);
  }

  create(data: Vehicle): Promise<Vehicle> {
    return this.repository.vehicle.create({
      data: {
        id: data.id,
        capacity: data.capacity,
        company: data.company,
        expiration: data.expiration,
        lastMaintenance: data.lastMaintenance,
        lastSurvey: data.lastSurvey,
        note: data.note,
        plate: data.plate,
        renavam: data.renavam,
        type: data.type,
        isAccessibility: data.isAccessibility
      }
    });
  }
}