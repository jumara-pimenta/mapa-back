import { Injectable } from '@nestjs/common';
import { FiltersPinDTO } from '../../dtos/pin/filtersPin.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { Pin } from '../../entities/pin.entity';
import IPinRepository from './pin.repository.contract';
import { generateQueryForPins } from '../../utils/QueriesPins';
import { getDateInLocaleTimeManaus } from '../../utils/Date';

@Injectable()
export class PinRepository extends Pageable<Pin> implements IPinRepository {
  constructor(private readonly repository: PrismaService) {
    super();
  }
  findByLocal(details: string): Promise<Pin> {
    return this.repository.pin.findFirst({
      where: {
        details,
      },
    });
  }

  findByLocalExcel(local: string): Promise<Pin> {
    return this.repository.pin.findFirst({
      where: {
        local,
      },
    });
  }


  delete(id: string): Promise<any> {
    return this.repository.pin.delete({
      where: { id },
    });
  }

  update(data: Pin): Promise<any> {
    return this.repository.pin.update({
      data: {
        id: data.id,
        title: data.title,
        local: data.local,
        details: data.details,
        district: data.district,
        lat: data.lat,
        lng: data.lng,
        updatedAt: getDateInLocaleTimeManaus(new Date()),
      },
      where: { id: data.id },
    });
  }

  findById(id: string): Promise<Pin> {
    return this.repository.pin.findUnique({
      where: { id },
    });
  }

  async findAll(
    page: Page,
    filters: FiltersPinDTO,
  ): Promise<PageResponse<Pin>> {
    const condition = generateQueryForPins(filters);

    const items = condition
      ? await this.repository.pin.findMany({
          ...this.buildPage(page),
          where: condition,
          orderBy: {
            createdAt: 'desc',
          },
        })
      : await this.repository.pin.findMany({
          ...this.buildPage(page),
          orderBy: {
            createdAt: 'desc',
          },
        });

    const total = condition
      ? await this.repository.pin.findMany({
          where: {
            ...condition,
          },
        })
      : await this.repository.pin.count();

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }

  create(data: Pin): Promise<Pin> {
    return this.repository.pin.create({
      data: {
        id: data.id,
        title: data.title,
        local: data.local,
        details: data.details,
        district: data.district,
        lat: data.lat,
        createdAt: data.createdAt,
        lng: data.lng,
      },
    });
  }
}
