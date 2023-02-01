import { Page, PageResponse } from '../../configs/database/page.model';
import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Pageable } from '../../configs/database/pageable.service';
import { Sinister } from '../../entities/sinister.entity';
import ISinisterRepository from './sinister.repository.contract';
import { FiltersSinisterDTO } from '../../dtos/sinister/filtersSinister.dto';
import { generateQueryByFiltersForSinister } from '../../configs/database/Queries';

@Injectable()
export class SinisterRepository
  extends Pageable<Sinister>
  implements ISinisterRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }

  create(data: Sinister): Promise<Sinister> {
    return this.repository.sinister.create({
      data: {
        id: data.id,
        type: data.type,
        description: data.description,
        createdAt: data.createdAt,
      },
    });
  }

  findById(id: string): Promise<Sinister> {
    return this.repository.sinister.findUnique({
      where: { id },
    });
  }

  update(data: Sinister): Promise<Sinister> {
    return this.repository.sinister.update({
      data: {
        type: data.type,
        description: data.description,
      },
      where: {
        id: data.id,
      },
    });
  }

  async findAll(
    page: Page,
    filters: FiltersSinisterDTO,
  ): Promise<PageResponse<Sinister>> {
    const condition = generateQueryByFiltersForSinister(filters);

    const items = condition
      ? await this.repository.sinister.findMany({
          ...this.buildPage(page),
          where: condition,
        })
      : await this.repository.sinister.findMany({
          ...this.buildPage(page),
        });

    const total = condition
      ? await this.repository.sinister.findMany({
          where: {
            ...condition,
          },
        })
      : await this.repository.sinister.count();

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }
}
