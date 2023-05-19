import { Injectable } from '@nestjs/common';
import { FiltersDriverDTO } from '../../dtos/driver/filtersDriver.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { Driver } from '../../entities/driver.entity';
import IDriverRepository from './driver.repository.contract';
import { generateQueryByFiltersForDriver } from '../../configs/database/Queries';
import { getDateInLocaleTime } from '../../utils/Date';
import * as bcrypt from 'bcrypt';

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

  findByCpf(cpf: string): Promise<Driver> {
    return this.repository.driver.findUnique({
      where: { cpf },
    });
  }

  findByCnh(cnh: string): Promise<Driver> {
    return this.repository.driver.findUnique({
      where: { cnh },
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
          where: {
            ...condition,
            id: {
              not: process.env.DENSO_ID,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
      : await this.repository.driver.findMany({
          ...this.buildPage(page),
          where: {
            id: {
              not: process.env.DENSO_ID,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

    const total = condition
      ? await this.repository.driver.findMany({
          where: {
            ...condition,
            id: {
              not: process.env.DENSO_ID,
            },
          },
        })
      : await this.repository.driver.count({
          where: {
            id: {
              not: process.env.DENSO_ID,
            },
          },
        });

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  async findAllExport(): Promise<PageResponse<Driver>> {
    const items = await this.repository.driver.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.repository.driver.findMany({});

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  findByDrivers(): Promise<Driver[]> {
    return this.repository.driver.findMany();
  }

  create(data: Driver): Promise<Driver> {
    return this.repository.driver.create({
      data: {
        id: data.id,
        category: data.category,
        password: data.password,
        cnh: data.cnh,
        cpf: data.cpf,
        name: data.name,
        firstAccess: true,
        validation: new Date(data.validation),
      },
    });
  }

  updateDriverPassword(cpf: string, password: string): Promise<Driver>{
    return this.repository.driver.update({
      where: {
        cpf: cpf
      },
      data: {
        password: password,
        firstAccess: false,
        updatedAt: new Date()
      }
    })
  }

  async resetDriverPassword(cpf: string): Promise<Driver>{
    return this.repository.driver.update({
      where: {
        cpf: cpf
      },
      data: {
        password: await bcrypt.hash(cpf, 10),
        firstAccess: true,
        updatedAt: new Date()
      }
    })
  }

}
