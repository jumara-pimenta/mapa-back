import { Injectable } from '@nestjs/common';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { generateQueryByFiltersForUser } from '../../configs/database/Queries';
import { PrismaService } from '../../configs/database/prisma.service';
import { BackOfficeUserUpdateDTO } from '../../dtos/auth/backOfficeUserLogin.dto';
import { FilterBackOfficeUserDTO } from '../../dtos/auth/filterBackOfficeUser.dto';
import { BackOfficeUser } from '../../entities/backOfficeUser.entity';
import IBackOfficeUserRepository from './backOffice.repository.contract';

@Injectable()
export class BackOfficeUserRepository
  extends Pageable<BackOfficeUser>
  implements IBackOfficeUserRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }

  async updatePassword(id: string, password: string): Promise<BackOfficeUser> {
    return await this.repository.backOfficeUser.update({
      where: { id },
      data: {
        password,
      },
    });
  }

  async create(data: BackOfficeUser): Promise<BackOfficeUser> {
    return await this.repository.backOfficeUser.create({
      data,
    });
  }

  async getByEmail(email: string): Promise<BackOfficeUser> {
    return await this.repository.backOfficeUser.findUnique({
      where: {
        email,
      },
    });
  }

  async delete(id: string): Promise<BackOfficeUser> {
    return await this.repository.backOfficeUser.delete({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    data: BackOfficeUserUpdateDTO,
  ): Promise<BackOfficeUser> {
    return await this.repository.backOfficeUser.update({
      where: {
        id,
      },
      data,
    });
  }

  async findById(id: string): Promise<BackOfficeUser> {
    return await this.repository.backOfficeUser.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<BackOfficeUser> {
    return await this.repository.backOfficeUser.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll(
    page: Page,
    filters?: FilterBackOfficeUserDTO,
  ): Promise<PageResponse<BackOfficeUser>> {
    const condition = generateQueryByFiltersForUser(filters);
    const where = {
      ...condition,
    };

    const items = condition
      ? await this.repository.backOfficeUser.findMany({
          ...this.buildPage(page),
          where,
          orderBy: {
            createdAt: 'asc',
          },
        })
      : await this.repository.backOfficeUser.findMany({
          orderBy: {
            createdAt: 'asc',
          },
          ...this.buildPage(page),
        });

    const total = condition
      ? await this.repository.backOfficeUser.findMany({
          where,
        })
      : await this.repository.backOfficeUser.count();

    return this.buildPageResponse(
      items,
      Array.isArray(total) ? total.length : total,
    );
  }
}
