import { Injectable } from '@nestjs/common';
import { FiltersDriverDTO } from '../../dtos/driver/filtersDriver.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { Driver } from '../../entities/driver.entity';
import IDriverRepository from './driver.repository.contract';
import { generateQueryByFiltersForDriver } from '../../configs/database/Queries';
import { getDateInLocaleTime } from '../../utils/Date';

@Injectable()
export class DriverRepository
  extends Pageable<Driver>
  implements IDriverRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }

  delete(id: string): Promise<Driver> {
    return this.repository.driver.delete({
      where: { id },
    });
  }

  update(data: Driver): Promise<Driver> {
    return this.repository.driver.update({
      data: {
        category: data.category,
        cnh: data.cnh,
        cpf: data.cpf,
        name: data.name,
        // validation: data.validation,
        validation: getDateInLocaleTime(new Date(data.validation)),
      },
      where: {
        id: data.id,
      },
    });
  }

  findById(id: string): Promise<Driver> {
    return this.repository.driver.findUnique({
      where: { id },
    });
  }

  async findAll(
    page: Page,
    filters: FiltersDriverDTO,
  ): Promise<PageResponse<Driver>> {
    const condition = generateQueryByFiltersForDriver(filters);

    const items = condition
      ? await this.repository.driver.findMany({
          ...this.buildPage(page),
          where: condition,
        })
      : await this.repository.driver.findMany({
          ...this.buildPage(page),
        });

    const total = condition
      ? await this.repository.driver.findMany({
          where: {
            ...condition,
          },
        })
      : await this.repository.driver.count();

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  create(data: Driver): Promise<Driver> {
    return this.repository.driver.create({
      data: {
        id: data.id,
        category: data.category,
        cnh: data.cnh,
        cpf: data.cpf,
        name: data.name,
        // validation: data.validation,
        validation: getDateInLocaleTime(new Date(data.validation)),
      },
    });
  }
}
