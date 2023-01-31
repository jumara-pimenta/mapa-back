import { Page, PageResponse } from 'src/configs/database/page.model';
import { PrismaService } from '../../configs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Pageable } from 'src/configs/database/pageable.service';
import { Sinister } from 'src/entities/sinister.entity';
import ISinisterRepository from './sinister.repository.contract';
import { FiltersSinisterDTO } from 'src/dtos/sinister/filtersSinister.dto';
import { generateQueryByFiltersForSinister } from 'src/configs/database/Queries';
import { Path } from 'src/entities/path.entity';
import { getDateInLocaleTime } from 'src/utils/Date';

@Injectable()
export class SinisterRepository
  extends Pageable<Sinister>
  implements ISinisterRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }

  listByPathId(id: string): Promise<Sinister[]> {
    return this.repository.sinister.findMany({
      where: {
        pathId: id,
      },
    });
  }
  create(data: Sinister): Promise<Sinister> {
    return this.repository.sinister.create({
      data: {
        id: data.id,
        type: data.type,
        pathId: data.pathId,
        createdBy: data.createdBy,
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

  async vinculatePath(
    sinister: Sinister,
    routeHistoryId: string,
    path: Path,
  ): Promise<any> {
    return this.repository.sinister.update({
      data: {
        routeHistoryId: routeHistoryId,
        pathId: '',
        updatedAt: getDateInLocaleTime(new Date()),
      },
      where: {
        id: sinister.id,
      },
    });
  }
}
