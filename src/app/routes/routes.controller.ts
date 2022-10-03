import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createRoutes } from '../dtos/routes/createRoutes.dto';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  create(@Body() createRouteDto: createRoutes) {
    console.log(createRouteDto)
    return this.routesService.create(createRouteDto);
  }

  @Get()
  findAll() {
    return this.routesService.getRoutes();
  }


}
