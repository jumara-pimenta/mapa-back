import { Injectable } from '@nestjs/common';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';

import { getDateInLocaleTimeManaus } from '../../utils/Date';
import IScheduledWorkRepository from './scheduledWork.repository.contract';
import { ScheduledWork } from '../../entities/scheduledWork.entity';
import { getMidnightRange } from '../../utils/date.service';

@Injectable()
export class ScheduledWorkRepository
  extends Pageable<ScheduledWork>
  implements IScheduledWorkRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }

  async update(data: ScheduledWork): Promise<ScheduledWork> {
    return await this.repository.scheduledWork.update({
      data: {
        id: data.id,
        entity: data.entity,
        idEntity: data.idEntity,
        status: data.status,
        scheduledDate: data.scheduledDate,
        updatedAt: getDateInLocaleTimeManaus(new Date()),
      },
      where: { id: data.id },
    });
  }

  async findManyByEntityAndStatusToday(
    entity: string,
    status: string,
  ): Promise<Array<ScheduledWork>> {
    const { init, end } = getMidnightRange(new Date());

    return await this.repository.scheduledWork.findMany({
      where: {
        entity,
        status,
        scheduledDate: {
          gte: init,
          lte: end
        },
      },
    });
  }

  create(data: ScheduledWork): Promise<ScheduledWork> {
    return this.repository.scheduledWork.create({
      data: {
        id: data.id,
        entity: data.entity,
        idEntity: data.idEntity,
        status: data.status,
        scheduledDate: data.scheduledDate,
      },
    });
  }
}
