import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Routes } from '@prisma/client';
import { AppMessageError } from 'src/constants/exceptions';
import { PrismaService } from 'src/database/prisma.service';
@Injectable()
export class RoutesService {
  constructor(private readonly prismaService: PrismaService) { }


  async create(createRoute: Prisma.RoutesCreateInput): Promise<Routes> {
    const route = await this.prismaService.routes.create({data:createRoute,})
    return route
  }

  async findAll() {
    const route = await this.prismaService.routes.findMany()

    if (route.length === 0) {
      throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
    }

    return route;
  }

}
