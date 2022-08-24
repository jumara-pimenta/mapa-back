import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DriversService } from './drivers.service';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async create(@Body() createDriver: Prisma.DriverCreateInput) {
    return await this.driversService.create(createDriver);
  }

  @Get()
  async findAll() {
    return await this.driversService.findAll();
  }

  @Get('search')
  async search(@Query('column') column: string, @Query('value') value: string) {
    return await this.driversService.search(column, value);
  }
}
