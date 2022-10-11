import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Routes } from '@prisma/client';
import { AppMessageError, PrismaCodeError, PrismaMessageError } from 'src/constants/exceptions';
import { PrismaService } from 'src/database/prisma.service';
import { createRoutes } from '../dtos/routes/createRoutes.dto';
import { createRoutesRelation,getRoutesRelation } from './relationService';
@Injectable()
export class RoutesService {
  constructor(private readonly prismaService: PrismaService) { }


  async create(createRoute: createRoutes): Promise<Routes> {
    try {
      const route = await createRoutesRelation(this.prismaService,createRoute)
      return route
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaCodeError.UNIQUE_CONSTRAINT
      ) {
        throw new BadGatewayException(
          PrismaMessageError.UNIQUE_CONSTRAINT_VIOLATION,
        );
      }
      throw error;
    }

  }

  async findAll() {
    const route = await this.prismaService.routes.findMany()

    if (route.length === 0) {
      throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
    }

    return route;
  }

  async getRoutes() {
    const route = await getRoutesRelation(this.prismaService)
    return route;
  }

}
