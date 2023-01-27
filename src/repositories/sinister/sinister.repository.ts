import { PrismaService } from 'src/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Pageable } from 'src/configs/database/pageable.service';
import { Sinister } from 'src/entities/sinister.entity';
import ISinisterRepository from './sinister.repository.contract';

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
}
