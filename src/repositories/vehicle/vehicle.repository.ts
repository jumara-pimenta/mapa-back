import { Injectable } from '@nestjs/common';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import IVehicleRepository from './vehicle.repository.contract';
import { generateQueryByFiltersForVehicle } from '../../configs/database/Queries';
import { FiltersVehicleDTO } from '../../dtos/vehicle/filtersVehicle.dto';
import { Vehicle } from '../../entities/vehicle.entity';
import { getDateInLocaleTime } from '../../utils/Date';

@Injectable()
export class VehicleRepository
  extends Pageable<Vehicle>
  implements IVehicleRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }

  delete(id: string): Promise<Vehicle> {
    return this.repository.vehicle.delete({
      where: { id },
    });
  }

  update(data: Vehicle): Promise<Vehicle> {
    return this.repository.vehicle.update({
      data: {
        id: data.id,
        capacity: data.capacity,
        company: data.company,
        expiration: getDateInLocaleTime(data.expiration),
        lastMaintenance: data.lastMaintenance
          ? getDateInLocaleTime(data.lastMaintenance)
          : null,
        lastSurvey: data.lastSurvey
          ? getDateInLocaleTime(data.lastSurvey)
          : null,
        note: data.note,
        plate: data.plate,
        renavam: data.renavam,
        type: data.type,
        isAccessibility: data.isAccessibility,
        updatedAt: getDateInLocaleTime(new Date()),
      },
      where: { id: data.id },
    });
  }

  findById(id: string): Promise<Vehicle> {
    return this.repository.vehicle.findUnique({
      where: { id: id },
    });
  }

  async findAllExport(): Promise<PageResponse<Vehicle>> {
    const items = await this.repository.vehicle.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return this.buildPageResponse(items, items.length);
  }

  async findAll(
    page: Page,
    filters: FiltersVehicleDTO,
  ): Promise<PageResponse<Vehicle>> {
    const condition = generateQueryByFiltersForVehicle(filters);

    const items = condition
      ? await this.repository.vehicle.findMany({
          ...this.buildPage(page),
          where: {
            id: { not: process.env.DENSO_ID },
            ...condition,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
      : await this.repository.vehicle.findMany({
          ...this.buildPage(page),
          where: {
            id: { not: process.env.DENSO_ID },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

    const total = condition
      ? await this.repository.vehicle.findMany({
          where: {
            ...condition,
            id: { not: process.env.DENSO_ID },
          },
        })
      : await this.repository.vehicle.count({
          where: {
            id: { not: process.env.DENSO_ID },
          },
        });

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  create(data: Vehicle): Promise<Vehicle> {
    return this.repository.vehicle.create({
      data: {
        ...data,
        id: data.id,
        capacity: data.capacity,
        company: data.company,
        expiration: getDateInLocaleTime(data.expiration),
        lastMaintenance: data.lastMaintenance
          && getDateInLocaleTime(data.lastMaintenance),
        lastSurvey: data.lastSurvey
          && getDateInLocaleTime(data.lastSurvey),
        plate: data.plate,
        type: data.type,
        isAccessibility: data.isAccessibility,
      },
    });
  }

  findByPlate(plate: string): Promise<Vehicle> {
    return this.repository.vehicle.findUnique({
      where: { plate },
    });
  }

  findByRenavam(renavam: string): Promise<Vehicle> {
    return this.repository.vehicle.findFirst({
      where: {
        renavam: renavam,
      },
    });
  }
}
