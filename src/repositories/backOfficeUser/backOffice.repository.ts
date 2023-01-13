import { Injectable } from '@nestjs/common';
import { Page, PageResponse } from 'src/configs/database/page.model';
import { Pageable } from 'src/configs/database/pageable.service';
import { PrismaService } from 'src/database/prisma.service';
import { BackOfficeUserCreateDTO } from 'src/dtos/auth/backOfficeUserLogin.dto';
import { BackOfficeUser } from 'src/entities/backOfficeUser.entity';
import IBackOfficeUserRepository from './backOffice.repository.contract';

@Injectable()
export class BackOfficeUserRepository
  extends Pageable<BackOfficeUser>
  implements IBackOfficeUserRepository
{
  constructor(private readonly repository: PrismaService) {
    super();}

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

  async update(data: BackOfficeUser): Promise<BackOfficeUser> {
    return await this.repository.backOfficeUser.update({
      where: {
        id: data.id,
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


}
